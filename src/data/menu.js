// Lakopi Restaurant Menu with unique food images - each item has a unique image
// Using Picsum Photos with unique seeds for consistent images
export const defaultMenuItems = [
  // Traditional (Local Classics)
  { id: 1, name: 'Mee Siam Biasa', price: 8.90, category: 'Traditional', image: `https://picsum.photos/seed/mee-siam-1/400/300`, description: 'Classic Mee Siam' },
  { id: 2, name: 'Mee Siam Boneless Berempah', price: 18.90, category: 'Traditional', image: `https://picsum.photos/seed/mee-siam-chicken-2/400/300`, description: 'Mee Siam with spiced boneless chicken' },
  { id: 3, name: 'Mee Siam Curry Chicken', price: 18.90, category: 'Traditional', image: `https://picsum.photos/seed/mee-siam-curry-3/400/300`, description: 'Mee Siam with curry chicken' },
  { id: 4, name: 'Mee Siam Rendang Chicken', price: 18.90, category: 'Traditional', image: `https://picsum.photos/seed/mee-siam-rendang-4/400/300`, description: 'Mee Siam with rendang chicken' },
  { id: 5, name: 'Nasi Lemak Biasa', price: 8.90, category: 'Traditional', image: `https://picsum.photos/seed/nasi-lemak-5/400/300`, description: 'Classic Nasi Lemak' },
  { id: 6, name: 'Nasi Lemak Boneless Berempah', price: 19.50, category: 'Traditional', image: `https://picsum.photos/seed/nasi-lemak-chicken-6/400/300`, description: 'Nasi Lemak with spiced boneless chicken' },
  { id: 7, name: 'Nasi Lemak Curry Chicken', price: 19.50, category: 'Traditional', image: `https://picsum.photos/seed/nasi-lemak-curry-7/400/300`, description: 'Nasi Lemak with curry chicken' },
  { id: 8, name: 'Nasi Lemak Rendang Chicken', price: 19.50, category: 'Traditional', image: `https://picsum.photos/seed/nasi-lemak-rendang-8/400/300`, description: 'Nasi Lemak with rendang chicken' },
  
  // Noodles
  { id: 9, name: 'Prawn Mee', price: 18.50, category: 'Noodles', image: `https://picsum.photos/seed/prawn-mee-9/400/300`, description: 'Traditional prawn noodle soup' },
  { id: 10, name: 'Signature Classic Curry Noodles', price: 18.90, category: 'Noodles', image: `https://picsum.photos/seed/curry-noodles-10/400/300`, description: 'Signature curry noodles' },
  { id: 11, name: 'Signature Seafood Curry Noodles', price: 26.40, category: 'Noodles', image: `https://picsum.photos/seed/seafood-noodles-11/400/300`, description: 'Curry noodles with fresh seafood' },
  { id: 12, name: 'Ipoh Chicken Hor Fun', price: 18.50, category: 'Noodles', image: `https://picsum.photos/seed/hor-fun-12/400/300`, description: 'Ipoh style flat rice noodles with chicken' },
  
  // Hand-Torn Pan Mee
  { id: 13, name: 'Pan Mee Soup', price: 16.10, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/pan-mee-soup-13/400/300`, description: 'Hand-torn noodles in soup' },
  { id: 14, name: 'Pan Mee Soup + Milk', price: 17.50, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/pan-mee-milk-14/400/300`, description: 'Pan mee soup with milk' },
  { id: 15, name: 'Pan Mee Soup + Dumpling', price: 18.90, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/pan-mee-dumpling-15/400/300`, description: 'Pan mee soup with dumplings' },
  { id: 16, name: 'Tomyum Pan Mee', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/tomyum-pan-mee-16/400/300`, description: 'Spicy tomyum pan mee' },
  { id: 17, name: 'Curry Pan Mee Special', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/curry-pan-mee-17/400/300`, description: 'Special curry pan mee' },
  { id: 18, name: 'Dry Pan Mee + Onzen Egg', price: 17.50, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/dry-pan-mee-18/400/300`, description: 'Dry pan mee with onzen egg' },
  { id: 19, name: 'Dry Chili Pan Mee + Onzen Egg', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/chili-pan-mee-19/400/300`, description: 'Spicy dry pan mee with onzen egg' },
  { id: 20, name: 'Dumpling Dry Pan Mee', price: 18.90, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/dumpling-dry-20/400/300`, description: 'Dry pan mee with dumplings' },
  { id: 21, name: 'Dry Pan Mee + Curry Chicken', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/dry-curry-21/400/300`, description: 'Dry pan mee with curry chicken' },
  { id: 22, name: 'Dry Pan Mee + Rendang Chicken', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://picsum.photos/seed/dry-rendang-22/400/300`, description: 'Dry pan mee with rendang chicken' },
  
  // Rice
  { id: 23, name: 'Soy Sauce Braised Chicken', price: 12.10, category: 'Rice', image: `https://picsum.photos/seed/braised-chicken-23/400/300`, description: 'Tender braised chicken with rice' },
  { id: 24, name: 'Thai Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://picsum.photos/seed/thai-chicken-24/400/300`, description: 'Crispy Thai-style chicken cutlet' },
  { id: 25, name: 'Japanese Curry Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://picsum.photos/seed/japanese-curry-25/400/300`, description: 'Japanese curry with fried chicken cutlet' },
  { id: 26, name: 'Blackpepper Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://picsum.photos/seed/blackpepper-26/400/300`, description: 'Black pepper chicken cutlet with rice' },
  { id: 27, name: 'Tomyum Soup with Rice', price: 19.50, category: 'Rice', image: `https://picsum.photos/seed/tomyum-rice-27/400/300`, description: 'Spicy tomyum soup with rice' },
  { id: 28, name: 'Teriyaki Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://picsum.photos/seed/teriyaki-28/400/300`, description: 'Teriyaki chicken cutlet with rice' },
  
  // Salad
  { id: 29, name: 'Prawn Salad', price: 21.50, category: 'Salad', image: `https://picsum.photos/seed/prawn-salad-29/400/300`, description: 'Fresh prawn salad' },
  { id: 30, name: 'Caesar Salad', price: 18.50, category: 'Salad', image: `https://picsum.photos/seed/caesar-salad-30/400/300`, description: 'Classic Caesar salad' },
  
  // Pasta
  { id: 31, name: 'Vege Aglio Olio', price: 18.90, category: 'Pasta', image: `https://picsum.photos/seed/aglio-olio-31/400/300`, description: 'Vegetable aglio olio pasta' },
  { id: 32, name: 'Seafood Aglio Olio', price: 21.50, category: 'Pasta', image: `https://picsum.photos/seed/seafood-pasta-32/400/300`, description: 'Seafood aglio olio pasta' },
  { id: 33, name: 'Spaghetti Bolognese Chicken', price: 20.10, category: 'Pasta', image: `https://picsum.photos/seed/bolognese-33/400/300`, description: 'Classic bolognese with chicken' },
  { id: 34, name: 'Spaghetti Carbonara Chicken', price: 22.90, category: 'Pasta', image: `https://picsum.photos/seed/carbonara-34/400/300`, description: 'Creamy carbonara with chicken' },
  { id: 35, name: 'Spaghetti Creamy Tom Yum', price: 22.90, category: 'Pasta', image: `https://picsum.photos/seed/creamy-tom-yum-35/400/300`, description: 'Creamy tom yum spaghetti' },
  
  // Burger
  { id: 36, name: 'Lakopi Crispy Chicken Burger', price: 18.90, category: 'Burger', image: `https://picsum.photos/seed/chicken-burger-36/400/300`, description: 'Crispy chicken burger' },
  { id: 37, name: 'Lakopi Ayam Berempah Burger', price: 18.90, category: 'Burger', image: `https://picsum.photos/seed/spiced-burger-37/400/300`, description: 'Spiced chicken burger' },
  
  // Western / Grilled
  { id: 38, name: 'Grill Chicken Chop', price: 23.90, category: 'Western / Grilled', image: `https://picsum.photos/seed/grilled-chicken-38/400/300`, description: 'Grilled chicken chop' },
  { id: 39, name: 'Fried Chicken Chop', price: 23.90, category: 'Western / Grilled', image: `https://picsum.photos/seed/fried-chicken-39/400/300`, description: 'Fried chicken chop' },
  
  // Small Bites / Sides
  { id: 40, name: 'Fried Lobak', price: 9.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/lobak-40/400/300`, description: 'Crispy fried lobak' },
  { id: 41, name: 'Fried Vietnam Spring Roll', price: 9.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/spring-roll-41/400/300`, description: 'Vietnamese spring rolls' },
  { id: 42, name: 'Fried Chicken Popcorn', price: 9.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/popcorn-42/400/300`, description: 'Crispy popcorn chicken' },
  { id: 43, name: 'Fried Chicken Dumpling (3 pcs)', price: 9.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/dumpling-43/400/300`, description: 'Fried chicken dumplings' },
  { id: 44, name: 'Fried Wedges', price: 9.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/wedges-44/400/300`, description: 'Crispy potato wedges' },
  { id: 45, name: 'French Fries', price: 9.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/fries-45/400/300`, description: 'Classic french fries' },
  { id: 46, name: 'Lotus Leaf Bun Thai Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/bun-thai-46/400/300`, description: 'Lotus leaf bun with Thai chicken' },
  { id: 47, name: 'Lotus Leaf Bun Nanban Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/bun-nanban-47/400/300`, description: 'Lotus leaf bun with Nanban chicken' },
  { id: 48, name: 'Fried Lekor Terengganu', price: 9.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/lekor-48/400/300`, description: 'Terengganu style fish cake' },
  { id: 49, name: 'Lotus Leaf Bun Teriyaki Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://picsum.photos/seed/bun-teriyaki-49/400/300`, description: 'Lotus leaf bun with teriyaki chicken' },
  
  // Roti Bakar / Croissant / Toast
  { id: 50, name: 'Half Boiled Egg Onzen', price: 5.00, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/egg-50/400/300`, description: 'Half boiled egg with onzen style' },
  { id: 51, name: 'Kaya + Butter Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/kaya-toast-51/400/300`, description: 'Traditional kaya and butter toast' },
  { id: 52, name: 'Coconut Crunchy + Butter Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/coconut-toast-52/400/300`, description: 'Coconut crunchy with butter toast' },
  { id: 53, name: 'Peanut + Kaya Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/peanut-toast-53/400/300`, description: 'Peanut and kaya toast' },
  { id: 54, name: 'Peanut + Nutella Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/nutella-toast-54/400/300`, description: 'Peanut and Nutella toast' },
  { id: 55, name: 'Roti Bakar Goyang', price: 5.10, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/goyang-55/400/300`, description: 'Shaken toast' },
  { id: 56, name: 'Croissant Egg Mayo', price: 10.50, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/croissant-egg-56/400/300`, description: 'Croissant with egg mayo' },
  { id: 57, name: 'Croissant Kaya Butter', price: 11.50, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/croissant-kaya-57/400/300`, description: 'Croissant with kaya and butter' },
  { id: 58, name: 'Croissant with Tuna', price: 10.50, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/croissant-tuna-58/400/300`, description: 'Croissant with tuna' },
  { id: 59, name: 'Garlic Toast', price: 6.10, category: 'Roti Bakar / Croissant / Toast', image: `https://picsum.photos/seed/garlic-toast-59/400/300`, description: 'Garlic butter toast' },
  
  // Signature Drinks
  { id: 60, name: 'Lakopi Special', price: 9.50, category: 'Signature Drinks', image: `https://picsum.photos/seed/lakopi-coffee-60/400/300`, description: 'House special coffee' },
  { id: 61, name: 'Lakopi Special Teh', price: 9.50, category: 'Signature Drinks', image: `https://picsum.photos/seed/lakopi-tea-61/400/300`, description: 'House special tea' },
  { id: 62, name: 'Lemongrass Special', price: 6.10, category: 'Signature Drinks', image: `https://picsum.photos/seed/lemongrass-62/400/300`, description: 'Refreshing lemongrass drink' },
  { id: 63, name: 'Lakopi Coconut Matcha', price: 17.50, category: 'Signature Drinks', image: `https://picsum.photos/seed/matcha-63/400/300`, description: 'Coconut matcha latte' },
  { id: 64, name: 'Lakopi Black Tea Citrus', price: 12.10, category: 'Signature Drinks', image: `https://picsum.photos/seed/black-tea-64/400/300`, description: 'Black tea with citrus' },
  { id: 65, name: 'Ribena Lemon Soda', price: 12.10, category: 'Signature Drinks', image: `https://picsum.photos/seed/ribena-65/400/300`, description: 'Ribena with lemon soda' },
  
  // Traditional Drinks
  { id: 66, name: 'Kopi O', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/kopi-o-66/400/300`, description: 'Black coffee' },
  { id: 67, name: 'Kopi', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/kopi-67/400/300`, description: 'Coffee with condensed milk' },
  { id: 68, name: 'Kopi C', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/kopi-c-68/400/300`, description: 'Coffee with evaporated milk' },
  { id: 69, name: 'Teh O', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/teh-o-69/400/300`, description: 'Black tea' },
  { id: 70, name: 'Teh C', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/teh-c-70/400/300`, description: 'Tea with evaporated milk' },
  { id: 71, name: 'Teh', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/teh-71/400/300`, description: 'Tea with condensed milk' },
  { id: 72, name: 'Cham', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/cham-72/400/300`, description: 'Coffee and tea mix' },
  { id: 73, name: 'Lemongrass (drink)', price: 2.70, category: 'Traditional Drinks', image: `https://picsum.photos/seed/lemongrass-drink-73/400/300`, description: 'Fresh lemongrass drink' },
  { id: 74, name: 'Milo', price: 6.10, category: 'Traditional Drinks', image: `https://picsum.photos/seed/milo-74/400/300`, description: 'Milo drink' },
  { id: 75, name: 'Coke / 100PLUS', price: 4.10, category: 'Traditional Drinks', image: `https://picsum.photos/seed/soft-drink-75/400/300`, description: 'Soft drinks' },
  { id: 76, name: 'Teh O Limau', price: 4.90, category: 'Traditional Drinks', image: `https://picsum.photos/seed/teh-limau-76/400/300`, description: 'Black tea with lime' },
  
  // Modern Drinks
  { id: 77, name: 'Espresso', price: 10.90, category: 'Modern Drinks', image: `https://picsum.photos/seed/espresso-77/400/300`, description: 'Rich espresso shot' },
  { id: 78, name: 'Americano', price: 10.90, category: 'Modern Drinks', image: `https://picsum.photos/seed/americano-78/400/300`, description: 'Espresso with hot water' },
  { id: 79, name: 'Mocha', price: 14.90, category: 'Modern Drinks', image: `https://picsum.photos/seed/mocha-79/400/300`, description: 'Espresso with chocolate' },
  { id: 80, name: 'Cappuccino', price: 14.90, category: 'Modern Drinks', image: `https://picsum.photos/seed/cappuccino-80/400/300`, description: 'Espresso with steamed milk foam' },
  { id: 81, name: 'Latte', price: 14.90, category: 'Modern Drinks', image: `https://picsum.photos/seed/latte-81/400/300`, description: 'Espresso with steamed milk' },
  { id: 82, name: 'Gula Melaka Latte', price: 16.20, category: 'Modern Drinks', image: `https://picsum.photos/seed/gula-melaka-82/400/300`, description: 'Latte with gula melaka' },
  { id: 83, name: 'Chocolate (drink)', price: 13.50, category: 'Modern Drinks', image: `https://picsum.photos/seed/hot-chocolate-83/400/300`, description: 'Hot chocolate drink' },
  { id: 84, name: 'Matcha (drink)', price: 14.90, category: 'Modern Drinks', image: `https://picsum.photos/seed/matcha-drink-84/400/300`, description: 'Matcha green tea drink' },
  { id: 85, name: 'Ice Peach Tea', price: 10.80, category: 'Modern Drinks', image: `https://picsum.photos/seed/peach-tea-85/400/300`, description: 'Iced peach tea' },
  { id: 86, name: 'Black Tea', price: 9.50, category: 'Modern Drinks', image: `https://picsum.photos/seed/premium-tea-86/400/300`, description: 'Premium black tea' },
  { id: 87, name: 'Honey Lemon Tea', price: 9.50, category: 'Modern Drinks', image: `https://picsum.photos/seed/honey-lemon-87/400/300`, description: 'Honey lemon tea' },
  { id: 88, name: 'Green Tea Lemon', price: 7.90, category: 'Modern Drinks', image: `https://picsum.photos/seed/green-tea-88/400/300`, description: 'Green tea with lemon' },
  
  // Milkshake
  { id: 89, name: 'Oreo Milkshake', price: 18.90, category: 'Milkshake', image: `https://picsum.photos/seed/oreo-milkshake-89/400/300`, description: 'Creamy Oreo milkshake' },
  { id: 90, name: 'Chocolate Milkshake', price: 18.90, category: 'Milkshake', image: `https://picsum.photos/seed/chocolate-milkshake-90/400/300`, description: 'Rich chocolate milkshake' },
  { id: 91, name: 'Strawberry Milkshake', price: 18.90, category: 'Milkshake', image: `https://picsum.photos/seed/strawberry-milkshake-91/400/300`, description: 'Fresh strawberry milkshake' },
  { id: 92, name: 'Coconut Shake', price: 14.90, category: 'Milkshake', image: `https://picsum.photos/seed/coconut-shake-92/400/300`, description: 'Refreshing coconut shake' },
]

export const categories = [
  'All',
  'Traditional',
  'Noodles',
  'Hand-Torn Pan Mee',
  'Rice',
  'Salad',
  'Pasta',
  'Burger',
  'Western / Grilled',
  'Small Bites / Sides',
  'Roti Bakar / Croissant / Toast',
  'Signature Drinks',
  'Traditional Drinks',
  'Modern Drinks',
  'Milkshake'
]

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
