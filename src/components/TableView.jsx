import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, X, CheckCircle } from 'lucide-react'
import { getMenuItems, categories } from '../data/menu'
import { storage } from '../utils/storage'
import Logo from './Logo'

const TableView = () => {
  const { tableNumber } = useParams()
  const tableNum = tableNumber || '1'
  
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    loadMenuItems()
    const handleMenuUpdate = () => {
      loadMenuItems()
    }
    window.addEventListener('menuUpdate', handleMenuUpdate)
    return () => {
      window.removeEventListener('menuUpdate', handleMenuUpdate)
    }
  }, [])

  const loadMenuItems = () => {
    try {
      const stored = storage.get('menuItems', true)
      if (stored && Array.isArray(stored) && stored.length > 0) {
        setMenuItems(stored)
      } else {
        // If no stored menu or invalid, use defaults
        console.log('No menu items in storage, using defaults')
        const defaultItems = getMenuItems()
        setMenuItems(defaultItems)
        storage.set('menuItems', defaultItems, true)
      }
    } catch (error) {
      console.error('Error loading menu items:', error)
      // Fallback to defaults on error
      const defaultItems = getMenuItems()
      setMenuItems(defaultItems)
      storage.set('menuItems', defaultItems, true)
    }
  }

  const filteredMenu = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change
          if (newQuantity <= 0) {
            return null
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean)
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const placeOrder = () => {
    if (cart.length === 0) return

    const newOrder = {
      id: Date.now().toString(),
      tableNumber: parseInt(tableNum),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: getTotal(),
      status: 'Pending',
      timestamp: new Date().toISOString(),
    }

    const existingOrders = storage.get('orders', true) || []
    storage.set('orders', [...existingOrders, newOrder], true)
    
    setOrderId(newOrder.id)
    setOrderPlaced(true)
    setCart([])
    setShowCart(false)
  }

  const handleNewOrder = () => {
    setOrderPlaced(false)
    setOrderId(null)
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce-slow" />
          <h2 className="text-3xl font-bold text-green-800 mb-2">Order Placed!</h2>
          <p className="text-green-600 mb-4">Your order has been sent to the kitchen.</p>
          <p className="text-sm text-green-500 mb-6">Order ID: {orderId}</p>
          <button
            onClick={handleNewOrder}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl hover-scale"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 via-white to-green-50 pb-20 relative overflow-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 text-white p-3 sm:p-4 shadow-xl animate-fade-in">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
          <Logo className="w-24 sm:w-32 h-8 sm:h-10" />
          <div className="border-l border-green-300 pl-2 sm:pl-4">
            <p className="text-green-200 text-xs sm:text-sm font-medium">Table {tableNum}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto p-2 sm:p-4 animate-fade-in-up">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 sm:mx-0 px-2 sm:px-0">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{ animationDelay: `${index * 0.05}s` }}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-bounce animate-fade-in-up ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
                  : 'bg-white text-green-800 hover:bg-green-50 hover-lift shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-4xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {filteredMenu.map((item, index) => (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift animate-fade-in-up group cursor-pointer"
            >
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity animate-scale-in">
                  {item.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-green-900 mb-1 group-hover:text-green-700 transition-colors">{item.name}</h3>
                {item.description && (
                  <p className="text-green-600 text-xs mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">RM {item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2 rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-md hover:shadow-lg hover-scale"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white p-5 rounded-full shadow-2xl hover:from-green-700 hover:to-green-800 transition-bounce transform hover:scale-110 z-50 animate-bounce-slow"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse-slow shadow-lg">
            {cartItemCount}
          </span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
            <div className="p-6 border-b border-green-200 flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-bold text-green-800">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-green-600 hover:text-green-800 transition-colors hover-scale"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-center text-green-500 py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between bg-green-50 p-4 rounded-xl hover-lift animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800">{item.name}</h3>
                        <p className="text-green-600">RM {item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="bg-green-200 text-green-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-300 transition-colors hover-scale"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-green-800 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="bg-green-200 text-green-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-300 transition-colors hover-scale"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors hover-scale"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-green-200 space-y-4 bg-gradient-to-r from-green-50 to-white">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-green-800">Subtotal:</span>
                  <span className="text-2xl font-bold text-green-700">RM {getTotal().toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-green-200 text-green-800 py-3 px-4 rounded-xl font-semibold hover:bg-green-300 transition-all hover-scale shadow-md"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={placeOrder}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl hover-scale"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-green-200 text-sm mb-1">Powered by <span className="font-semibold">DewX IT Solution</span></p>
          <p className="text-green-300 text-xs">Email: dewmika.my@gmail.com</p>
        </div>
      </footer>
      </div>
    </div>
  )
}

export default TableView

