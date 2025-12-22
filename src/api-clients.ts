// =============================================================================
// API CLIENTS
// =============================================================================
// Functions that call food delivery APIs (DoorDash, UberEats, Grubhub).
//
// CURRENT STATE:
// - All functions return mock data (from mock-data.ts)
// - TODO: Replace with real API calls
//
// HOW IT WORKS:
// - Each service has a search function (finds restaurants)
// - Each service has a getMenu function (gets restaurant menu)
// - Functions are called by tools.ts handlers
//
// KEY DIFFERENCE FROM A2A VERSION:
// - Basic MCP: Direct API calls (this file)
// - A2A MCP:   Calls other agents via A2A protocol (no direct API calls)
// =============================================================================

import type { Restaurant, Menu } from './types.js';
import { getMockRestaurants, getMockMenu } from './mock-data.js';

// ---------------------------------------------------------------------------
// DOORDASH API CLIENT
// ---------------------------------------------------------------------------

export async function searchDoorDash(
  query: string,
  location: string,
  apiKey?: string
): Promise<Restaurant[]> {
  // TODO: Add real DoorDash API call here
  return getMockRestaurants(query, 'doordash');
}

export async function getDoorDashMenu(
  restaurantId: string,
  apiKey?: string
): Promise<Menu> {
  // TODO: Add real DoorDash menu API call here
  return getMockMenu(restaurantId);
}

// ---------------------------------------------------------------------------
// UBER EATS API CLIENT
// ---------------------------------------------------------------------------

export async function searchUberEats(
  query: string,
  location: string,
  apiKey?: string
): Promise<Restaurant[]> {
  // TODO: Add real Uber Eats API call here
  return getMockRestaurants(query, 'ubereats');
}

export async function getUberEatsMenu(
  restaurantId: string,
  apiKey?: string
): Promise<Menu> {
  // TODO: Add real Uber Eats menu API call here
  return getMockMenu(restaurantId);
}

// ---------------------------------------------------------------------------
// GRUBHUB API CLIENT
// ---------------------------------------------------------------------------

export async function searchGrubhub(
  query: string,
  location: string,
  apiKey?: string
): Promise<Restaurant[]> {
  // TODO: Add real Grubhub API call here
  return getMockRestaurants(query, 'grubhub');
}

export async function getGrubhubMenu(
  restaurantId: string,
  apiKey?: string
): Promise<Menu> {
  // TODO: Add real Grubhub menu API call here
  return getMockMenu(restaurantId);
}
