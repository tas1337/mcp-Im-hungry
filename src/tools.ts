import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Restaurant, Menu, MenuItem, DeliveryEstimate } from './types.js';
import {
  searchDoorDash,
  getDoorDashMenu,
  searchUberEats,
  getUberEatsMenu,
  searchGrubhub,
  getGrubhubMenu,
} from './api-clients.js';

// Tool definitions - server.ts uses these to tell AI what functions are available
export const searchRestaurantsTool: Tool = {
  name: 'search_restaurants',
  description: 'Search for restaurants across DoorDash, Uber Eats, and Grubhub',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query (e.g., "burger", "pizza")' },
      location: { type: 'string', description: 'Delivery location (address, city, state zip)' },
    },
    required: ['query', 'location'],
  },
};

export const getMenuTool: Tool = {
  name: 'get_menu',
  description: 'Get the full menu for a specific restaurant',
  inputSchema: {
    type: 'object',
    properties: {
      restaurantId: { type: 'string', description: 'Restaurant ID (format: "dd-{id}", "ue-{id}", or "gh-{id}")' },
    },
    required: ['restaurantId'],
  },
};

export const searchMenuItemsTool: Tool = {
  name: 'search_menu_items',
  description: 'Search for specific dishes across ALL restaurants',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Dish name to search for' },
      location: { type: 'string', description: 'Delivery location' },
      limit: { type: 'number', description: 'Maximum results (default: 20)' },
    },
    required: ['query', 'location'],
  },
};

export const checkDeliveryEstimateTool: Tool = {
  name: 'check_delivery_estimate',
  description: 'Get delivery time estimate and fees for a restaurant',
  inputSchema: {
    type: 'object',
    properties: {
      restaurantId: { type: 'string', description: 'Restaurant ID' },
      location: { type: 'string', description: 'Delivery location' },
    },
    required: ['restaurantId', 'location'],
  },
};

// Called by server.ts when AI calls search_restaurants tool
// Uses api-clients.ts which returns mock data from mock-data.ts
export async function handleSearchRestaurants(
  args: { query: string; location: string }
): Promise<Restaurant[]> {
  const [doordash, ubereats, grubhub] = await Promise.allSettled([
    searchDoorDash(args.query, args.location),
    searchUberEats(args.query, args.location),
    searchGrubhub(args.query, args.location),
  ]);

  const results: Restaurant[] = [];
  if (doordash.status === 'fulfilled') results.push(...doordash.value);
  if (ubereats.status === 'fulfilled') results.push(...ubereats.value);
  if (grubhub.status === 'fulfilled') results.push(...grubhub.value);

  return results.sort((a, b) => b.rating - a.rating);
}

// Called by server.ts when AI calls get_menu tool
// Routes by restaurant ID prefix (dd-, ue-, or gh-) to correct API client
export async function handleGetMenu(
  args: { restaurantId: string }
): Promise<Menu> {
  const { restaurantId } = args;

  if (restaurantId.startsWith('dd-')) {
    return getDoorDashMenu(restaurantId);
  } else if (restaurantId.startsWith('ue-')) {
    return getUberEatsMenu(restaurantId);
  } else if (restaurantId.startsWith('gh-')) {
    return getGrubhubMenu(restaurantId);
  } else {
    throw new Error('Invalid restaurant ID format');
  }
}

// Called by server.ts when AI calls search_menu_items tool
// Searches restaurants, gets menus, then finds matching dishes
export async function handleSearchMenuItems(
  args: { query: string; location: string; limit?: number }
): Promise<Array<MenuItem & { restaurantId: string; restaurantName: string; service: string }>> {
  const restaurants = await handleSearchRestaurants(
    { query: args.query, location: args.location }
  );

  const allItems: Array<MenuItem & { restaurantId: string; restaurantName: string; service: string }> = [];
  const queryLower = args.query.toLowerCase();

  for (const restaurant of restaurants.slice(0, 10)) {
    try {
      const menu = await handleGetMenu({ restaurantId: restaurant.id });
      const matching = menu.items.filter(
        (item) =>
          item.name.toLowerCase().includes(queryLower) ||
          item.description?.toLowerCase().includes(queryLower)
      );

      matching.forEach((item) => {
        allItems.push({
          ...item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          service: restaurant.service,
        });
      });
    } catch (error) {
      // Skip restaurants that fail
    }
  }

  return allItems.slice(0, args.limit || 20);
}

// Called by server.ts when AI calls check_delivery_estimate tool
// TODO: Replace mock data with real API call
export async function handleCheckDeliveryEstimate(
  args: { restaurantId: string; location: string }
): Promise<DeliveryEstimate> {
  const service = args.restaurantId.startsWith('dd-')
    ? 'doordash'
    : args.restaurantId.startsWith('ue-')
    ? 'ubereats'
    : 'grubhub';

  return {
    restaurantId: args.restaurantId,
    restaurantName: 'Unknown',
    estimatedTime: 30,
    deliveryFee: 5.99,
    minimumOrder: 15.0,
    service,
  };
}

