import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  searchRestaurantsTool,
  getMenuTool,
  searchMenuItemsTool,
  checkDeliveryEstimateTool,
  handleSearchRestaurants,
  handleGetMenu,
  handleSearchMenuItems,
  handleCheckDeliveryEstimate,
} from './tools.js';

import {
  userPreferencesResource,
  userLocationResource,
  userOrderHistoryResource,
  readUserPreferences,
  readUserLocation,
  readOrderHistory,
} from './resources.js';

// Creates and configures the MCP server
// Each setRequestHandler registers a different type of request the AI can make
// MCP protocol has 4 different request types, so we need 4 handlers
export async function createServer(): Promise<Server> {
  const server = new Server(
    {
      name: 'mcp-im-hungry',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // Handler 1: ListToolsRequest - AI asks "What tools do you have?"
  // Returns the list of available tools (search_restaurants, get_menu, etc.)
  // This is how the AI discovers what functions it can call
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [searchRestaurantsTool, getMenuTool, searchMenuItemsTool, checkDeliveryEstimateTool],
  }));

  // Handler 2: ListResourcesRequest - AI asks "What resources do you have?"
  // Returns the list of available resources (user://preferences, user://location, etc.)
  // This is how the AI discovers what data it can read
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [userPreferencesResource, userLocationResource, userOrderHistoryResource],
  }));

  // Handler 3: ReadResourceRequest - AI requests specific resource data
  // Example: AI says "Give me user://preferences"
  // Routes to the correct reader function and returns the actual data
  server.setRequestHandler(ReadResourceRequestSchema, async (request: any) => {
    const { uri } = request.params;
    let text = '';

    switch (uri) {
      case 'user://preferences':
        text = await readUserPreferences();
        break;
      case 'user://location':
        text = await readUserLocation();
        break;
      case 'user://order-history':
        text = await readOrderHistory();
        break;
      default:
        throw new Error(`Unknown resource: ${uri}`);
    }

    return {
      contents: [{ uri, mimeType: 'application/json', text }],
    };
  });

  // Handler 4: CallToolRequest - AI calls a tool function
  // Example: AI says "Call search_restaurants with query='pizza'"
  // Routes to the correct handler function, executes it, and returns the result
  server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
    const { name, arguments: args } = request.params;

    try {
      let result: any;

      switch (name) {
        case 'search_restaurants':
          result = await handleSearchRestaurants(args as any);
          break;
        case 'get_menu':
          result = await handleGetMenu(args as any);
          break;
        case 'search_menu_items':
          result = await handleSearchMenuItems(args as any);
          break;
        case 'check_delivery_estimate':
          result = await handleCheckDeliveryEstimate(args as any);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = await createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Im Hungry server running on stdio');
}
