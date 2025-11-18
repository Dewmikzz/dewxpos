// Lakopi Restaurant Menu with real food images - each item has a matching food image
// Using Unsplash direct image URLs with food-specific photo IDs
export const defaultMenuItems = [
  // Traditional (Local Classics)
  { id: 1, name: 'Mee Siam Biasa', price: 8.90, category: 'Traditional', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Classic Mee Siam' },
  { id: 2, name: 'Mee Siam Boneless Berempah', price: 18.90, category: 'Traditional', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Mee Siam with spiced boneless chicken' },
  { id: 3, name: 'Mee Siam Curry Chicken', price: 18.90, category: 'Traditional', image: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&q=80`, description: 'Mee Siam with curry chicken' },
  { id: 4, name: 'Mee Siam Rendang Chicken', price: 18.90, category: 'Traditional', image: `https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop&q=80`, description: 'Mee Siam with rendang chicken' },
  { id: 5, name: 'Nasi Lemak Biasa', price: 8.90, category: 'Traditional', image: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80`, description: 'Classic Nasi Lemak' },
  { id: 6, name: 'Nasi Lemak Boneless Berempah', price: 19.50, category: 'Traditional', image: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80`, description: 'Nasi Lemak with spiced boneless chicken' },
  { id: 7, name: 'Nasi Lemak Curry Chicken', price: 19.50, category: 'Traditional', image: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80`, description: 'Nasi Lemak with curry chicken' },
  { id: 8, name: 'Nasi Lemak Rendang Chicken', price: 19.50, category: 'Traditional', image: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80`, description: 'Nasi Lemak with rendang chicken' },
  
  // Noodles
  { id: 9, name: 'Prawn Mee', price: 18.50, category: 'Noodles', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Traditional prawn noodle soup' },
  { id: 10, name: 'Signature Classic Curry Noodles', price: 18.90, category: 'Noodles', image: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&q=80`, description: 'Signature curry noodles' },
  { id: 11, name: 'Signature Seafood Curry Noodles', price: 26.40, category: 'Noodles', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Curry noodles with fresh seafood' },
  { id: 12, name: 'Ipoh Chicken Hor Fun', price: 18.50, category: 'Noodles', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Ipoh style flat rice noodles with chicken' },
  
  // Hand-Torn Pan Mee
  { id: 13, name: 'Pan Mee Soup', price: 16.10, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Hand-torn noodles in soup' },
  { id: 14, name: 'Pan Mee Soup + Milk', price: 17.50, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Pan mee soup with milk' },
  { id: 15, name: 'Pan Mee Soup + Dumpling', price: 18.90, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Pan mee soup with dumplings' },
  { id: 16, name: 'Tomyum Pan Mee', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Spicy tomyum pan mee' },
  { id: 17, name: 'Curry Pan Mee Special', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&q=80`, description: 'Special curry pan mee' },
  { id: 18, name: 'Dry Pan Mee + Onzen Egg', price: 17.50, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Dry pan mee with onzen egg' },
  { id: 19, name: 'Dry Chili Pan Mee + Onzen Egg', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Spicy dry pan mee with onzen egg' },
  { id: 20, name: 'Dumpling Dry Pan Mee', price: 18.90, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Dry pan mee with dumplings' },
  { id: 21, name: 'Dry Pan Mee + Curry Chicken', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&q=80`, description: 'Dry pan mee with curry chicken' },
  { id: 22, name: 'Dry Pan Mee + Rendang Chicken', price: 20.20, category: 'Hand-Torn Pan Mee', image: `https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop&q=80`, description: 'Dry pan mee with rendang chicken' },
  
  // Rice
  { id: 23, name: 'Soy Sauce Braised Chicken', price: 12.10, category: 'Rice', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Tender braised chicken with rice' },
  { id: 24, name: 'Thai Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Crispy Thai-style chicken cutlet' },
  { id: 25, name: 'Japanese Curry Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&q=80`, description: 'Japanese curry with fried chicken cutlet' },
  { id: 26, name: 'Blackpepper Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Black pepper chicken cutlet with rice' },
  { id: 27, name: 'Tomyum Soup with Rice', price: 19.50, category: 'Rice', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Spicy tomyum soup with rice' },
  { id: 28, name: 'Teriyaki Fried Chicken Cutlet', price: 19.50, category: 'Rice', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Teriyaki chicken cutlet with rice' },
  
  // Salad
  { id: 29, name: 'Prawn Salad', price: 21.50, category: 'Salad', image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80`, description: 'Fresh prawn salad' },
  { id: 30, name: 'Caesar Salad', price: 18.50, category: 'Salad', image: `https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&q=80`, description: 'Classic Caesar salad' },
  
  // Pasta
  { id: 31, name: 'Vege Aglio Olio', price: 18.90, category: 'Pasta', image: `https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&q=80`, description: 'Vegetable aglio olio pasta' },
  { id: 32, name: 'Seafood Aglio Olio', price: 21.50, category: 'Pasta', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Seafood aglio olio pasta' },
  { id: 33, name: 'Spaghetti Bolognese Chicken', price: 20.10, category: 'Pasta', image: `https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&q=80`, description: 'Classic bolognese with chicken' },
  { id: 34, name: 'Spaghetti Carbonara Chicken', price: 22.90, category: 'Pasta', image: `https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&q=80`, description: 'Creamy carbonara with chicken' },
  { id: 35, name: 'Spaghetti Creamy Tom Yum', price: 22.90, category: 'Pasta', image: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80`, description: 'Creamy tom yum spaghetti' },
  
  // Burger
  { id: 36, name: 'Lakopi Crispy Chicken Burger', price: 18.90, category: 'Burger', image: `https://images.unsplash.com/photo-1606755962773-d324e788a195?w=400&h=300&fit=crop&q=80`, description: 'Crispy chicken burger' },
  { id: 37, name: 'Lakopi Ayam Berempah Burger', price: 18.90, category: 'Burger', image: `https://images.unsplash.com/photo-1606755962773-d324e788a195?w=400&h=300&fit=crop&q=80`, description: 'Spiced chicken burger' },
  
  // Western / Grilled
  { id: 38, name: 'Grill Chicken Chop', price: 23.90, category: 'Western / Grilled', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Grilled chicken chop' },
  { id: 39, name: 'Fried Chicken Chop', price: 23.90, category: 'Western / Grilled', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Fried chicken chop' },
  
  // Small Bites / Sides
  { id: 40, name: 'Fried Lobak', price: 9.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Crispy fried lobak' },
  { id: 41, name: 'Fried Vietnam Spring Roll', price: 9.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Vietnamese spring rolls' },
  { id: 42, name: 'Fried Chicken Popcorn', price: 9.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Crispy popcorn chicken' },
  { id: 43, name: 'Fried Chicken Dumpling (3 pcs)', price: 9.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Fried chicken dumplings' },
  { id: 44, name: 'Fried Wedges', price: 9.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&q=80`, description: 'Crispy potato wedges' },
  { id: 45, name: 'French Fries', price: 9.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&q=80`, description: 'Classic french fries' },
  { id: 46, name: 'Lotus Leaf Bun Thai Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Lotus leaf bun with Thai chicken' },
  { id: 47, name: 'Lotus Leaf Bun Nanban Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Lotus leaf bun with Nanban chicken' },
  { id: 48, name: 'Fried Lekor Terengganu', price: 9.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Terengganu style fish cake' },
  { id: 49, name: 'Lotus Leaf Bun Teriyaki Chicken', price: 6.50, category: 'Small Bites / Sides', image: `https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop&q=80`, description: 'Lotus leaf bun with teriyaki chicken' },
  
  // Roti Bakar / Croissant / Toast
  { id: 50, name: 'Half Boiled Egg Onzen', price: 5.00, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&q=80`, description: 'Half boiled egg with onzen style' },
  { id: 51, name: 'Kaya + Butter Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80`, description: 'Traditional kaya and butter toast' },
  { id: 52, name: 'Coconut Crunchy + Butter Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80`, description: 'Coconut crunchy with butter toast' },
  { id: 53, name: 'Peanut + Kaya Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80`, description: 'Peanut and kaya toast' },
  { id: 54, name: 'Peanut + Nutella Toast', price: 5.50, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80`, description: 'Peanut and Nutella toast' },
  { id: 55, name: 'Roti Bakar Goyang', price: 5.10, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80`, description: 'Shaken toast' },
  { id: 56, name: 'Croissant Egg Mayo', price: 10.50, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&q=80`, description: 'Croissant with egg mayo' },
  { id: 57, name: 'Croissant Kaya Butter', price: 11.50, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&q=80`, description: 'Croissant with kaya and butter' },
  { id: 58, name: 'Croissant with Tuna', price: 10.50, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&q=80`, description: 'Croissant with tuna' },
  { id: 59, name: 'Garlic Toast', price: 6.10, category: 'Roti Bakar / Croissant / Toast', image: `https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&q=80`, description: 'Garlic butter toast' },
  
  // Signature Drinks
  { id: 60, name: 'Lakopi Special', price: 9.50, category: 'Signature Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'House special coffee' },
  { id: 61, name: 'Lakopi Special Teh', price: 9.50, category: 'Signature Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'House special tea' },
  { id: 62, name: 'Lemongrass Special', price: 6.10, category: 'Signature Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Refreshing lemongrass drink' },
  { id: 63, name: 'Lakopi Coconut Matcha', price: 17.50, category: 'Signature Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Coconut matcha latte' },
  { id: 64, name: 'Lakopi Black Tea Citrus', price: 12.10, category: 'Signature Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Black tea with citrus' },
  { id: 65, name: 'Ribena Lemon Soda', price: 12.10, category: 'Signature Drinks', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Ribena with lemon soda' },
  
  // Traditional Drinks
  { id: 66, name: 'Kopi O', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Black coffee' },
  { id: 67, name: 'Kopi', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Coffee with condensed milk' },
  { id: 68, name: 'Kopi C', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Coffee with evaporated milk' },
  { id: 69, name: 'Teh O', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Black tea' },
  { id: 70, name: 'Teh C', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Tea with evaporated milk' },
  { id: 71, name: 'Teh', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Tea with condensed milk' },
  { id: 72, name: 'Cham', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Coffee and tea mix' },
  { id: 73, name: 'Lemongrass (drink)', price: 2.70, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Fresh lemongrass drink' },
  { id: 74, name: 'Milo', price: 6.10, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Milo drink' },
  { id: 75, name: 'Coke / 100PLUS', price: 4.10, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Soft drinks' },
  { id: 76, name: 'Teh O Limau', price: 4.90, category: 'Traditional Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Black tea with lime' },
  
  // Modern Drinks
  { id: 77, name: 'Espresso', price: 10.90, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Rich espresso shot' },
  { id: 78, name: 'Americano', price: 10.90, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Espresso with hot water' },
  { id: 79, name: 'Mocha', price: 14.90, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Espresso with chocolate' },
  { id: 80, name: 'Cappuccino', price: 14.90, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Espresso with steamed milk foam' },
  { id: 81, name: 'Latte', price: 14.90, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Espresso with steamed milk' },
  { id: 82, name: 'Gula Melaka Latte', price: 16.20, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Latte with gula melaka' },
  { id: 83, name: 'Chocolate (drink)', price: 13.50, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Hot chocolate drink' },
  { id: 84, name: 'Matcha (drink)', price: 14.90, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop&q=80`, description: 'Matcha green tea drink' },
  { id: 85, name: 'Ice Peach Tea', price: 10.80, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Iced peach tea' },
  { id: 86, name: 'Black Tea', price: 9.50, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Premium black tea' },
  { id: 87, name: 'Honey Lemon Tea', price: 9.50, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Honey lemon tea' },
  { id: 88, name: 'Green Tea Lemon', price: 7.90, category: 'Modern Drinks', image: `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80`, description: 'Green tea with lemon' },
  
  // Milkshake
  { id: 89, name: 'Oreo Milkshake', price: 18.90, category: 'Milkshake', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Creamy Oreo milkshake' },
  { id: 90, name: 'Chocolate Milkshake', price: 18.90, category: 'Milkshake', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Rich chocolate milkshake' },
  { id: 91, name: 'Strawberry Milkshake', price: 18.90, category: 'Milkshake', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Fresh strawberry milkshake' },
  { id: 92, name: 'Coconut Shake', price: 14.90, category: 'Milkshake', image: `https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop&q=80`, description: 'Refreshing coconut shake' },
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
