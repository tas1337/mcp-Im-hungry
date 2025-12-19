import type { Restaurant, Menu } from './types.js';
import { getMockRestaurants, getMockMenu } from './mock-data.js';

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
