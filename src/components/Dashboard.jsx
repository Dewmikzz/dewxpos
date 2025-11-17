import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Clock, 
  ChefHat, 
  CheckCircle, 
  Trash2, 
  ArrowLeft,
  TrendingUp,
  Users,
  AlertCircle,
  DollarSign,
  X,
  Grid3x3,
  List,
  CreditCard,
  QrCode,
  Banknote,
  FileText,
  Receipt,
  Utensils,
  Plus,
  Edit,
  Image as ImageIcon,
  Bell,
  ShoppingBag
} from 'lucide-react'
import { storage } from '../utils/storage'
import { getMenuItems, saveMenuItems, defaultMenuItems, categories } from '../data/menu'

const Dashboard = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [viewMode, setViewMode] = useState('tables') // 'tables', 'orders', 'report', or 'menu'
  const [selectedTable, setSelectedTable] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [orderToPay, setOrderToPay] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState(null)
  const [menuForm, setMenuForm] = useState({
    name: '',
    price: '',
    category: 'Food',
    image: '',
    description: ''
  })
  const [notifications, setNotifications] = useState([])
  const [previousOrderIds, setPreviousOrderIds] = useState(new Set())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [audioContext, setAudioContext] = useState(null)

  useEffect(() => {
    loadOrders()
    loadMenuItems()
    
    // Initialize AudioContext on user interaction (required by browsers)
    const initAudio = async () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        // Resume context if suspended (browser autoplay policy)
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }
        setAudioContext(ctx)
      } catch (error) {
        console.log('Audio initialization error:', error)
      }
    }
    
    // Initialize audio on first user interaction
    const handleUserInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
    
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)
    
    // Listen for storage updates
    const handleStorageUpdate = () => {
      loadOrders()
    }
    
    const handleMenuUpdate = () => {
      loadMenuItems()
    }
    
    window.addEventListener('storageUpdate', handleStorageUpdate)
    window.addEventListener('storage', handleStorageUpdate)
    window.addEventListener('menuUpdate', handleMenuUpdate)
    
    // Poll for updates (fallback)
    const interval = setInterval(loadOrders, 2000)
    
    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      window.removeEventListener('storageUpdate', handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
      window.removeEventListener('menuUpdate', handleMenuUpdate)
      clearInterval(interval)
    }
  }, [])

  const loadMenuItems = () => {
    const stored = storage.get('menuItems', true)
    if (stored && stored.length > 0) {
      setMenuItems(stored)
    } else {
      setMenuItems(defaultMenuItems)
      storage.set('menuItems', defaultMenuItems, true)
    }
  }

  const saveMenuItem = () => {
    if (!menuForm.name || !menuForm.price || !menuForm.image) {
      alert('Please fill in all required fields (Name, Price, Image)')
      return
    }

    let updatedItems
    if (editingMenuItem) {
      // Update existing item
      updatedItems = menuItems.map(item =>
        item.id === editingMenuItem.id
          ? {
              ...menuForm,
              id: editingMenuItem.id,
              price: parseFloat(menuForm.price)
            }
          : item
      )
    } else {
      // Add new item
      const newId = Math.max(...menuItems.map(i => i.id), 0) + 1
      updatedItems = [
        ...menuItems,
        {
          ...menuForm,
          id: newId,
          price: parseFloat(menuForm.price)
        }
      ]
    }

    storage.set('menuItems', updatedItems, true)
    setMenuItems(updatedItems)
    setShowMenuModal(false)
    setEditingMenuItem(null)
    setMenuForm({ name: '', price: '', category: 'Food', image: '', description: '' })
    window.dispatchEvent(new CustomEvent('menuUpdate'))
  }

  const deleteMenuItem = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      const updatedItems = menuItems.filter(item => item.id !== id)
      storage.set('menuItems', updatedItems, true)
      setMenuItems(updatedItems)
      window.dispatchEvent(new CustomEvent('menuUpdate'))
    }
  }

  const openMenuModal = (item = null) => {
    if (item) {
      setEditingMenuItem(item)
      setMenuForm({
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        image: item.image,
        description: item.description || ''
      })
    } else {
      setEditingMenuItem(null)
      setMenuForm({ name: '', price: '', category: 'Food', image: '', description: '' })
    }
    setShowMenuModal(true)
  }

  // Play notification sound - 3 second beep (LOUD)
  const playNotificationSound = async () => {
    if (!soundEnabled) {
      console.log('Sound is disabled')
      return
    }
    
    try {
      // Create or reuse audio context
      let ctx = audioContext
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)()
        setAudioContext(ctx)
      }
      
      // Resume context if suspended (required by browser autoplay policy)
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }
      
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Set frequency for beep (800 Hz)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      // Set volume - MUCH LOUDER (0.9 = 90% volume)
      gainNode.gain.setValueAtTime(0.9, ctx.currentTime)
      gainNode.gain.setValueAtTime(0.9, ctx.currentTime + 2.8)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3)
      
      // Play for 3 seconds
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 3)
      
      console.log('Notification sound played')
    } catch (error) {
      console.error('Could not play notification sound:', error)
      // Fallback: try creating new context
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        gainNode.gain.value = 0.9 // Loud volume
        
        oscillator.start()
        oscillator.stop(ctx.currentTime + 3)
      } catch (fallbackError) {
        console.error('Fallback sound also failed:', fallbackError)
      }
    }
  }

  // Show notification popup
  const showNotification = (order) => {
    const notification = {
      id: Date.now(),
      order: order,
      timestamp: new Date()
    }
    
    setNotifications(prev => [notification, ...prev])
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 5000)
  }

  const loadOrders = () => {
    const loadedOrders = storage.get('orders', true) || []
    // Sort by timestamp (newest first)
    const sortedOrders = [...loadedOrders].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
    
    // Detect new orders
    if (previousOrderIds.size > 0) {
      const currentOrderIds = new Set(sortedOrders.map(o => o.id))
      const newOrders = sortedOrders.filter(order => 
        !previousOrderIds.has(order.id) && order.status === 'Pending'
      )
      
      // Show notification and play sound for each new order
      if (newOrders.length > 0) {
        console.log('New orders detected:', newOrders.length)
        newOrders.forEach((order, index) => {
          // Show notification immediately
          showNotification(order)
          // Play sound with slight delay to avoid overlap
          setTimeout(() => {
            playNotificationSound()
          }, index * 500) // 500ms delay between sounds if multiple orders
        })
      }
    }
    
    setPreviousOrderIds(new Set(sortedOrders.map(o => o.id)))
    setOrders(sortedOrders)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    storage.set('orders', updatedOrders, true)
    setOrders(updatedOrders)
    setSelectedOrder(null)
  }

  const deleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId)
      storage.set('orders', updatedOrders, true)
      setOrders(updatedOrders)
      setSelectedOrder(null)
    }
  }

  const processPayment = (orderId, paymentMethod) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId 
        ? { 
            ...order, 
            paymentStatus: 'Paid',
            paymentMethod: paymentMethod,
            paymentTimestamp: new Date().toISOString()
          }
        : order
    )
    storage.set('orders', updatedOrders, true)
    setOrders(updatedOrders)
    setShowPaymentModal(false)
    setOrderToPay(null)
    setSelectedPaymentMethod(null)
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updatedOrders.find(o => o.id === orderId))
    }
  }

  const openPaymentModal = (order) => {
    setOrderToPay(order)
    setShowPaymentModal(true)
    setSelectedPaymentMethod(null)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-red-500" />
      case 'Preparing':
        return <ChefHat className="w-5 h-5 text-yellow-500" />
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  // Calculate statistics
  const today = new Date().toDateString()
  const todayOrders = orders.filter(order => 
    new Date(order.timestamp).toDateString() === today
  )
  const totalOrdersToday = todayOrders.length
  const pendingOrders = orders.filter(order => order.status === 'Pending').length
  const activeTables = [...new Set(orders.filter(order => order.status !== 'Completed').map(order => order.tableNumber))].length
  const totalRevenue = todayOrders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.total, 0)
  const paidOrders = todayOrders.filter(order => order.paymentStatus === 'Paid')
  const totalPaid = paidOrders.reduce((sum, order) => sum + order.total, 0)
  const unpaidOrders = todayOrders.filter(order => order.paymentStatus !== 'Paid' && order.status === 'Completed')
  const totalUnpaid = unpaidOrders.reduce((sum, order) => sum + order.total, 0)
  
  // Payment method breakdown
  const paymentBreakdown = {
    Cash: paidOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.total, 0),
    Card: paidOrders.filter(o => o.paymentMethod === 'Card').reduce((sum, o) => sum + o.total, 0),
    QR: paidOrders.filter(o => o.paymentMethod === 'QR').reduce((sum, o) => sum + o.total, 0),
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get table status and orders
  const getTableData = (tableNumber) => {
    const tableOrders = orders.filter(order => order.tableNumber === tableNumber)
    const activeOrders = tableOrders.filter(order => order.status !== 'Completed')
    const pendingOrders = activeOrders.filter(order => order.status === 'Pending')
    const preparingOrders = activeOrders.filter(order => order.status === 'Preparing')
    
    let status = 'empty'
    if (pendingOrders.length > 0) status = 'pending'
    else if (preparingOrders.length > 0) status = 'preparing'
    else if (activeOrders.length > 0) status = 'active'
    
    const totalAmount = activeOrders.reduce((sum, order) => sum + order.total, 0)
    
    return {
      tableNumber,
      orders: tableOrders,
      activeOrders,
      pendingOrders,
      preparingOrders,
      status,
      totalAmount,
      orderCount: activeOrders.length
    }
  }

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 border-red-400 text-red-800'
      case 'preparing':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800'
      case 'active':
        return 'bg-blue-100 border-blue-400 text-blue-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600'
    }
  }

  const getTableStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-red-600" />
      case 'preparing':
        return <ChefHat className="w-6 h-6 text-yellow-600" />
      case 'active':
        return <CheckCircle className="w-6 h-6 text-blue-600" />
      default:
        return <Users className="w-6 h-6 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100">
      {/* Header */}
      <div className="bg-coffee-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lakopi Restaurant Dashboard</h1>
            <p className="text-coffee-200 mt-1">Order Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                const newState = !soundEnabled
                setSoundEnabled(newState)
                
                // Always play test sound when clicking (to test or enable)
                if (newState) {
                  // Initialize audio context on first enable
                  if (!audioContext) {
                    try {
                      const ctx = new (window.AudioContext || window.webkitAudioContext)()
                      if (ctx.state === 'suspended') {
                        await ctx.resume()
                      }
                      setAudioContext(ctx)
                      console.log('Audio context initialized')
                    } catch (error) {
                      console.error('Failed to initialize audio:', error)
                    }
                  }
                  // Play test sound immediately
                  console.log('Playing test sound...')
                  await playNotificationSound()
                } else {
                  console.log('Notifications disabled')
                }
              }}
              className={`px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                soundEnabled 
                  ? 'bg-coffee-600 hover:bg-coffee-700' 
                  : 'bg-coffee-700 hover:bg-coffee-600 opacity-75'
              }`}
              title={soundEnabled ? 'Click to disable or test sound' : 'Click to enable notifications and test sound'}
            >
              <Bell className={`w-4 h-4 ${soundEnabled ? 'animate-pulse' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/table/1')}
              className="bg-coffee-600 hover:bg-coffee-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Customer View
            </button>
          </div>
        </div>
      </div>

      {/* Notification Popups */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="bg-white rounded-xl shadow-2xl border-2 border-red-400 animate-slide-in-right p-4"
            onClick={() => {
              setSelectedOrder(notification.order)
              setViewMode('orders')
              setNotifications(prev => prev.filter(n => n.id !== notification.id))
            }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <Bell className="w-5 h-5 text-red-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-coffee-800">New Order!</h3>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    Table {notification.order.tableNumber}
                  </span>
                </div>
                <p className="text-sm text-coffee-600 mb-2">
                  {notification.order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                </p>
                <p className="text-lg font-bold text-coffee-700">
                  RM {notification.order.total.toFixed(2)}
                </p>
                <p className="text-xs text-coffee-400 mt-1">
                  {formatTime(notification.order.timestamp)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setNotifications(prev => prev.filter(n => n.id !== notification.id))
                }}
                className="text-coffee-400 hover:text-coffee-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-coffee-800">Dashboard</h2>
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setViewMode('tables')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${
                viewMode === 'tables'
                  ? 'bg-coffee-600 text-white'
                  : 'text-coffee-600 hover:bg-coffee-50'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('orders')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${
                viewMode === 'orders'
                  ? 'bg-coffee-600 text-white'
                  : 'text-coffee-600 hover:bg-coffee-50'
              }`}
            >
              <List className="w-4 h-4" />
              Order List
            </button>
            <button
              onClick={() => setViewMode('report')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${
                viewMode === 'report'
                  ? 'bg-coffee-600 text-white'
                  : 'text-coffee-600 hover:bg-coffee-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Summary Report
            </button>
            <button
              onClick={() => setViewMode('menu')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${
                viewMode === 'menu'
                  ? 'bg-coffee-600 text-white'
                  : 'text-coffee-600 hover:bg-coffee-50'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Menu Management
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-600 text-sm font-medium">Total Orders Today</p>
                <p className="text-3xl font-bold text-coffee-800 mt-2">{totalOrdersToday}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-coffee-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-600 text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{pendingOrders}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-600 text-sm font-medium">Active Tables</p>
                <p className="text-3xl font-bold text-coffee-800 mt-2">{activeTables}</p>
              </div>
              <Users className="w-10 h-10 text-coffee-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-coffee-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">RM {totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Table Slots View (POS Style) */}
        {viewMode === 'tables' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-coffee-200">
              <h2 className="text-2xl font-bold text-coffee-800">Table Management</h2>
              <p className="text-coffee-600 text-sm mt-1">Click on a table to view and manage orders</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(tableNum => {
                  const tableData = getTableData(tableNum)
                  return (
                    <button
                      key={tableNum}
                      onClick={() => setSelectedTable(tableNum)}
                      className={`relative p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${getTableStatusColor(tableData.status)}`}
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          {getTableStatusIcon(tableData.status)}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Table {tableNum}</h3>
                        {tableData.status === 'empty' ? (
                          <p className="text-sm opacity-75">Available</p>
                        ) : (
                          <>
                            <p className="text-sm font-semibold mb-1">
                              {tableData.orderCount} Active Order{tableData.orderCount !== 1 ? 's' : ''}
                            </p>
                            {tableData.pendingOrders.length > 0 && (
                              <p className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full inline-block mb-1">
                                {tableData.pendingOrders.length} Pending
                              </p>
                            )}
                            {tableData.preparingOrders.length > 0 && (
                              <p className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full inline-block mb-1">
                                {tableData.preparingOrders.length} Preparing
                              </p>
                            )}
                            <p className="text-lg font-bold mt-2">
                              RM {tableData.totalAmount.toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>
                      {tableData.pendingOrders.length > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {tableData.pendingOrders.length}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Table Orders Modal */}
        {selectedTable && viewMode === 'tables' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-coffee-200 bg-coffee-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-coffee-800">
                      Table {selectedTable} - Orders
                    </h2>
                    <p className="text-coffee-600 mt-1">
                      {getTableData(selectedTable).activeOrders.length} active order{getTableData(selectedTable).activeOrders.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="text-coffee-600 hover:text-coffee-800"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {getTableData(selectedTable).activeOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-coffee-300 mx-auto mb-4" />
                    <p className="text-coffee-600 text-lg">No active orders for this table</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getTableData(selectedTable).activeOrders.map(order => (
                      <div
                        key={order.id}
                        className="border-2 border-coffee-200 rounded-xl p-4 hover:border-coffee-400 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedTable(null)
                          setSelectedOrder(order)
                          setViewMode('orders')
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="text-sm text-coffee-500">
                              {formatTime(order.timestamp)}
                            </span>
                          </div>
                          <span className="text-xl font-bold text-coffee-700">
                            RM {order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-coffee-700">
                              <span>{item.quantity}x {item.name}</span>
                              <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {order.status === 'Pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order.id, 'Preparing')
                              }}
                              className="flex-1 min-w-[100px] bg-yellow-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <ChefHat className="w-4 h-4" />
                              Preparing
                            </button>
                          )}
                          {order.status !== 'Completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order.id, 'Completed')
                              }}
                              className="flex-1 min-w-[100px] bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </button>
                          )}
                          {order.status === 'Completed' && order.paymentStatus !== 'Paid' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openPaymentModal(order)
                              }}
                              className="flex-1 min-w-[100px] bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <Receipt className="w-4 h-4" />
                              Pay
                            </button>
                          )}
                          {order.paymentStatus === 'Paid' && (
                            <span className="px-3 py-2 bg-green-100 text-green-800 text-xs font-semibold rounded-lg flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Paid ({order.paymentMethod})
                            </span>
                          )}
                          {order.status !== 'Completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteOrder(order.id)
                              }}
                              className="bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {viewMode === 'orders' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-coffee-200">
            <h2 className="text-2xl font-bold text-coffee-800">All Orders</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-coffee-300 mx-auto mb-4" />
              <p className="text-coffee-600 text-lg">No orders yet</p>
              <p className="text-coffee-400 text-sm mt-2">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="divide-y divide-coffee-100">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="p-6 hover:bg-coffee-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(order.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-coffee-800 text-lg">
                            Table {order.tableNumber}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-coffee-600">
                          <p className="font-medium">
                            {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-coffee-400">
                              {formatDate(order.timestamp)} at {formatTime(order.timestamp)}
                            </p>
                            {order.paymentStatus === 'Paid' && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Paid ({order.paymentMethod})
                              </span>
                            )}
                            {order.status === 'Completed' && order.paymentStatus !== 'Paid' && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                                Unpaid
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-coffee-700">RM {order.total.toFixed(2)}</p>
                      <p className="text-xs text-coffee-400">Order #{order.id.slice(-6)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Summary Report View */}
        {viewMode === 'report' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-coffee-200">
                <h2 className="text-2xl font-bold text-coffee-800">Daily Summary Report</h2>
                <p className="text-coffee-600 text-sm mt-1">{formatDate(new Date())}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-800">Total Revenue</h3>
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-700">RM {totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-blue-800">Paid Amount</h3>
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-700">RM {totalPaid.toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-orange-800">Unpaid Amount</h3>
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-700">RM {totalUnpaid.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border-2 border-coffee-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Banknote className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-coffee-800">Cash</h4>
                    </div>
                    <p className="text-2xl font-bold text-coffee-700">RM {paymentBreakdown.Cash.toFixed(2)}</p>
                    <p className="text-xs text-coffee-500 mt-1">
                      {paidOrders.filter(o => o.paymentMethod === 'Cash').length} transactions
                    </p>
                  </div>
                  <div className="bg-white border-2 border-coffee-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-coffee-800">Card</h4>
                    </div>
                    <p className="text-2xl font-bold text-coffee-700">RM {paymentBreakdown.Card.toFixed(2)}</p>
                    <p className="text-xs text-coffee-500 mt-1">
                      {paidOrders.filter(o => o.paymentMethod === 'Card').length} transactions
                    </p>
                  </div>
                  <div className="bg-white border-2 border-coffee-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <QrCode className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-coffee-800">QR Code</h4>
                    </div>
                    <p className="text-2xl font-bold text-coffee-700">RM {paymentBreakdown.QR.toFixed(2)}</p>
                    <p className="text-xs text-coffee-500 mt-1">
                      {paidOrders.filter(o => o.paymentMethod === 'QR').length} transactions
                    </p>
                  </div>
                </div>

                <div className="bg-coffee-50 rounded-xl p-6">
                  <h3 className="font-semibold text-coffee-800 mb-4">Order Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-coffee-600">Total Orders</p>
                      <p className="text-2xl font-bold text-coffee-800">{totalOrdersToday}</p>
                    </div>
                    <div>
                      <p className="text-sm text-coffee-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {todayOrders.filter(o => o.status === 'Completed').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-coffee-600">Paid</p>
                      <p className="text-2xl font-bold text-blue-600">{paidOrders.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-coffee-600">Unpaid</p>
                      <p className="text-2xl font-bold text-orange-600">{unpaidOrders.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Paid Orders */}
            {paidOrders.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-coffee-200">
                  <h2 className="text-2xl font-bold text-coffee-800">Recent Payments</h2>
                </div>
                <div className="divide-y divide-coffee-100">
                  {paidOrders.slice(0, 10).map(order => (
                    <div key={order.id} className="p-4 hover:bg-coffee-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-coffee-800">
                            Table {order.tableNumber} • Order #{order.id.slice(-6)}
                          </p>
                          <p className="text-sm text-coffee-600">
                            {formatTime(order.paymentTimestamp || order.timestamp)} • {order.paymentMethod}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-green-600">RM {order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu Management View */}
        {viewMode === 'menu' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-coffee-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-coffee-800">Menu Management</h2>
                  <p className="text-coffee-600 text-sm mt-1">Add, edit, or remove menu items</p>
                </div>
                <button
                  onClick={() => openMenuModal()}
                  className="bg-coffee-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-coffee-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Menu Item
                </button>
              </div>

              <div className="p-6">
                {/* Menu by Category */}
                {['Coffee', 'Food', 'Drinks'].map(category => {
                  const categoryItems = menuItems.filter(item => item.category === category)
                  return (
                    <div key={category} className="mb-8">
                      <h3 className="text-xl font-bold text-coffee-800 mb-4 pb-2 border-b-2 border-coffee-200">
                        {category} ({categoryItems.length} items)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryItems.map(item => (
                          <div
                            key={item.id}
                            className="bg-coffee-50 rounded-xl overflow-hidden border-2 border-coffee-200 hover:border-coffee-400 transition-colors"
                          >
                            <div className="relative h-48 bg-coffee-200 overflow-hidden">
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
                              <h4 className="font-bold text-coffee-800 text-lg mb-1">{item.name}</h4>
                              {item.description && (
                                <p className="text-sm text-coffee-600 mb-2">{item.description}</p>
                              )}
                              <p className="text-xl font-bold text-coffee-700 mb-3">RM {item.price.toFixed(2)}</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openMenuModal(item)}
                                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteMenuItem(item.id)}
                                  className="bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {categoryItems.length === 0 && (
                          <div className="col-span-full text-center py-8 text-coffee-400">
                            No items in this category
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Item Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-coffee-200 bg-coffee-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-coffee-800">
                  {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowMenuModal(false)
                    setEditingMenuItem(null)
                    setMenuForm({ name: '', price: '', category: 'Food', image: '', description: '' })
                  }}
                  className="text-coffee-600 hover:text-coffee-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Image Preview */}
                {menuForm.image && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-coffee-800 mb-2">Image Preview</label>
                    <div className="relative h-48 bg-coffee-100 rounded-lg overflow-hidden border-2 border-coffee-200">
                      <img
                        src={menuForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-coffee-400">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p>Invalid image URL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-coffee-200 rounded-lg focus:border-coffee-500 focus:outline-none"
                    placeholder="e.g., Grilled Chicken Sandwich"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-2">
                    Price (RM) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-coffee-200 rounded-lg focus:border-coffee-500 focus:outline-none"
                    placeholder="e.g., 25.00"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-coffee-200 rounded-lg focus:border-coffee-500 focus:outline-none"
                  >
                    <option value="Coffee">Coffee</option>
                    <option value="Food">Food</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-2">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={menuForm.image}
                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-coffee-200 rounded-lg focus:border-coffee-500 focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-xs text-coffee-500 mt-1">
                    Tip: Use Unsplash, Imgur, or any image hosting service
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-coffee-800 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-coffee-200 rounded-lg focus:border-coffee-500 focus:outline-none"
                    rows="3"
                    placeholder="e.g., Fresh sandwich with grilled chicken, lettuce, and special sauce"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-coffee-200 bg-coffee-50">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowMenuModal(false)
                    setEditingMenuItem(null)
                    setMenuForm({ name: '', price: '', category: 'Food', image: '', description: '' })
                  }}
                  className="flex-1 bg-coffee-200 text-coffee-800 py-3 px-4 rounded-lg font-semibold hover:bg-coffee-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveMenuItem}
                  className="flex-1 bg-coffee-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-coffee-700 transition-colors"
                >
                  {editingMenuItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && orderToPay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-coffee-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-coffee-800">Process Payment</h2>
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setOrderToPay(null)
                    setSelectedPaymentMethod(null)
                  }}
                  className="text-coffee-600 hover:text-coffee-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-coffee-600 mb-2">Table {orderToPay.tableNumber}</p>
                <p className="text-3xl font-bold text-coffee-800">RM {orderToPay.total.toFixed(2)}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-coffee-800 mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedPaymentMethod('Cash')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPaymentMethod === 'Cash'
                        ? 'border-green-500 bg-green-50'
                        : 'border-coffee-200 hover:border-coffee-400'
                    }`}
                  >
                    <Banknote className={`w-8 h-8 mx-auto mb-2 ${
                      selectedPaymentMethod === 'Cash' ? 'text-green-600' : 'text-coffee-600'
                    }`} />
                    <p className={`font-semibold ${
                      selectedPaymentMethod === 'Cash' ? 'text-green-700' : 'text-coffee-700'
                    }`}>Cash</p>
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('Card')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPaymentMethod === 'Card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-coffee-200 hover:border-coffee-400'
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                      selectedPaymentMethod === 'Card' ? 'text-blue-600' : 'text-coffee-600'
                    }`} />
                    <p className={`font-semibold ${
                      selectedPaymentMethod === 'Card' ? 'text-blue-700' : 'text-coffee-700'
                    }`}>Card</p>
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('QR')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPaymentMethod === 'QR'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-coffee-200 hover:border-coffee-400'
                    }`}
                  >
                    <QrCode className={`w-8 h-8 mx-auto mb-2 ${
                      selectedPaymentMethod === 'QR' ? 'text-purple-600' : 'text-coffee-600'
                    }`} />
                    <p className={`font-semibold ${
                      selectedPaymentMethod === 'QR' ? 'text-purple-700' : 'text-coffee-700'
                    }`}>QR</p>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedPaymentMethod) {
                    processPayment(orderToPay.id, selectedPaymentMethod)
                  }
                }}
                disabled={!selectedPaymentMethod}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                  selectedPaymentMethod
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Receipt className="w-5 h-5" />
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-coffee-200 bg-coffee-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-coffee-800">
                    Order #{selectedOrder.id.slice(-6)}
                  </h2>
                  <p className="text-coffee-600 mt-1">
                    Table {selectedOrder.tableNumber} • {formatDate(selectedOrder.timestamp)} at {formatTime(selectedOrder.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-coffee-600 hover:text-coffee-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-coffee-800 mb-3">Items:</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-coffee-50 p-3 rounded-lg">
                      <span className="text-coffee-800">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-coffee-700">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-coffee-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-coffee-800">Total:</span>
                  <span className="text-3xl font-bold text-coffee-700">
                    RM {selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-coffee-200 bg-coffee-50 space-y-3">
              {/* Payment Status */}
              {selectedOrder.paymentStatus === 'Paid' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-800">Payment Received</p>
                      <p className="text-sm text-green-600">
                        Method: {selectedOrder.paymentMethod} • {selectedOrder.paymentTimestamp && formatTime(selectedOrder.paymentTimestamp)}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              )}
              
              {/* Order Status Actions */}
              <div className="flex gap-2 flex-wrap">
                {selectedOrder.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Preparing')}
                      className="flex-1 min-w-[140px] bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ChefHat className="w-5 h-5" />
                      Mark as Preparing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Completed')}
                      className="flex-1 min-w-[140px] bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Completed
                    </button>
                  </>
                )}
                {selectedOrder.status === 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Completed')}
                    className="flex-1 min-w-[140px] bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Completed
                  </button>
                )}
                {selectedOrder.status === 'Completed' && selectedOrder.paymentStatus !== 'Paid' && (
                  <button
                    onClick={() => openPaymentModal(selectedOrder)}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Receipt className="w-5 h-5" />
                    Process Payment
                  </button>
                )}
                {selectedOrder.status !== 'Completed' && (
                  <button
                    onClick={() => deleteOrder(selectedOrder.id)}
                    className="bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                )}
                {selectedOrder.status === 'Completed' && selectedOrder.paymentStatus === 'Paid' && (
                  <div className="w-full text-center text-coffee-600 py-2">
                    Order completed and paid.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

