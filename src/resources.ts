import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import { mockUserPreferences, mockUserLocation, mockOrderHistory } from './mock-data.js';

// Resource definitions - URI format is custom (not required by SDK)
// Server.ts uses these URIs to route requests to the correct function
export const userPreferencesResource: Resource = {
  uri: 'user://preferences',
  name: 'User Preferences',
  description: 'Dietary restrictions, favorite cuisines, price range',
  mimeType: 'application/json',
};

export const userLocationResource: Resource = {
  uri: 'user://location',
  name: 'User Location',
  description: 'Delivery address',
  mimeType: 'application/json',
};

export const userOrderHistoryResource: Resource = {
  uri: 'user://order-history',
  name: 'Order History',
  description: 'Past orders for recommendations',
  mimeType: 'application/json',
};

// Called by server.ts when AI requests user://preferences
// TODO: Replace mock data with real database query
export async function readUserPreferences(): Promise<string> {
  return JSON.stringify(mockUserPreferences, null, 2);
}

// Called by server.ts when AI requests user://location
// TODO: Replace mock data with real database query
export async function readUserLocation(): Promise<string> {
  return JSON.stringify(mockUserLocation, null, 2);
}

// Called by server.ts when AI requests user://order-history
// TODO: Replace mock data with real database query
export async function readOrderHistory(): Promise<string> {
  return JSON.stringify(mockOrderHistory, null, 2);
}

