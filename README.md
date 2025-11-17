# Lakopi Restaurant Web-Based Ordering System

A complete Point of Sale (POS) system for Lakopi restaurant that allows customers to order via mobile devices by scanning QR codes, and provides staff with a real-time dashboard to manage orders.

## Features

### Customer Ordering Interface
- **Table Selection**: 4 unique URLs (one per table) - `/table/1`, `/table/2`, `/table/3`, `/table/4`
- **Menu Display**: Attractive card layout with item images, names, prices, and categories
- **Category Filtering**: Filter by All, Coffee, Food, or Drinks
- **Shopping Cart**: 
  - Floating cart icon with item count
  - Add/remove items
  - Adjust quantities
  - View subtotal
  - Clear cart option
- **Order Confirmation**: Review cart, confirm order, and receive success message

### Admin Dashboard
- **Real-Time Order Management**: Display all incoming orders instantly
- **Order Status Management**: 
  - 🔴 Pending (new orders)
  - 🟡 Preparing (being cooked/prepared)
  - 🟢 Completed (ready to serve/served)
- **Dashboard Statistics**:
  - Total orders today
  - Active tables
  - Pending orders count
  - Total revenue
- **Order Actions**: Mark as preparing, mark as completed, delete/cancel orders

## Tech Stack

- **React 18** with Hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling
- **LocalStorage** for data persistence (with shared storage support)

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
   - Customer view: `http://localhost:5173/table/1` (or `/table/2`, `/table/3`, `/table/4`)
   - Admin dashboard: `http://localhost:5173/dashboard`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### For Customers

1. Scan the QR code at your table (or navigate to `/table/{tableNumber}`)
2. Browse the menu and add items to your cart
3. Click the cart icon to review your order
4. Confirm your order
5. Wait for your order to be prepared!

### For Staff

1. Navigate to `/dashboard`
2. View all incoming orders in real-time
3. Click on an order to view details
4. Update order status:
   - Mark as "Preparing" when you start working on it
   - Mark as "Completed" when ready to serve
5. Delete orders if needed (with confirmation)

## Project Structure

```
lakopi-pos/
├── src/
│   ├── components/
│   │   ├── TableView.jsx      # Customer ordering interface
│   │   └── Dashboard.jsx      # Admin dashboard
│   ├── data/
│   │   └── menu.js            # Menu items data
│   ├── utils/
│   │   └── storage.js         # Storage utility functions
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Menu Items

The system includes the following menu items:

### Coffee
- Espresso - RM 12
- Cappuccino - RM 15
- Latte - RM 16
- Americano - RM 13
- Mocha - RM 18
- Iced Coffee - RM 14

### Food
- Croissant - RM 10
- Sandwich - RM 25
- Cake Slice - RM 20
- Toast - RM 8

### Drinks
- Orange Juice - RM 10
- Mineral Water - RM 5
- Soft Drink - RM 7

## Data Storage

The system uses localStorage with a custom storage utility that supports:
- **Shared storage**: Orders are stored in shared storage so all users (customers and staff) see the same data
- **Real-time updates**: Custom events are dispatched when data changes
- **Persistence**: Data persists across browser sessions

## Future Enhancements

- Payment integration
- Order history for customers
- Staff authentication for dashboard
- Print receipt functionality
- Customer call waiter button
- Menu item availability toggle
- Daily sales reports
- Customer feedback system

## License

This project is created for Lakopi Restaurant.

