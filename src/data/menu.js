// Default menu items with placeholder images
export const defaultMenuItems = [
  // Coffee
  {
    id: 1,
    name: 'Espresso',
    price: 12,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
    description: 'Rich and bold espresso shot',
  },
  {
    id: 2,
    name: 'Cappuccino',
    price: 15,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    description: 'Espresso with steamed milk and foam',
  },
  {
    id: 3,
    name: 'Latte',
    price: 16,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    description: 'Smooth espresso with steamed milk',
  },
  {
    id: 4,
    name: 'Americano',
    price: 13,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    description: 'Espresso with hot water',
  },
  {
    id: 5,
    name: 'Mocha',
    price: 18,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop',
    description: 'Espresso with chocolate and steamed milk',
  },
  {
    id: 6,
    name: 'Iced Coffee',
    price: 14,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    description: 'Refreshing cold coffee',
  },
  // Food
  {
    id: 7,
    name: 'Croissant',
    price: 10,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
    description: 'Buttery and flaky croissant',
  },
  {
    id: 8,
    name: 'Sandwich',
    price: 25,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46e7af?w=400&h=300&fit=crop',
    description: 'Fresh sandwich with your choice of fillings',
  },
  {
    id: 9,
    name: 'Cake Slice',
    price: 20,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    description: 'Delicious slice of cake',
  },
  {
    id: 10,
    name: 'Toast',
    price: 8,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    description: 'Crispy toasted bread',
  },
  // Drinks
  {
    id: 11,
    name: 'Orange Juice',
    price: 10,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
    description: 'Fresh squeezed orange juice',
  },
  {
    id: 12,
    name: 'Mineral Water',
    price: 5,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop',
    description: 'Pure mineral water',
  },
  {
    id: 13,
    name: 'Soft Drink',
    price: 7,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop',
    description: 'Refreshing soft drink',
  },
]

export const categories = ['All', 'Coffee', 'Food', 'Drinks']

// Get menu items from storage or return defaults
export const getMenuItems = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('lakopi_shared_menuItems')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        return defaultMenuItems
      }
    }
  }
  return defaultMenuItems
}

// Save menu items to storage
export const saveMenuItems = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lakopi_shared_menuItems', JSON.stringify(items))
    window.dispatchEvent(new CustomEvent('menuUpdate'))
  }
}

