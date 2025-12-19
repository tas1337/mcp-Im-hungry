import type { Restaurant, Menu } from './types.js';

export const mockUserPreferences = {
  dietaryRestrictions: ['vegetarian'],
  favoriteCuisines: ['Italian', 'Japanese', 'Thai'],
  priceRange: { min: 10, max: 50 },
};

export const mockUserLocation = {
  address: '123 Main Street',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
};

export const mockOrderHistory = [
  {
    restaurantName: 'Pizza Express',
    items: ['Margherita Pizza', 'Caesar Salad'],
    date: '2024-01-15',
    total: 28.98,
    service: 'doordash',
  },
  {
    restaurantName: 'Sushi World',
    items: ['Salmon Roll', 'Tuna Roll', 'Miso Soup'],
    date: '2024-01-10',
    total: 24.97,
    service: 'ubereats',
  },
  {
    restaurantName: 'Thai Garden',
    items: ['Pad Thai', 'Spring Rolls'],
    date: '2024-01-05',
    total: 22.98,
    service: 'grubhub',
  },
];

export function getMockRestaurants(
  query: string,
  service: 'doordash' | 'ubereats' | 'grubhub'
): Restaurant[] {
  const mockData = [
    { name: 'Burger Palace', cuisine: 'American', rating: 4.8, deliveryTime: 25, deliveryFee: 2.99 },
    { name: 'Pizza Express', cuisine: 'Italian', rating: 4.6, deliveryTime: 30, deliveryFee: 3.49 },
    { name: 'Sushi World', cuisine: 'Japanese', rating: 4.9, deliveryTime: 35, deliveryFee: 4.99 },
    { name: 'Taco Fiesta', cuisine: 'Mexican', rating: 4.5, deliveryTime: 20, deliveryFee: 2.49 },
    { name: 'Thai Garden', cuisine: 'Thai', rating: 4.7, deliveryTime: 28, deliveryFee: 3.99 },
  ];

  const filtered = mockData.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(query.toLowerCase())
  );

  return filtered.map((r, i) => ({
    id: `${service === 'doordash' ? 'dd' : service === 'ubereats' ? 'ue' : 'gh'}-${i + 1}`,
    name: r.name,
    cuisine: r.cuisine,
    rating: r.rating,
    deliveryTime: r.deliveryTime,
    deliveryFee: r.deliveryFee,
    service,
  }));
}

function getRestaurantNameFromId(restaurantId: string): string {
  const match = restaurantId.match(/-(\d+)$/);
  const index = match ? parseInt(match[1], 10) - 1 : 0;
  
  const restaurantNames = [
    'Burger Palace',
    'Pizza Express',
    'Sushi World',
    'Taco Fiesta',
    'Thai Garden',
  ];
  
  return restaurantNames[index] || restaurantNames[0];
}

export function getMockMenu(restaurantId: string, restaurantName?: string): Menu {
  const name = restaurantName || getRestaurantNameFromId(restaurantId);
  
  const menus: Record<string, any[]> = {
    'Burger Palace': [
      { name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, onion', price: 8.99, category: 'Burgers' },
      { name: 'Cheeseburger', description: 'Classic burger with cheese', price: 9.99, category: 'Burgers' },
      { name: 'French Fries', description: 'Crispy golden fries', price: 3.99, category: 'Sides' },
    ],
    'Pizza Express': [
      { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 12.99, category: 'Pizza' },
      { name: 'Pepperoni Pizza', description: 'Classic pepperoni', price: 14.99, category: 'Pizza' },
    ],
    'Sushi World': [
      { name: 'Salmon Roll', description: 'Fresh salmon sushi roll', price: 6.99, category: 'Sushi' },
      { name: 'Tuna Roll', description: 'Fresh tuna sushi roll', price: 7.99, category: 'Sushi' },
    ],
    'Taco Fiesta': [
      { name: 'Beef Tacos', description: '3 beef tacos with salsa', price: 9.99, category: 'Tacos' },
      { name: 'Chicken Tacos', description: '3 chicken tacos', price: 9.99, category: 'Tacos' },
    ],
    'Thai Garden': [
      { name: 'Pad Thai', description: 'Stir-fried noodles', price: 11.99, category: 'Noodles' },
      { name: 'Green Curry', description: 'Spicy green curry', price: 12.99, category: 'Curry' },
    ],
  };

  const items = menus[name] || [
    { name: 'Sample Item', description: 'Menu item', price: 9.99, category: 'Other' },
  ];

  const prefix = restaurantId.startsWith('dd-') ? 'dd' : restaurantId.startsWith('ue-') ? 'ue' : 'gh';

  return {
    restaurantId,
    restaurantName: name,
    items: items.map((item, i) => ({
      id: `${prefix}-item-${i + 1}`,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
    })),
  };
}

