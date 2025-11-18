// Lakopi Restaurant Menu with unique food images - each item has a unique image
// Using Unsplash Source API with unique seeds for each item
export const defaultMenuItems = [
  // Traditional (Local Classics)
  { id: 1, name: 'Mee Siam Biasa', price: 8.90, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,noodles&sig=1`, description: 'Classic Mee Siam' },
  { id: 2, name: 'Mee Siam Boneless Berempah', price: 18.90, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,chicken&sig=2`, description: 'Mee Siam with spiced boneless chicken' },
  { id: 3, name: 'Mee Siam Curry Chicken', price: 18.90, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,curry&sig=3`, description: 'Mee Siam with curry chicken' },
  { id: 4, name: 'Mee Siam Rendang Chicken', price: 18.90, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,rendang&sig=4`, description: 'Mee Siam with rendang chicken' },
  { id: 5, name: 'Nasi Lemak Biasa', price: 8.90, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,rice&sig=5`, description: 'Classic Nasi Lemak' },
  { id: 6, name: 'Nasi Lemak Boneless Berempah', price: 19.50, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,chicken-rice&sig=6`, description: 'Nasi Lemak with spiced boneless chicken' },
  { id: 7, name: 'Nasi Lemak Curry Chicken', price: 19.50, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,curry-rice&sig=7`, description: 'Nasi Lemak with curry chicken' },
  { id: 8, name: 'Nasi Lemak Rendang Chicken', price: 19.50, category: 'Traditional', image: `https://source.unsplash.com/400x300/?food,rendang-rice&sig=8`, description: 'Nasi Lemak with rendang chicken' },
  
  // Noodles
  { id: 9, name: 'Prawn Mee', price: 18.50, category: 'Noodles', image: `https://source.unsplash.com/400x300/?food,prawn-noodles&sig=9`, description: 'Traditional prawn noodle soup' },
  { id: 10, name: 'Signature Classic Curry Noodles', price: 18.90, category: 'Noodles', image: `https://source.unsplash.com/400x300/?food,curry-noodles&sig=10`, description: 'Signature curry noodles' },
  { id: 11, name: 'Signature Seafood Curry Noodles', price: 26.40, category: 'Noodles', image: `https://source.unsplash.com/400x300/?food,seafood-noodles&sig=11`, description: 'Curry noodles with fresh seafood' },
  { id: 12, name: 'Ipoh Chicken Hor Fun', price: 18.50, category: 'Noodles', image: `https://source.unsplash.com/400x300/?food,flat-noodles&sig=12`, description: 'Ipoh style flat rice noodles with chicken' },
  
  // Hand-Torn Pan Mee
  { id: 13, name: 'Pan Mee Soup', price: 16.10, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,handmade-noodles&sig=13`, description: 'Hand-torn noodles in soup' },
  { id: 14, name: 'Pan Mee Soup + Milk', price: 17.50, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,noodle-soup&sig=14`, description: 'Pan mee soup with milk' },
  { id: 15, name: 'Pan Mee Soup + Dumpling', price: 18.90, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,dumpling-noodles&sig=15`, description: 'Pan mee soup with dumplings' },
  { id: 16, name: 'Tomyum Pan Mee', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,tomyum&sig=16`, description: 'Spicy tomyum pan mee' },
  { id: 17, name: 'Curry Pan Mee Special', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,curry-soup&sig=17`, description: 'Special curry pan mee' },
  { id: 18, name: 'Dry Pan Mee + Onzen Egg', price: 17.50, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,dry-noodles&sig=18`, description: 'Dry pan mee with onzen egg' },
  { id: 19, name: 'Dry Chili Pan Mee + Onzen Egg', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,spicy-noodles&sig=19`, description: 'Spicy dry pan mee with onzen egg' },
  { id: 20, name: 'Dumpling Dry Pan Mee', price: 18.90, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,dumplings&sig=20`, description: 'Dry pan mee with dumplings' },
  { id: 21, name: 'Dry Pan Mee + Curry Chicken', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,curry-chicken&sig=21`, description: 'Dry pan mee with curry chicken' },
  { id: 22, name: 'Dry Pan Mee + Rendang Chicken', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://source.unsplash.com/400x300/?food,rendang-noodles&sig=22`, description: 'Dry pan mee with rendang chicken' },
  
  // Rice
  { id: 23, name: 'Soy Sauce Braised Chicken', price: 12.10, category: 'Rice', image: `https://source.unsplash.com/400x300/?food,braised-chicken&sig=23`, description: 'Tender braised chicken with rice' },
  { id: 24, name: 'Thai Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://source.unsplash.com/400x300/?food,thai-chicken&sig=24`, description: 'Crispy Thai-style chicken cutlet' },
  { id: 25, name: 'Japanese Curry Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://source.unsplash.com/400x300/?food,japanese-curry&sig=25`, description: 'Japanese curry with fried chicken cutlet' },
  { id: 26, name: 'Blackpepper Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://source.unsplash.com/400x300/?food,blackpepper-chicken&sig=26`, description: 'Black pepper chicken cutlet with rice' },
  { id: 27, name: 'Tomyum Soup with Rice', price: 19.50, category: 'Rice', image: `https://source.unsplash.com/400x300/?food,tomyum-soup&sig=27`, description: 'Spicy tomyum soup with rice' },
  { id: 28, name: 'Teriyaki Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://source.unsplash.com/400x300/?food,teriyaki-chicken&sig=28`, description: 'Teriyaki chicken cutlet with rice' },
  
  // Salad
  { id: 29, name: 'Prawn Salad', price: 21.50, category: 'Salad', image: `https://source.unsplash.com/400x300/?food,prawn-salad&sig=29`, description: 'Fresh prawn salad' },
  { id: 30, name: 'Caesar Salad', price: 18.50, category: 'Salad', image: `https://source.unsplash.com/400x300/?food,caesar-salad&sig=30`, description: 'Classic Caesar salad' },
  
  // Pasta
  { id: 31, name: 'Vege Aglio Olio', price: 18.90, category: 'Pasta', image: `https://source.unsplash.com/400x300/?food,aglio-olio&sig=31`, description: 'Vegetable aglio olio pasta' },
  { id: 32, name: 'Seafood Aglio Olio', price: 21.50, category: 'Pasta', image: `https://source.unsplash.com/400x300/?food,seafood-pasta&sig=32`, description: 'Seafood aglio olio pasta' },
  { id: 33, name: 'Spaghetti Bolognese Chicken', price: 20.10, category: 'Pasta', image: `https://source.unsplash.com/400x300/?food,bolognese&sig=33`, description: 'Classic bolognese with chicken' },
  { id: 34, name: 'Spaghetti Carbonara Chicken', price: 22.90, category: 'Pasta', image: `https://source.unsplash.com/400x300/?food,carbonara&sig=34`, description: 'Creamy carbonara with chicken' },
  { id: 35, name: 'Spaghetti Creamy Tom Yum', price: 22.90, category: 'Pasta', image: `https://source.unsplash.com/400x300/?food,creamy-pasta&sig=35`, description: 'Creamy tom yum spaghetti' },
  
  // Burger
  { id: 36, name: 'Lakopi Crispy Chicken Burger', price: 18.90, category: 'Burger', image: `https://source.unsplash.com/400x300/?food,chicken-burger&sig=36`, description: 'Crispy chicken burger' },
  { id: 37, name: 'Lakopi Ayam Berempah Burger', price: 18.90, category: 'Burger', image: `https://source.unsplash.com/400x300/?food,spiced-burger&sig=37`, description: 'Spiced chicken burger' },
  
  // Western / Grilled
  { id: 38, name: 'Grill Chicken Chop', price: 23.90, category: 'Western / Grilled', image: `https://source.unsplash.com/400x300/?food,grilled-chicken&sig=38`, description: 'Grilled chicken chop' },
  { id: 39, name: 'Fried Chicken Chop', price: 23.90, category: 'Western / Grilled', image: `https://source.unsplash.com/400x300/?food,fried-chicken&sig=39`, description: 'Fried chicken chop' },
  
  // Small Bites / Sides
  { id: 40, name: 'Fried Lobak', price: 9.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,fried-food&sig=40`, description: 'Crispy fried lobak' },
  { id: 41, name: 'Fried Vietnam Spring Roll', price: 9.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,spring-rolls&sig=41`, description: 'Vietnamese spring rolls' },
  { id: 42, name: 'Fried Chicken Popcorn', price: 9.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,popcorn-chicken&sig=42`, description: 'Crispy popcorn chicken' },
  { id: 43, name: 'Fried Chicken Dumpling (3 pcs)', price: 9.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,chicken-dumpling&sig=43`, description: 'Fried chicken dumplings' },
  { id: 44, name: 'Fried Wedges', price: 9.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,potato-wedges&sig=44`, description: 'Crispy potato wedges' },
  { id: 45, name: 'French Fries', price: 9.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,french-fries&sig=45`, description: 'Classic french fries' },
  { id: 46, name: 'Lotus Leaf Bun Thai Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,bun&sig=46`, description: 'Lotus leaf bun with Thai chicken' },
  { id: 47, name: 'Lotus Leaf Bun Nanban Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,chicken-bun&sig=47`, description: 'Lotus leaf bun with Nanban chicken' },
  { id: 48, name: 'Fried Lekor Terengganu', price: 9.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,fish-cake&sig=48`, description: 'Terengganu style fish cake' },
  { id: 49, name: 'Lotus Leaf Bun Teriyaki Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://source.unsplash.com/400x300/?food,teriyaki-bun&sig=49`, description: 'Lotus leaf bun with teriyaki chicken' },
  
  // Roti Bakar / Croissant / Toast
  { id: 50, name: 'Half Boiled Egg Onzen', price: 5.00, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,egg&sig=50`, description: 'Half boiled egg with onzen style' },
  { id: 51, name: 'Kaya + Butter Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,toast&sig=51`, description: 'Traditional kaya and butter toast' },
  { id: 52, name: 'Coconut Crunchy + Butter Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,coconut-toast&sig=52`, description: 'Coconut crunchy with butter toast' },
  { id: 53, name: 'Peanut + Kaya Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,peanut-toast&sig=53`, description: 'Peanut and kaya toast' },
  { id: 54, name: 'Peanut + Nutella Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,nutella-toast&sig=54`, description: 'Peanut and Nutella toast' },
  { id: 55, name: 'Roti Bakar Goyang', price: 5.10, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,shaken-toast&sig=55`, description: 'Shaken toast' },
  { id: 56, name: 'Croissant Egg Mayo', price: 10.50, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,croissant&sig=56`, description: 'Croissant with egg mayo' },
  { id: 57, name: 'Croissant Kaya Butter', price: 11.50, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,croissant-butter&sig=57`, description: 'Croissant with kaya and butter' },
  { id: 58, name: 'Croissant with Tuna', price: 10.50, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,tuna-croissant&sig=58`, description: 'Croissant with tuna' },
  { id: 59, name: 'Garlic Toast', price: 6.10, category: 'Roti Bakar / Croissant / Toast', image: `https://source.unsplash.com/400x300/?food,garlic-bread&sig=59`, description: 'Garlic butter toast' },
  
  // Signature Drinks
  { id: 60, name: 'Lakopi Special', price: 9.50, category: 'Signature Drinks', image: `https://source.unsplash.com/400x300/?food,coffee&sig=60`, description: 'House special coffee' },
  { id: 61, name: 'Lakopi Special Teh', price: 9.50, category: 'Signature Drinks', image: `https://source.unsplash.com/400x300/?food,tea&sig=61`, description: 'House special tea' },
  { id: 62, name: 'Lemongrass Special', price: 6.10, category: 'Signature Drinks', image: `https://source.unsplash.com/400x300/?food,lemongrass&sig=62`, description: 'Refreshing lemongrass drink' },
  { id: 63, name: 'Lakopi Coconut Matcha', price: 17.50, category: 'Signature Drinks', image: `https://source.unsplash.com/400x300/?food,matcha&sig=63`, description: 'Coconut matcha latte' },
  { id: 64, name: 'Lakopi Black Tea Citrus', price: 12.10, category: 'Signature Drinks', image: `https://source.unsplash.com/400x300/?food,black-tea&sig=64`, description: 'Black tea with citrus' },
  { id: 65, name: 'Ribena Lemon Soda', price: 12.10, category: 'Signature Drinks', image: `https://source.unsplash.com/400x300/?food,lemon-soda&sig=65`, description: 'Ribena with lemon soda' },
  
  // Traditional Drinks
  { id: 66, name: 'Kopi O', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,black-coffee&sig=66`, description: 'Black coffee' },
  { id: 67, name: 'Kopi', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,coffee-milk&sig=67`, description: 'Coffee with condensed milk' },
  { id: 68, name: 'Kopi C', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,coffee-evaporated&sig=68`, description: 'Coffee with evaporated milk' },
  { id: 69, name: 'Teh O', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,black-tea-drink&sig=69`, description: 'Black tea' },
  { id: 70, name: 'Teh C', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,tea-milk&sig=70`, description: 'Tea with evaporated milk' },
  { id: 71, name: 'Teh', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,tea-condensed&sig=71`, description: 'Tea with condensed milk' },
  { id: 72, name: 'Cham', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,coffee-tea-mix&sig=72`, description: 'Coffee and tea mix' },
  { id: 73, name: 'Lemongrass (drink)', price: 2.70, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,lemongrass-drink&sig=73`, description: 'Fresh lemongrass drink' },
  { id: 74, name: 'Milo', price: 6.10, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,milo&sig=74`, description: 'Milo drink' },
  { id: 75, name: 'Coke / 100PLUS', price: 4.10, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,soft-drink&sig=75`, description: 'Soft drinks' },
  { id: 76, name: 'Teh O Limau', price: 4.90, category: 'Traditional Drinks', image: `https://source.unsplash.com/400x300/?food,tea-lime&sig=76`, description: 'Black tea with lime' },
  
  // Modern Drinks
  { id: 77, name: 'Espresso', price: 10.90, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,espresso&sig=77`, description: 'Rich espresso shot' },
  { id: 78, name: 'Americano', price: 10.90, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,americano&sig=78`, description: 'Espresso with hot water' },
  { id: 79, name: 'Mocha', price: 14.90, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,mocha&sig=79`, description: 'Espresso with chocolate' },
  { id: 80, name: 'Cappuccino', price: 14.90, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,cappuccino&sig=80`, description: 'Espresso with steamed milk foam' },
  { id: 81, name: 'Latte', price: 14.90, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,latte&sig=81`, description: 'Espresso with steamed milk' },
  { id: 82, name: 'Gula Melaka Latte', price: 16.20, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,gula-melaka&sig=82`, description: 'Latte with gula melaka' },
  { id: 83, name: 'Chocolate (drink)', price: 13.50, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,hot-chocolate&sig=83`, description: 'Hot chocolate drink' },
  { id: 84, name: 'Matcha (drink)', price: 14.90, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,matcha-drink&sig=84`, description: 'Matcha green tea drink' },
  { id: 85, name: 'Ice Peach Tea', price: 10.80, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,peach-tea&sig=85`, description: 'Iced peach tea' },
  { id: 86, name: 'Black Tea', price: 9.50, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,premium-tea&sig=86`, description: 'Premium black tea' },
  { id: 87, name: 'Honey Lemon Tea', price: 9.50, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,honey-lemon&sig=87`, description: 'Honey lemon tea' },
  { id: 88, name: 'Green Tea Lemon', price: 7.90, category: 'Modern Drinks', image: `https://source.unsplash.com/400x300/?food,green-tea&sig=88`, description: 'Green tea with lemon' },
  
  // Milkshake
  { id: 89, name: 'Oreo Milkshake', price: 18.90, category: 'Milkshake', image: `https://source.unsplash.com/400x300/?food,oreo-milkshake&sig=89`, description: 'Creamy Oreo milkshake' },
  { id: 90, name: 'Chocolate Milkshake', price: 18.90, category: 'Milkshake', image: `https://source.unsplash.com/400x300/?food,chocolate-milkshake&sig=90`, description: 'Rich chocolate milkshake' },
  { id: 91, name: 'Strawberry Milkshake', price: 18.90, category: 'Milkshake', image: `https://source.unsplash.com/400x300/?food,strawberry-milkshake&sig=91`, description: 'Fresh strawberry milkshake' },
  { id: 92, name: 'Coconut Shake', price: 14.90, category: 'Milkshake', image: `https://source.unsplash.com/400x300/?food,coconut-shake&sig=92`, description: 'Refreshing coconut shake' },
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
