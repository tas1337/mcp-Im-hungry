# mcp-im-hungry 🍔

An MCP server that connects AI agents to food delivery APIs and user data.

## What is MCP?

MCP (Model Context Protocol) is a protocol for AI agents to talk to data sources. Think USB-C for AI - one standard interface that works with any data source.

Before MCP, connecting an AI to DoorDash + Uber Eats + your user database meant writing 3 different integrations. With MCP, you write one integration per service, and any AI that speaks MCP can use them all.

## What This Server Does

![Demo Screenshot](./images/Chart.jpg)

The server aggregates data from multiple delivery services into a unified interface. The agent uses this data to make decisions.

**Note:** This is a tutorial/example implementation using mock data. 

## Quick Start

```bash
git clone https://github.com/tas1337/mcp-Im-hungry.git
cd mcp-Im-hungry
npm install
npm run build
```

Then configure Cursor (see [Connect to Cursor](#connect-to-cursor) section below).

To test the server with the MCP Inspector:
```bash
npm run inspect
```

## Project Structure

```
src/
├── index.ts          # Entry point
├── server.ts         # MCP server setup and handlers
├── tools.ts          # Tool definitions and handlers
├── resources.ts      # Resource definitions and readers
├── api-clients.ts    # API client functions (currently returns mock data)
├── mock-data.ts      # All mock data (restaurants, menus, user data)
└── types.ts          # TypeScript type definitions
```

## Tools

| Tool | Description |
|------|-------------|
| `search_restaurants` | Search across DoorDash, Uber Eats, Grubhub |
| `get_menu` | Get full menu for a specific restaurant |
| `search_menu_items` | Search for specific dishes across ALL restaurants |
| `check_delivery_estimate` | Get delivery times and fees |

## Resources

| Resource | Description |
|----------|-------------|
| `user://preferences` | Dietary restrictions, favorite cuisines, price range |
| `user://location` | Delivery address |
| `user://order-history` | Past orders for recommendations |

## Example Flow

1. User: "I want a cheeseburger"
2. AI reads `user://location` → San Francisco, CA
3. AI calls `search_restaurants({ query: "burger" })`
4. Server queries DoorDash + Uber Eats + Grubhub (currently returns mock data)
5. Returns: In-N-Out (4.8⭐), Shake Shack (4.6⭐), Five Guys (4.3⭐)...
6. AI calls `get_menu({ restaurantId: "ue-in-n-out" })`
7. Returns: Double-Double ($5.90), Cheeseburger ($3.65)...
8. AI recommends based on user preferences

## Connect to Cursor

### Step 1: Clone and Build

```bash
git clone https://github.com/tas1337/mcp-Im-hungry.git
cd mcp-Im-hungry
npm install
npm run build
```

### Step 2: Create MCP Config (Project-specific - Recommended)

Create `.cursor/mcp.json` in the project root:

**Windows:**
```json
{
  "mcpServers": {
    "im-hungry": {
      "command": "node",
      "args": ["C:/Users/YourName/Documents/mcp-Im-hungry/dist/index.js"]
    }
  }
}
```

**Mac/Linux:**
```json
{
  "mcpServers": {
    "im-hungry": {
      "command": "node",
      "args": ["/path/to/mcp-Im-hungry/dist/index.js"]
    }
  }
}
```

**Note:** 
- Use forward slashes `/` in paths (works on Windows too)
- Replace the path with your actual project path (use absolute path)
- You can use `pwd` (Mac/Linux) or `cd` (Windows) to get your current directory path

### Alternative: Global Config

If you prefer a global config (works across all projects):

**Windows:** `%APPDATA%\Cursor\User\mcp.json`  
**Mac/Linux:** `~/.cursor/mcp.json` or `~/.config/Cursor/User/mcp.json`

Use the same JSON format as above.

### Step 3: Enable MCP in Cursor Settings

**Important:** MCP servers must be enabled in Cursor settings!

1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Search for "MCP" or "Tools"
3. Find the "MCP Servers" or "Model Context Protocol" section
4. Make sure your `im-hungry` server is listed and **enabled**
5. If it's disabled, toggle it on

### Step 4: Restart Cursor

Close and reopen Cursor completely for the changes to take effect.

### Step 5: Verify It's Working

1. Open a chat in Cursor
2. Ask: "I want a cheeseburger"
3. The AI should automatically use `search_restaurants` and `get_menu` tools
4. You should see restaurant results and menu items

**Troubleshooting:**
- If the AI doesn't use the tools, check Cursor Settings → MCP → make sure the server is **enabled**
- Check the Output panel (View → Output) for MCP errors
- Verify `dist/index.js` exists: `npm run build`
- Try restarting Cursor completely

## Connect to Claude Desktop

**Mac** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "im-hungry": {
      "command": "node",
      "args": ["/path/to/mcp-im-hungry/dist/index.js"]
    }
  }
}
```

**Windows** (`%APPDATA%\Claude\claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "im-hungry": {
      "command": "node",
      "args": ["C:\\Users\\YourName\\Documents\\mcp-Im-hungry\\dist\\index.js"]
    }
  }
}
```

## Adding Real API Integration

To use real APIs instead of mock data:

1. Add your API keys to environment variables
2. Update `src/api-clients.ts` - replace TODO comments with actual API calls
3. Update `src/resources.ts` - replace mock data with database queries
4. Restart the server

## Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
