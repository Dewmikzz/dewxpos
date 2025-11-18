// Firebase-enabled storage utility
// Uses Firebase Realtime Database for cross-device sync
// Falls back to localStorage if Firebase is not configured

import { firebaseDB } from './firebase'
import { storage } from './storage'

// Storage paths in Firebase
const STORAGE_PATHS = {
  orders: 'orders',
  menuItems: 'menuItems',
  settings: 'settings'
}

// Callbacks for real-time listeners
const listeners = {
  orders: null,
  menuItems: null,
  settings: null
}

export const firebaseStorage = {
  // Get data (tries Firebase first, falls back to localStorage)
  get: async (key, shared = false) => {
    if (firebaseDB.isAvailable() && shared) {
      try {
        const path = STORAGE_PATHS[key] || key
        const data = await firebaseDB.get(path)
        if (data !== null) {
          // Firebase sometimes stores arrays as objects with numeric keys
          // Convert object with numeric keys back to array if needed
          let processedData = data
          if (!Array.isArray(data) && typeof data === 'object') {
            // Check if it's an object with numeric keys (Firebase array format)
            const keys = Object.keys(data)
            const allNumericKeys = keys.every(key => /^\d+$/.test(key))
            
            if (allNumericKeys) {
              // Convert object with numeric keys to array
              processedData = keys.map(key => data[key]).filter(item => item !== null && item !== undefined)
              console.log('✅ Converted Firebase object to array for', key, ':', processedData.length, 'items')
            }
          }
          
          // Sync to localStorage as backup
          const storageKey = `lakopi_shared_${key}`
          localStorage.setItem(storageKey, JSON.stringify(processedData))
          return processedData
        }
      } catch (error) {
        console.error(`Error getting ${key} from Firebase:`, error)
        // Fall back to localStorage
      }
    }
    
    // Fallback to localStorage
    return storage.get(key, shared)
  },

  // Set data (writes to Firebase and localStorage)
  set: async (key, value, shared = false) => {
    if (firebaseDB.isAvailable() && shared) {
      try {
        const path = STORAGE_PATHS[key] || key
        await firebaseDB.set(path, value)
        
        // Also update localStorage as backup
        const storageKey = `lakopi_shared_${key}`
        localStorage.setItem(storageKey, JSON.stringify(value))
        
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new CustomEvent('storageUpdate', {
          detail: { key: storageKey, value }
        }))
        
        return true
      } catch (error) {
        console.error(`Error setting ${key} to Firebase:`, error)
        // Fall back to localStorage
      }
    }
    
    // Fallback to localStorage
    return storage.set(key, value, shared)
  },

  // Remove data
  remove: async (key, shared = false) => {
    if (firebaseDB.isAvailable() && shared) {
      try {
        const path = STORAGE_PATHS[key] || key
        await firebaseDB.remove(path)
        
        // Also remove from localStorage
        const storageKey = `lakopi_shared_${key}`
        localStorage.removeItem(storageKey)
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('storageUpdate', {
          detail: { key: storageKey, value: null }
        }))
        
        return true
      } catch (error) {
        console.error(`Error removing ${key} from Firebase:`, error)
        // Fall back to localStorage
      }
    }
    
    // Fallback to localStorage
    return storage.remove(key, shared)
  },

  // Push data to a list (for orders)
  pushOrder: async (order) => {
    if (firebaseDB.isAvailable()) {
      try {
        // Get existing orders
        const existingOrders = await firebaseDB.get(STORAGE_PATHS.orders) || []
        
        // Add new order
        const updatedOrders = [...existingOrders, order]
        
        // Save to Firebase
        await firebaseDB.set(STORAGE_PATHS.orders, updatedOrders)
        
        // Also update localStorage
        const storageKey = 'lakopi_shared_orders'
        localStorage.setItem(storageKey, JSON.stringify(updatedOrders))
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('storageUpdate', {
          detail: { key: storageKey, value: updatedOrders }
        }))
        
        return true
      } catch (error) {
        console.error('Error pushing order to Firebase:', error)
        // Fall back to localStorage
        const existingOrders = storage.get('orders', true) || []
        const updatedOrders = [...existingOrders, order]
        return storage.set('orders', updatedOrders, true)
      }
    }
    
    // Fallback to localStorage
    const existingOrders = storage.get('orders', true) || []
    const updatedOrders = [...existingOrders, order]
    return storage.set('orders', updatedOrders, true)
  },

  // Listen to real-time changes (Firebase only)
  onOrdersChange: (callback) => {
    if (firebaseDB.isAvailable()) {
      // Remove existing listener if any
      if (listeners.orders) {
        console.log('🔇 Removing existing orders listener')
        firebaseDB.off(STORAGE_PATHS.orders)
      }
      
      // Set up new listener
      console.log('👂 Setting up Firebase listener for orders at path:', STORAGE_PATHS.orders)
      listeners.orders = firebaseDB.onValue(STORAGE_PATHS.orders, (data) => {
        console.log('📡 Firebase listener triggered! Data received:', data)
        
        if (data !== null) {
          // Firebase sometimes stores arrays as objects with numeric keys
          // Convert object with numeric keys back to array if needed
          let ordersArray = data
          if (!Array.isArray(data) && typeof data === 'object') {
            console.log('⚠️ Firebase returned object instead of array, converting...', data)
            // Check if it's an object with numeric keys (Firebase array format)
            const keys = Object.keys(data)
            const allNumericKeys = keys.every(key => /^\d+$/.test(key))
            
            if (allNumericKeys) {
              // Convert object with numeric keys to array
              ordersArray = keys.map(key => data[key]).filter(item => item !== null && item !== undefined)
              console.log('✅ Converted Firebase object to array:', ordersArray.length, 'orders')
            } else {
              // It's a regular object, wrap it in an array
              ordersArray = [data]
              console.log('⚠️ Single object detected, wrapped in array')
            }
          }
          
          // Ensure it's an array
          if (!Array.isArray(ordersArray)) {
            console.warn('⚠️ Data is not an array, defaulting to empty array. Data:', ordersArray)
            ordersArray = []
          }
          
          console.log('📦 Processing', ordersArray.length, 'orders from Firebase')
          
          // Sync to localStorage
          const storageKey = 'lakopi_shared_orders'
          localStorage.setItem(storageKey, JSON.stringify(ordersArray))
          
          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('storageUpdate', {
            detail: { key: storageKey, value: ordersArray }
          }))
          
          // Call callback with array
          callback(ordersArray)
        } else {
          console.log('📡 Firebase: No orders data (null), returning empty array')
          callback([])
        }
      })
      
      console.log('✅ Firebase listener set up successfully')
      return listeners.orders // Return unsubscribe function
    }
    
    // Firebase not available - return no-op function
    console.warn('⚠️ Firebase not available - cannot set up real-time listener')
    return () => {}
  },

  // Listen to menu changes
  onMenuChange: (callback) => {
    if (firebaseDB.isAvailable()) {
      if (listeners.menuItems) {
        firebaseDB.off(STORAGE_PATHS.menuItems)
      }
      
      listeners.menuItems = firebaseDB.onValue(STORAGE_PATHS.menuItems, (data) => {
        if (data !== null) {
          const storageKey = 'lakopi_shared_menuItems'
          localStorage.setItem(storageKey, JSON.stringify(data))
          
          window.dispatchEvent(new CustomEvent('menuUpdate'))
          callback(data)
        } else {
          callback([])
        }
      })
      
      return listeners.menuItems
    }
    
    return () => {}
  },

  // Cleanup all listeners
  cleanup: () => {
    if (firebaseDB.isAvailable()) {
      if (listeners.orders) {
        firebaseDB.off(STORAGE_PATHS.orders)
        listeners.orders = null
      }
      if (listeners.menuItems) {
        firebaseDB.off(STORAGE_PATHS.menuItems)
        listeners.menuItems = null
      }
      if (listeners.settings) {
        firebaseDB.off(STORAGE_PATHS.settings)
        listeners.settings = null
      }
    }
  },

  // Check if Firebase is available
  isFirebaseAvailable: () => {
    return firebaseDB.isAvailable()
  }
}

export default firebaseStorage

