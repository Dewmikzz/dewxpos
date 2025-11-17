import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, X, CheckCircle } from 'lucide-react'
import { getMenuItems, categories } from '../data/menu'
import { storage } from '../utils/storage'

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
    const stored = storage.get('menuItems', true)
    if (stored && stored.length > 0) {
      setMenuItems(stored)
    } else {
      setMenuItems(getMenuItems())
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
      <div className="min-h-screen bg-gradient-to-br from-coffee-100 to-coffee-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-coffee-800 mb-2">Order Placed!</h2>
          <p className="text-coffee-600 mb-4">Your order has been sent to the kitchen.</p>
          <p className="text-sm text-coffee-500 mb-6">Order ID: {orderId}</p>
          <button
            onClick={handleNewOrder}
            className="w-full bg-coffee-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-coffee-700 transition-colors"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 pb-20">
      {/* Header */}
      <div className="bg-coffee-800 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Lakopi Restaurant</h1>
          <p className="text-coffee-200">Table {tableNum}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-coffee-600 text-white'
                  : 'bg-white text-coffee-700 hover:bg-coffee-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenu.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 bg-coffee-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-coffee-800 mb-1">{item.name}</h3>
                <p className="text-coffee-500 text-sm mb-1">{item.category}</p>
                {item.description && (
                  <p className="text-coffee-600 text-xs mb-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-coffee-700">RM {item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 transition-colors font-semibold"
                  >
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
          className="fixed bottom-6 right-6 bg-coffee-600 text-white p-4 rounded-full shadow-2xl hover:bg-coffee-700 transition-all transform hover:scale-110 z-50"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-coffee-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-coffee-800">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-coffee-600 hover:text-coffee-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-center text-coffee-500 py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-coffee-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-coffee-800">{item.name}</h3>
                        <p className="text-coffee-600">RM {item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="bg-coffee-200 text-coffee-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-coffee-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-coffee-800 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="bg-coffee-200 text-coffee-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-coffee-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
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
              <div className="p-6 border-t border-coffee-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-coffee-800">Subtotal:</span>
                  <span className="text-2xl font-bold text-coffee-700">RM {getTotal().toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-coffee-200 text-coffee-800 py-3 px-4 rounded-lg font-semibold hover:bg-coffee-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={placeOrder}
                    className="flex-1 bg-coffee-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-coffee-700 transition-colors"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TableView

