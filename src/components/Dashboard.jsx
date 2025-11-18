import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../utils/auth'
import Logo from './Logo'
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
  ShoppingBag,
  LogOut,
  ArrowRight,
  Move,
  Receipt as ReceiptIcon
} from 'lucide-react'
import { storage } from '../utils/storage'
import { firebaseStorage } from '../utils/firebaseStorage'
import { getMenuItems, saveMenuItems, defaultMenuItems, categories } from '../data/menu'

const Dashboard = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [viewMode, setViewMode] = useState('tables') // 'tables', 'orders', 'report', or 'menu'
  const [selectedTable, setSelectedTable] = useState(null)
  const [showTableManagement, setShowTableManagement] = useState(false)
  const [tableCart, setTableCart] = useState([])
  const [showBill, setShowBill] = useState(false)
  const [moveItemModal, setMoveItemModal] = useState(null)
  const [cashierName, setCashierName] = useState('Admin')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [amountPaid, setAmountPaid] = useState(0)
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
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
  const [soundEnabled, setSoundEnabled] = useState(true)
  // Track which orders have already triggered sound notification (prevent looping)
  const notifiedOrderIds = useRef(new Set())
  // Track previous order IDs for change detection (use ref to avoid stale closure issues)
  const previousOrderIds = useRef(new Set())
  // Store AudioContext reference for initialization
  const audioContextRef = useRef(null)

  useEffect(() => {
    // Initialize menu first to ensure it's available
    const initializeMenuFirst = () => {
      const stored = storage.get('menuItems', true)
      if (!stored || !Array.isArray(stored) || stored.length === 0) {
        console.log('Initializing menu items...')
        storage.set('menuItems', defaultMenuItems, true)
      }
    }
    initializeMenuFirst()
    
    loadOrders()
    loadMenuItems()
    
    // Set up Firebase real-time listener for cross-device sync
    let firebaseUnsubscribe = null
    if (firebaseStorage.isFirebaseAvailable()) {
      console.log('✅ Setting up Firebase real-time listener for orders')
      firebaseUnsubscribe = firebaseStorage.onOrdersChange((orders) => {
        console.log('📡 Firebase: Orders updated in real-time:', orders?.length || 0, 'orders')
        if (orders && Array.isArray(orders)) {
          loadOrdersFromData(orders)
        }
      })
    } else {
      console.log('⚠️ Firebase not available - using localStorage polling (single-device mode)')
    }
    
    // Initialize AudioContext on user interaction (required by browser autoplay policy)
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)()
          audioContextRef.current = ctx
          // Resume if suspended
          if (ctx.state === 'suspended') {
            ctx.resume().then(() => {
              console.log('AudioContext initialized and resumed')
            }).catch(err => {
              console.error('Error resuming AudioContext:', err)
            })
          }
        } catch (error) {
          console.error('Error creating AudioContext:', error)
        }
      }
    }
    
    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initAudioContext()
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
    
    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })
    
    // Load voices for speech synthesis (needed for some browsers)
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length === 0) {
          // Voices may not be loaded yet, try again
          setTimeout(loadVoices, 100)
        }
      }
    }
    
    // Load voices on page load
    if ('speechSynthesis' in window) {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    
    // Listen for storage updates
    const handleStorageUpdate = (event) => {
      console.log('handleStorageUpdate called with event:', event)
      // Check if this is an orders update
      const eventKey = event?.detail?.key || event?.key
      const isOrdersUpdate = event && (
        eventKey === 'lakopi_shared_orders'
      )
      
      console.log('Event key:', eventKey, 'Is orders update?', isOrdersUpdate)
      
      if (isOrdersUpdate || !event) {
        // If no event details, reload anyway (might be from custom event)
        console.log('📦 Storage update detected, reloading orders...', event?.detail || event?.key)
        setTimeout(() => {
          loadOrders()
        }, 100) // Small delay to ensure storage is written
      }
    }
    
    const handleMenuUpdate = () => {
      loadMenuItems()
    }
    
    // Listen to custom events (same tab)
    window.addEventListener('storageUpdate', handleStorageUpdate)
    // Listen to native storage events (other tabs/windows)
    window.addEventListener('storage', (e) => {
      console.log('Native storage event received:', e.key, e.newValue ? 'has new value' : 'no new value')
      if (e.key === 'lakopi_shared_orders') {
        console.log('📦 Native storage event detected for orders, reloading...')
        setTimeout(() => {
          loadOrders()
        }, 100) // Small delay to ensure storage is written
      }
    })
    window.addEventListener('menuUpdate', handleMenuUpdate)
    
    // Poll for updates (fallback) - reduced to 1 second for better real-time sync
    const interval = setInterval(() => {
      loadOrders()
    }, 1000)
    
    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      window.removeEventListener('storageUpdate', handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
      window.removeEventListener('menuUpdate', handleMenuUpdate)
      clearInterval(interval)
      // Cancel any ongoing speech when component unmounts
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      // Close AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
      }
      // Cleanup Firebase listeners
      if (firebaseUnsubscribe) {
        firebaseUnsubscribe()
      }
      firebaseStorage.cleanup()
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
        setMenuItems(defaultMenuItems)
        storage.set('menuItems', defaultMenuItems, true)
      }
    } catch (error) {
      console.error('Error loading menu items:', error)
      // Fallback to defaults on error
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

  // Play notification sound - Soft digital ding dong, 1s pause, then "New order received" voice (under 6s total)
  const playNotificationSound = () => {
    console.log('playNotificationSound called, soundEnabled:', soundEnabled)
    if (!soundEnabled) {
      console.log('Sound is disabled')
      return
    }
    
    // Prevent multiple simultaneous sound plays
    if (playNotificationSound.isPlaying) {
      console.log('Sound already playing, skipping')
      return
    }
    
    playNotificationSound.isPlaying = true
    console.log('Starting notification sound playback...')
    
    try {
      // Play soft digital ding dong sound
      const playDingDong = async () => {
        try {
          // Use existing AudioContext if available, otherwise create new one
          let ctx = audioContextRef.current
          if (!ctx || ctx.state === 'closed') {
            console.log('Creating new AudioContext for notification sound')
            ctx = new (window.AudioContext || window.webkitAudioContext)()
            audioContextRef.current = ctx
          }
          
          // Resume AudioContext if suspended (required by browser autoplay policy)
          // Keep trying until it's running or give up after a few attempts
          let attempts = 0
          const maxAttempts = 5
          while (ctx.state !== 'running' && attempts < maxAttempts) {
            if (ctx.state === 'suspended') {
              console.log(`AudioContext is suspended, attempting to resume (attempt ${attempts + 1}/${maxAttempts})...`)
              try {
                await ctx.resume()
                // Wait a bit for the context to stabilize
                await new Promise(resolve => setTimeout(resolve, 50))
                console.log('AudioContext state after resume:', ctx.state)
              } catch (error) {
                console.error('Error resuming AudioContext:', error)
                attempts++
                if (attempts >= maxAttempts) {
                  throw new Error('Failed to resume AudioContext after multiple attempts')
                }
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 100))
                continue
              }
            } else if (ctx.state === 'closed') {
              console.log('AudioContext is closed, creating new one...')
              ctx = new (window.AudioContext || window.webkitAudioContext)()
              audioContextRef.current = ctx
            }
            attempts++
          }
          
          // Final check - if still not running, log warning but try anyway
          if (ctx.state !== 'running') {
            console.warn('AudioContext is not in running state:', ctx.state, '- attempting to play sound anyway')
          } else {
            console.log('AudioContext is ready, state:', ctx.state)
          }
          
          // "Ding" - higher, softer tone
          const ding = () => {
            try {
              const oscillator = ctx.createOscillator()
              const gainNode = ctx.createGain()
              
              oscillator.connect(gainNode)
              gainNode.connect(ctx.destination)
              
              // Soft, pleasant higher tone
              oscillator.frequency.value = 880 // A5 - pleasant, modern tone
              oscillator.type = 'sine' // Smooth sine wave for soft sound
              
              const now = ctx.currentTime
              // Soft attack and decay for gentle sound
              gainNode.gain.setValueAtTime(0, now)
              gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05) // Soft volume
              gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25) // Gentle fade
              
              oscillator.start(now)
              oscillator.stop(now + 0.25)
              console.log('Ding sound started')
            } catch (error) {
              console.error('Error playing ding sound:', error)
            }
          }
          
          // "Dong" - lower, softer tone
          const dong = () => {
            try {
              const oscillator = ctx.createOscillator()
              const gainNode = ctx.createGain()
              
              oscillator.connect(gainNode)
              gainNode.connect(ctx.destination)
              
              // Soft, pleasant lower tone
              oscillator.frequency.value = 660 // E5 - harmonious lower tone
              oscillator.type = 'sine' // Smooth sine wave for soft sound
              
              const now = ctx.currentTime + 0.3 // 300ms after ding starts
              // Soft attack and decay for gentle sound
              gainNode.gain.setValueAtTime(0, now)
              gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05) // Soft volume
              gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3) // Gentle fade
              
              oscillator.start(now)
              oscillator.stop(now + 0.3)
              console.log('Dong sound started')
            } catch (error) {
              console.error('Error playing dong sound:', error)
            }
          }
          
          // Play sounds
          ding()
          dong()
          
          console.log('Ding dong sound sequence started')
          return ctx
        } catch (error) {
          console.error('Could not play ding dong sound:', error)
          playNotificationSound.isPlaying = false
          return null
        }
      }
      
      // Play soft digital ding dong (async to handle AudioContext resume)
      playDingDong().then(audioCtx => {
        console.log('Ding dong sound completed, audioCtx:', audioCtx)
        
        // Play voice announcement after 1 second pause
        if ('speechSynthesis' in window) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel()
          
          // Wait 1 second after ding dong, then announce
          setTimeout(() => {
            try {
              const utterance = new SpeechSynthesisUtterance('New order received')
              
              // Set voice properties for clear, professional voice
              utterance.volume = 1.0 // Maximum volume
              utterance.rate = 0.95 // Slightly slower for clarity and professionalism
              utterance.pitch = 1.0 // Normal pitch for professional tone
              
              // Try to use modern, professional voices
              const voices = window.speechSynthesis.getVoices()
              
              // Priority: Modern professional voices (Google, Microsoft, Apple)
              const preferredVoice = voices.find(voice => 
                // Google modern voices (professional)
                voice.name.toLowerCase().includes('google') ||
                voice.name.toLowerCase().includes('neural') ||
                // Microsoft modern professional voices
                voice.name.toLowerCase().includes('aria') ||
                voice.name.toLowerCase().includes('jenny') ||
                voice.name.toLowerCase().includes('guy') ||
                // Apple modern professional voices
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('alex') ||
                // Professional female voices
                (voice.name.toLowerCase().includes('female') && 
                 !voice.name.toLowerCase().includes('old') &&
                 !voice.name.toLowerCase().includes('compact'))
              ) || voices.find(voice => 
                voice.lang.startsWith('en') && voice.localService === false // Cloud-based voices are usually modern
              ) || voices.find(voice => 
                voice.name.toLowerCase().includes('zira') ||
                voice.name.toLowerCase().includes('samantha')
              )
              
              if (preferredVoice) {
                utterance.voice = preferredVoice
                console.log('Using professional voice:', preferredVoice.name)
              }
              
              // Speak the notification
              window.speechSynthesis.speak(utterance)
              console.log('Voice announcement started')
              
              // Reset playing flag after speech completes
              utterance.onend = () => {
                playNotificationSound.isPlaying = false
                console.log('New order received notification completed')
              }
              
              utterance.onerror = (error) => {
                playNotificationSound.isPlaying = false
                console.error('New order received notification error:', error)
              }
            } catch (error) {
              console.error('Error creating speech utterance:', error)
              playNotificationSound.isPlaying = false
            }
          }, 1000) // 1 second pause after ding dong
        } else {
          // If no speech synthesis, reset flag after ding dong
          setTimeout(() => {
            playNotificationSound.isPlaying = false
          }, 700) // Reset after ding dong completes (~600ms)
        }
        
        // Don't close AudioContext - keep it open for future sounds
        // Only close if it's a new context we created (not the shared one)
        // The shared audioContextRef will be cleaned up on component unmount
      }).catch(error => {
        console.error('Error playing ding dong:', error)
        playNotificationSound.isPlaying = false
      })
    } catch (error) {
      console.error('Could not play notification sound:', error)
      playNotificationSound.isPlaying = false
    }
  }
  
  // Initialize playing flag
  playNotificationSound.isPlaying = false

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

  // Process orders data and detect new orders (shared function)
  const loadOrdersFromData = (loadedOrders) => {
    if (!Array.isArray(loadedOrders)) {
      console.warn('loadOrdersFromData: Invalid orders data', loadedOrders)
      return
    }
    
    console.log('loadOrdersFromData called - Total orders:', loadedOrders.length)
    
    // Sort by timestamp (newest first)
    const sortedOrders = [...loadedOrders].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
    
    const currentOrderIds = new Set(sortedOrders.map(o => o.id))
    const isFirstLoad = previousOrderIds.current.size === 0
    
    console.log('Current order IDs:', Array.from(currentOrderIds))
    console.log('Previous order IDs:', Array.from(previousOrderIds.current))
    console.log('Is first load?', isFirstLoad)
    
    // Detect new orders (works even on first load by checking if previousOrderIds is empty)
    if (!isFirstLoad) {
      // Filter new orders that haven't been notified yet
      const newOrders = sortedOrders.filter(order => {
        const isNew = !previousOrderIds.current.has(order.id)
        const isPending = order.status === 'Pending'
        const notNotified = !notifiedOrderIds.current.has(order.id)
        const shouldNotify = isNew && isPending && notNotified
        
        if (isNew) {
          console.log(`Order ${order.id} is new. Status: ${order.status}, Already notified: ${notifiedOrderIds.current.has(order.id)}`)
        }
        
        return shouldNotify
      })
      
      console.log('New orders found:', newOrders.length, newOrders.map(o => ({ id: o.id, table: o.tableNumber, status: o.status })))
      
      // Show notification and play sound for new orders (only once per order, not looping)
      if (newOrders.length > 0) {
        console.log('🎉 NEW ORDERS DETECTED:', newOrders.length)
        
        // Mark these orders as notified to prevent looping
        newOrders.forEach((order) => {
          console.log('Marking order as notified:', order.id)
          notifiedOrderIds.current.add(order.id)
          showNotification(order)
        })
        
        // Play sound only once (not looping) - regardless of how many new orders
        // Only if sound is not already playing
        if (!playNotificationSound.isPlaying) {
          console.log('🔔 Triggering notification sound for new orders')
          // Ensure AudioContext is initialized before playing
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)()
              audioContextRef.current = ctx
              console.log('Created new AudioContext for notification, state:', ctx.state)
            } catch (error) {
              console.error('Error creating AudioContext:', error)
            }
          } else {
            console.log('AudioContext exists, state:', audioContextRef.current.state)
          }
          playNotificationSound()
        } else {
          console.log('Sound already playing, skipping')
        }
      } else {
        console.log('No new orders to notify')
      }
    } else {
      // First load: Initialize previousOrderIds with current orders
      // Also mark all existing pending orders as notified to prevent false notifications
      console.log('First load - initializing previousOrderIds and marking existing orders as notified')
      sortedOrders.forEach(order => {
        if (order.status === 'Pending') {
          notifiedOrderIds.current.add(order.id)
          console.log('Marked existing pending order as notified:', order.id)
        }
      })
    }
    
    // Update previousOrderIds ref (not state, to avoid stale closure issues)
    previousOrderIds.current = currentOrderIds
    setOrders(sortedOrders)
    console.log('loadOrdersFromData completed. Previous order IDs updated to:', Array.from(previousOrderIds.current))
  }

  const loadOrders = async () => {
    let loadedOrders = []
    
    // Try Firebase first if available
    if (firebaseStorage.isFirebaseAvailable()) {
      try {
        loadedOrders = await firebaseStorage.get('orders', true) || []
        console.log('✅ Loaded orders from Firebase:', loadedOrders.length)
      } catch (error) {
        console.error('Error loading from Firebase, falling back to localStorage:', error)
        loadedOrders = storage.get('orders', true) || []
      }
    } else {
      // Fallback to localStorage
      loadedOrders = storage.get('orders', true) || []
      console.log('Loaded orders from localStorage:', loadedOrders.length)
    }
    
    loadOrdersFromData(loadedOrders)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    
    // Save to Firebase if available, otherwise localStorage
    if (firebaseStorage.isFirebaseAvailable()) {
      try {
        await firebaseStorage.set('orders', updatedOrders, true)
        console.log('✅ Order status updated in Firebase')
      } catch (error) {
        console.error('Error updating order in Firebase:', error)
        storage.set('orders', updatedOrders, true)
      }
    } else {
      storage.set('orders', updatedOrders, true)
    }
    
    setOrders(updatedOrders)
    // Only clear selected order if it's the one being updated
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null)
    }
  }

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId)
      
      // Save to Firebase if available, otherwise localStorage
      if (firebaseStorage.isFirebaseAvailable()) {
        try {
          await firebaseStorage.set('orders', updatedOrders, true)
          console.log('✅ Order deleted from Firebase')
        } catch (error) {
          console.error('Error deleting order from Firebase:', error)
          storage.set('orders', updatedOrders, true)
        }
      } else {
        storage.set('orders', updatedOrders, true)
      }
      
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
    // Close the order detail modal when opening payment modal
    setSelectedOrder(null)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 text-white p-6 shadow-xl animate-fade-in">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="w-40 h-12" />
            <div className="border-l border-green-300 pl-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-green-200 text-sm mt-1">Order Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                const newState = !soundEnabled
                setSoundEnabled(newState)
                
                // Initialize AudioContext if not already done (required for browser autoplay policy)
                if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                  try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)()
                    audioContextRef.current = ctx
                    if (ctx.state === 'suspended') {
                      await ctx.resume()
                      console.log('AudioContext initialized and resumed for test')
                    }
                  } catch (error) {
                    console.error('Error initializing AudioContext:', error)
                  }
                } else if (audioContextRef.current.state === 'suspended') {
                  try {
                    await audioContextRef.current.resume()
                    console.log('AudioContext resumed for test')
                  } catch (error) {
                    console.error('Error resuming AudioContext:', error)
                  }
                }
                
                // Always play test notification when clicking (to test or enable)
                if (newState) {
                  // Play test notification immediately
                  console.log('Playing test notification...')
                  playNotificationSound()
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
              className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-bounce flex items-center gap-2 hover-lift shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Customer View
            </button>
            <button
              onClick={() => {
                auth.logout()
                navigate('/login')
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-bounce flex items-center gap-2 hover-lift shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tableNum => {
                  const tableData = getTableData(tableNum)
                  return (
                    <div key={tableNum} className="flex flex-col">
                      <button
                        onClick={() => {
                          setSelectedTable(tableNum)
                          setShowTableManagement(true)
                          setTableCart([])
                        }}
                        className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${getTableStatusColor(tableData.status)} animate-fade-in-up flex-1`}
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
                      {/* Send to Kitchen Button */}
                      {tableData.pendingOrders.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Mark all pending orders as Preparing in a single update
                            const pendingOrderIds = tableData.pendingOrders.map(order => order.id)
                            const updatedOrders = orders.map(order =>
                              pendingOrderIds.includes(order.id) 
                                ? { ...order, status: 'Preparing' } 
                                : order
                            )
                            storage.set('orders', updatedOrders, true)
                            setOrders(updatedOrders)
                            // Reload to ensure synchronization
                            loadOrders()
                          }}
                          className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover-lift"
                        >
                          <ChefHat className="w-3 h-3" />
                          Send {tableData.pendingOrders.length} to Kitchen
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Advanced POS Table Management Modal */}
        {showTableManagement && selectedTable && viewMode === 'tables' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col animate-scale-in">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-green-200 bg-gradient-to-r from-green-50 to-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
                      Table {selectedTable} - POS Management
                    </h2>
                    <p className="text-green-600 text-sm mt-1">
                      {getTableData(selectedTable).activeOrders.length} active order{getTableData(selectedTable).activeOrders.length !== 1 ? 's' : ''} • Total: RM {getTableData(selectedTable).totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBill(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 hover-lift shadow-md"
                    >
                      <ReceiptIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">View Bill</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowTableManagement(false)
                        setSelectedTable(null)
                        setTableCart([])
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-all hover-lift"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* POS Split View */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4 sm:p-6">
                {/* Left: Menu Items */}
                <div className="w-full lg:w-1/2 border-r-0 lg:border-r border-green-200 pr-0 lg:pr-4 overflow-y-auto">
                  <div className="sticky top-0 bg-white pb-4 z-10">
                    <h3 className="text-lg font-bold text-green-800 mb-3">Add Items to Table</h3>
                    {/* Search Bar */}
                    <div className="relative mb-3">
                      <input
                        type="text"
                        value={menuSearchQuery}
                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                        placeholder="Search menu items..."
                        className="w-full px-4 py-2 pl-10 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none text-green-800"
                      />
                      <ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {menuItems
                      .filter(item => 
                        menuSearchQuery === '' || 
                        item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(menuSearchQuery.toLowerCase())
                      )
                      .map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const existing = tableCart.find(i => i.id === item.id)
                          if (existing) {
                            setTableCart(tableCart.map(i => 
                              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            ))
                          } else {
                            setTableCart([...tableCart, { ...item, quantity: 1 }])
                          }
                        }}
                        className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-3 text-left transition-all hover-lift"
                      >
                        <div className="text-xs font-semibold text-green-800 mb-1 line-clamp-1">{item.name}</div>
                        <div className="text-sm font-bold text-green-700">RM {item.price.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Table Items & Cart */}
                <div className="w-full lg:w-1/2 flex flex-col">
                  {/* Current Table Items */}
                  <div className="flex-1 overflow-y-auto mb-4">
                    <h3 className="text-lg font-bold text-green-800 mb-3">Table Items</h3>
                    {getTableData(selectedTable).activeOrders.length === 0 && tableCart.length === 0 ? (
                      <div className="text-center py-8 text-green-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No items. Add items from menu.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Items from existing orders */}
                        {getTableData(selectedTable).activeOrders.flatMap(order => 
                          order.items.map((item, idx) => (
                            <div key={`${order.id}-${idx}`} className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-semibold text-green-800 text-sm">{item.quantity}x {item.name}</div>
                                <div className="text-xs text-green-600">RM {(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    const orderToUpdate = orders.find(o => o.id === order.id)
                                    if (orderToUpdate) {
                                      const updatedItems = orderToUpdate.items.filter((_, i) => i !== idx)
                                      if (updatedItems.length === 0) {
                                        deleteOrder(order.id)
                                      } else {
                                        const newTotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
                                        const updatedOrders = orders.map(o => 
                                          o.id === order.id 
                                            ? { ...o, items: updatedItems, total: newTotal }
                                            : o
                                        )
                                        storage.set('orders', updatedOrders, true)
                                        setOrders(updatedOrders)
                                      }
                                    }
                                  }}
                                  className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setMoveItemModal({ orderId: order.id, itemIndex: idx, item })}
                                  className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 transition-colors"
                                  title="Move to another table"
                                >
                                  <Move className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                        {/* Items in cart (to be added) */}
                        {tableCart.map((item, idx) => (
                          <div key={`cart-${idx}`} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-blue-800 text-sm">{item.quantity}x {item.name}</div>
                              <div className="text-xs text-blue-600">RM {(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    setTableCart(tableCart.map((cartItem, index) => index === idx ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem))
                                  } else {
                                    setTableCart(tableCart.filter((_, index) => index !== idx))
                                  }
                                }}
                                className="bg-blue-200 text-blue-800 w-6 h-6 rounded flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className="text-sm font-bold">{item.quantity}</span>
                              <button
                                onClick={() => setTableCart(tableCart.map((cartItem, index) => index === idx ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem))}
                                className="bg-blue-200 text-blue-800 w-6 h-6 rounded flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                              <button
                                onClick={() => setTableCart(tableCart.filter((_, i) => i !== idx))}
                                className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors ml-2"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-green-200 pt-4 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-green-800">Total:</span>
                      <span className="text-2xl font-bold text-green-700">
                        RM {(getTableData(selectedTable).totalAmount + tableCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}
                      </span>
                    </div>
                    {getTableData(selectedTable).activeOrders.length > 0 && (
                      <button
                        onClick={() => {
                          // Move all items from this table to another table
                          const allItems = getTableData(selectedTable).activeOrders.flatMap(order => order.items)
                          if (allItems.length > 0) {
                            setMoveItemModal({ 
                              type: 'all',
                              items: allItems,
                              fromTable: selectedTable
                            })
                          }
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-2"
                      >
                        <Move className="w-4 h-4" />
                        Move All Items to Another Table
                      </button>
                    )}
                    {tableCart.length > 0 && (
                      <button
                        onClick={() => {
                          const newOrder = {
                            id: Date.now().toString(),
                            tableNumber: selectedTable,
                            items: tableCart.map(item => ({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              quantity: item.quantity,
                            })),
                            total: tableCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                            status: 'Pending',
                            timestamp: new Date().toISOString(),
                          }
                          const existingOrders = storage.get('orders', true) || []
                          storage.set('orders', [...existingOrders, newOrder], true)
                          loadOrders()
                          setTableCart([])
                        }}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                      >
                        Add {tableCart.reduce((sum, item) => sum + item.quantity, 0)} Item(s) to Table
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Move Item Modal */}
        {moveItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                {moveItemModal.type === 'all' ? 'Move All Items to Another Table' : 'Move Item to Another Table'}
              </h3>
              {moveItemModal.type === 'all' ? (
                <div className="mb-4">
                  <p className="text-green-600 mb-2">Moving all items from Table {moveItemModal.fromTable}:</p>
                  <div className="bg-green-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {moveItemModal.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-green-800">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-green-600 mb-4">{moveItemModal.item.quantity}x {moveItemModal.item.name}</p>
              )}
              <div className="grid grid-cols-2 gap-2 mb-4 max-h-60 overflow-y-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(t => t !== (moveItemModal.fromTable || selectedTable)).map(tableNum => (
                  <button
                    key={tableNum}
                    onClick={() => {
                      if (moveItemModal.type === 'all') {
                        // Move all items from current table to target table
                        const tableData = getTableData(moveItemModal.fromTable)
                        const allOrders = tableData.activeOrders
                        
                        // Create new order for target table with all items
                        const newOrder = {
                          id: Date.now().toString(),
                          tableNumber: tableNum,
                          items: moveItemModal.items,
                          total: moveItemModal.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                          status: allOrders[0]?.status || 'Pending',
                          timestamp: new Date().toISOString(),
                        }
                        
                        // Remove all orders from source table
                        const updatedOrders = orders.filter(o => 
                          !allOrders.some(order => order.id === o.id)
                        )
                        
                        storage.set('orders', [...updatedOrders, newOrder], true)
                        loadOrders()
                        setMoveItemModal(null)
                        setShowTableManagement(false)
                        setSelectedTable(null)
                      } else {
                        // Remove from current order
                        const orderToUpdate = orders.find(o => o.id === moveItemModal.orderId)
                        if (orderToUpdate) {
                          const updatedItems = orderToUpdate.items.filter((_, i) => i !== moveItemModal.itemIndex)
                          const newTotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
                          
                          // Create new order for target table
                          const newOrder = {
                            id: Date.now().toString(),
                            tableNumber: tableNum,
                            items: [moveItemModal.item],
                            total: moveItemModal.item.price * moveItemModal.item.quantity,
                            status: orderToUpdate.status,
                            timestamp: new Date().toISOString(),
                          }
                          
                          const updatedOrders = orders
                            .map(o => o.id === moveItemModal.orderId 
                              ? (updatedItems.length === 0 ? null : { ...o, items: updatedItems, total: newTotal })
                              : o
                            )
                            .filter(Boolean)
                          
                          storage.set('orders', [...updatedOrders, newOrder], true)
                          loadOrders()
                          setMoveItemModal(null)
                        }
                      }
                    }}
                    className="bg-green-100 hover:bg-green-200 text-green-800 p-3 rounded-lg font-semibold transition-colors hover-lift"
                  >
                    Table {tableNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setMoveItemModal(null)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bill View Modal */}
        {showBill && selectedTable && (() => {
          const tableData = getTableData(selectedTable)
          const subtotal = tableData.totalAmount
          const serviceCharge = subtotal * 0.10
          const sst = (subtotal + serviceCharge) * 0.06
          const grandTotal = subtotal + serviceCharge + sst
          const change = amountPaid - grandTotal
          const receiptNo = `R${Date.now().toString().slice(-6)}`
          const now = new Date()
          const dateStr = now.toLocaleDateString('en-MY', { day: '2-digit', month: '2-digit', year: 'numeric' })
          const timeStr = now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: false })
          const allItems = tableData.activeOrders.flatMap(order => order.items)
          
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in print:shadow-none print:rounded-none">
                {/* Bill Content */}
                <div className="p-6 print:p-4">
                  <div className="text-center font-mono text-xs print:text-[10px]">
                    {/* Header */}
                    <div className="mb-2">
                      <div className="text-lg font-bold tracking-wider print:text-base">L A K O P I</div>
                      <div className="text-xs italic print:text-[10px]">"Malaysians Favourite Kopihouse"</div>
                      <div className="text-xs print:text-[10px]">Ara Damansara • Selangor</div>
                    </div>
                    
                    <div className="border-t border-b border-black my-3 py-2">
                      ════════════════════════════════════════════════════════════
                    </div>
                    
                    {/* Date, Time, Bill Number */}
                    <div className="text-left mb-2 space-y-1">
                      <div className="flex justify-between">
                        <span>DATE: {dateStr}</span>
                        <span>TIME: {timeStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BILL: {receiptNo}</span>
                        <span></span>
                      </div>
                      <div>CASHIER: {cashierName}</div>
                    </div>
                    
                    <div className="border-t border-b border-black my-2 py-1">
                      ════════════════════════════════════════════════════════════
                    </div>
                    
                    {/* Items Header */}
                    <div className="text-left mb-1 font-semibold">
                      <div className="flex justify-between">
                        <span className="w-48">ITEM</span>
                        <span className="w-12 text-center">QTY</span>
                        <span className="w-20 text-right">TOTAL (RM)</span>
                      </div>
                    </div>
                    
                    <div className="border-b border-dashed border-gray-400 mb-2 pb-1">
                      ────────────────────────────────────────────────────────────
                    </div>
                    
                    {/* Items List */}
                    <div className="text-left mb-2 space-y-1 min-h-[100px]">
                      {allItems.map((item, idx) => {
                        const itemName = item.name.length > 30 ? item.name.substring(0, 27) + '...' : item.name
                        const itemTotal = (item.price * item.quantity).toFixed(2)
                        return (
                          <div key={idx} className="flex justify-between">
                            <span className="w-48 truncate">{itemName}</span>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <span className="w-20 text-right">{itemTotal}</span>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="border-b border-dashed border-gray-400 mb-2 pb-1">
                      ────────────────────────────────────────────────────────────
                    </div>
                    
                    {/* Totals */}
                    <div className="text-left space-y-1 mb-2">
                      <div className="flex justify-between">
                        <span>SUBTOTAL</span>
                        <span className="font-semibold">{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SERVICE CHARGE (10%)</span>
                        <span className="font-semibold">{serviceCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SST (6%)</span>
                        <span className="font-semibold">{sst.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-black my-2 py-1">
                      ════════════════════════════════════════════════════════════
                    </div>
                    
                    {/* Grand Total */}
                    <div className="text-left mb-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>GRAND TOTAL</span>
                        <span>RM {grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-black my-2 py-1">
                      ════════════════════════════════════════════════════════════
                    </div>
                    
                    {/* Payment Info */}
                    <div className="text-left space-y-1 mb-2">
                      <div className="flex justify-between">
                        <span>PAYMENT METHOD:</span>
                        <span className="font-semibold">{paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AMOUNT PAID:</span>
                        <span className="font-semibold">RM {amountPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BALANCE:</span>
                        <span className={`font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          RM {change >= 0 ? change.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-black my-2 py-1">
                      ════════════════════════════════════════════════════════════
                    </div>
                    
                    {/* Footer */}
                    <div className="text-center space-y-1 mt-2">
                      <div className="font-semibold">THANK YOU FOR DINING WITH US AT LAKOPI! 😊</div>
                      <div className="text-xs">Powered by DewX IT Solutions</div>
                      <div className="text-xs">Email: dewmika.my@gmail.com</div>
                    </div>
                    
                    <div className="border-t border-b border-black my-2 py-1">
                      ════════════════════════════════════════════════════════════
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons (Hidden when printing) */}
                <div className="p-6 pt-0 print:hidden space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-green-800 mb-1">Cashier Name</label>
                      <input
                        type="text"
                        value={cashierName}
                        onChange={(e) => setCashierName(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-green-200 rounded-lg text-sm focus:border-green-500 focus:outline-none"
                        placeholder="Cashier name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-800 mb-1">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-green-200 rounded-lg text-sm focus:border-green-500 focus:outline-none"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="QR">QR</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-green-800 mb-1">Amount Paid (RM)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-green-200 rounded-lg text-sm focus:border-green-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.print()
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Print Bill
                    </button>
                    <button
                      onClick={() => {
                        setShowBill(false)
                        setAmountPaid(0)
                        setPaymentMethod('Cash')
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

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
    </div>
  )
}

export default Dashboard

