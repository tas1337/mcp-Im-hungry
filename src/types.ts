/**
 * Type definitions
 */

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  service: 'doordash' | 'ubereats' | 'grubhub';
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface Menu {
  restaurantId: string;
  restaurantName: string;
  items: MenuItem[];
}

export interface DeliveryEstimate {
  restaurantId: string;
  restaurantName: string;
  estimatedTime: number;
  deliveryFee: number;
  minimumOrder: number;
  service: 'doordash' | 'ubereats' | 'grubhub';
}
