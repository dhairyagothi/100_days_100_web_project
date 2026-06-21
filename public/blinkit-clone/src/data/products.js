export const categories = [
  { id: 'all', label: 'All Items', icon: '🛒' },
  { id: 'dairy', label: 'Dairy, Bread & Eggs', icon: '🥛' },
  { id: 'produce', label: 'Vegetables & Fruits', icon: '🥦' },
  { id: 'snacks', label: 'Snacks & Munchies', icon: '🍿' },
  { id: 'drinks', label: 'Cold Drinks & Juices', icon: '🥤' },
  { id: 'instant', label: 'Instant & Frozen Food', icon: '🍜' },
  { id: 'household', label: 'Cleaning & Household', icon: '🧼' }
];

export const mockAreas = [
  'Hazratganj, Lucknow',
  'Gomti Nagar, Lucknow',
  'Aliganj, Lucknow',
  'Indira Nagar, Lucknow',
  'Ashiyana, Lucknow',
  'Mahanagar, Lucknow',
  'Charbagh, Lucknow'
];

export const products = [
  // Dairy, Bread & Eggs
  {
    id: 'd1',
    name: 'Amul Taaza Fresh Toned Milk',
    brand: 'Amul',
    price: 27,
    originalPrice: 28,
    discount: '3% OFF',
    weight: '500 ml',
    category: 'dairy',
    deliveryTime: '8 mins',
    description: 'Fresh toned milk by Amul. Perfect for tea, coffee, and daily nutrition.',
    shelfLife: '2 Days',
    keyFeatures: ['Homogenized milk', 'Toned milk', 'Rich in Calcium'],
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'd2',
    name: 'Mother Dairy Classic Dahi / Curd',
    brand: 'Mother Dairy',
    price: 32,
    originalPrice: 35,
    discount: '8% OFF',
    weight: '400 g',
    category: 'dairy',
    deliveryTime: '8 mins',
    description: 'Thick and creamy classic curd from Mother Dairy. Great side for meals.',
    shelfLife: '7 Days',
    keyFeatures: ['Probiotic rich', 'Thick consistency', '100% natural milk pasteurization'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'd3',
    name: 'Amul Pasteurised Salted Butter',
    brand: 'Amul',
    price: 56,
    originalPrice: 58,
    discount: '3% OFF',
    weight: '100 g',
    category: 'dairy',
    deliveryTime: '9 mins',
    description: 'The taste of India. Delicious, creamy, pasteurized salted butter.',
    shelfLife: '6 Months',
    keyFeatures: ['Delicious salted taste', 'Made from pure cow/buffalo milk', 'Spreads smoothly'],
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'd4',
    name: 'Harvest Gold Premium White Bread',
    brand: 'Harvest Gold',
    price: 30,
    originalPrice: 30,
    discount: '',
    weight: '400 g',
    category: 'dairy',
    deliveryTime: '7 mins',
    description: 'Freshly baked white bread. Perfect slice size for sandwiches and toasts.',
    shelfLife: '4 Days',
    keyFeatures: ['Soft & fluffy', 'Zero trans fat', 'Baked fresh daily'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80'
  },

  // Vegetables & Fruits
  {
    id: 'p1',
    name: 'Fresh Hybrid Tomato',
    brand: 'Local Farm',
    price: 24,
    originalPrice: 35,
    discount: '31% OFF',
    weight: '500 g',
    category: 'produce',
    deliveryTime: '10 mins',
    description: 'Fresh, juicy, and handpicked hybrid tomatoes. Essential for curries and salads.',
    shelfLife: '5 Days',
    keyFeatures: ['Rich in Lycopene', 'Sweet & tangy', 'Sourced locally from UP farms'],
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p2',
    name: 'Fresh Onion (Pyaj)',
    brand: 'Local Farm',
    price: 38,
    originalPrice: 50,
    discount: '24% OFF',
    weight: '1 kg',
    category: 'produce',
    deliveryTime: '9 mins',
    description: 'High-quality farm onions. Adds rich flavor base to almost all Indian cuisines.',
    shelfLife: '14 Days',
    keyFeatures: ['Sharp aroma', 'Crispy layers', 'Stored in temperature-controlled spaces'],
    image: 'https://images.unsplash.com/photo-1508747702-f520fc690139?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p3',
    name: 'Fresh Potato (Aloo)',
    brand: 'Local Farm',
    price: 28,
    originalPrice: 35,
    discount: '20% OFF',
    weight: '1 kg',
    category: 'produce',
    deliveryTime: '10 mins',
    description: 'Cleaned, dirt-free local potatoes. Perfect for boiling, baking, or frying.',
    shelfLife: '15 Days',
    keyFeatures: ['Rich in Carbohydrates', 'Firm texture', 'Versatile cooking ingredient'],
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'p4',
    name: 'Robusta Banana',
    brand: 'Local Farm',
    price: 49,
    originalPrice: 60,
    discount: '18% OFF',
    weight: '6 units (approx 800g)',
    category: 'produce',
    deliveryTime: '8 mins',
    description: 'Sweet and perfectly ripe Robusta bananas. Immediate source of natural energy.',
    shelfLife: '3 Days',
    keyFeatures: ['High in Potassium', 'Naturally sweet', 'Safe ripened without chemicals'],
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&auto=format&fit=crop&q=80'
  },

  // Snacks & Munchies
  {
    id: 's1',
    name: 'Lay\'s Classic Salted Potato Chips',
    brand: 'Lays',
    price: 20,
    originalPrice: 20,
    discount: '',
    weight: '50 g',
    category: 'snacks',
    deliveryTime: '8 mins',
    description: 'Crispy salted potato chips. The ultimate crunchy snack for movie nights.',
    shelfLife: '4 Months',
    keyFeatures: ['Made from high-quality potatoes', 'Classic salted seasoning', 'Vegetarian'],
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 's2',
    name: 'Kurkure Masala Munch Crunchy Snacks',
    brand: 'Kurkure',
    price: 20,
    originalPrice: 20,
    discount: '',
    weight: '82 g',
    category: 'snacks',
    deliveryTime: '8 mins',
    description: 'Spicy and tangy curved corn puffs. Made with trusted kitchen ingredients.',
    shelfLife: '4 Months',
    keyFeatures: ['Authentic Indian spices', 'Irresistibly crunchy', 'Perfect tea-time partner'],
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 's3',
    name: 'Haldiram\'s Aloo Bhujia Namkeen',
    brand: 'Haldiram\'s',
    price: 47,
    originalPrice: 50,
    discount: '6% OFF',
    weight: '200 g',
    category: 'snacks',
    deliveryTime: '9 mins',
    description: 'Crispy fried potato noodles infused with spices. A staple household snack.',
    shelfLife: '6 Months',
    keyFeatures: ['Minty spicy blend', 'Crisp texture', 'Stays fresh in ziploc'],
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=80'
  },

  // Cold Drinks & Juices
  {
    id: 'c1',
    name: 'Coca-Cola Aerated Soft Drink Can',
    brand: 'Coca-Cola',
    price: 38,
    originalPrice: 40,
    discount: '5% OFF',
    weight: '300 ml',
    category: 'drinks',
    deliveryTime: '8 mins',
    description: 'Original taste Coca-Cola. Refreshing cola with sparkling bubbles. Serve chilled.',
    shelfLife: '6 Months',
    keyFeatures: ['Crisp original cola flavor', 'Perfect party mixer', 'Recyclable aluminum can'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'c2',
    name: 'Real Fruit Power Orange Juice',
    brand: 'Real',
    price: 110,
    originalPrice: 125,
    discount: '12% OFF',
    weight: '1 L',
    category: 'drinks',
    deliveryTime: '10 mins',
    description: 'Nourishing orange juice packed with the power of Vitamin C and real pulp.',
    shelfLife: '9 Months',
    keyFeatures: ['No added preservatives', 'Rich in Vitamin C', 'Aseptically packaged for safety'],
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&auto=format&fit=crop&q=80'
  },

  // Instant & Frozen Food
  {
    id: 'i1',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    brand: 'Nestle',
    price: 14,
    originalPrice: 14,
    discount: '',
    weight: '70 g',
    category: 'instant',
    deliveryTime: '8 mins',
    description: 'India\'s favorite comfort food. Quick to cook and filled with the magic taste of tastemaker spices.',
    shelfLife: '8 Months',
    keyFeatures: ['Cooks in 2 mins', 'Unique spice tastemaker', 'Rich in Iron'],
    image: 'https://images.unsplash.com/photo-1612966608997-30d9fb6f7e3d?w=300&auto=format&fit=crop&q=80'
  },

  // Cleaning & Household
  {
    id: 'h1',
    name: 'Surf Excel Easy Wash Detergent Powder',
    brand: 'Surf Excel',
    price: 125,
    originalPrice: 140,
    discount: '10% OFF',
    weight: '1 kg',
    category: 'household',
    deliveryTime: '10 mins',
    description: 'Detergent powder that removes tough stains easily without damaging fabric fibers.',
    shelfLife: '2 Years',
    keyFeatures: ['Stain removal formula', 'Gentle on hands', 'Fresh floral fragrance'],
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&auto=format&fit=crop&q=80'
  }
];
