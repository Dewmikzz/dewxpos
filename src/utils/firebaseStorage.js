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
          // Sync to localStorage as backup
          const storageKey = `lakopi_shared_${key}`
          localStorage.setItem(storageKey, JSON.stringify(data))
          return data
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
        firebaseDB.off(STORAGE_PATHS.orders)
      }
      
      // Set up new listener
      listeners.orders = firebaseDB.onValue(STORAGE_PATHS.orders, (data) => {
        if (data !== null) {
          // Sync to localStorage
          const storageKey = 'lakopi_shared_orders'
          localStorage.setItem(storageKey, JSON.stringify(data))
          
          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('storageUpdate', {
            detail: { key: storageKey, value: data }
          }))
          
          // Call callback
          callback(data)
        } else {
          callback([])
        }
      })
      
      return listeners.orders // Return unsubscribe function
    }
    
    // Firebase not available - return no-op function
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

