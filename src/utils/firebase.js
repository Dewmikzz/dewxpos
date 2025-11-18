// Firebase configuration and initialization
// This file handles Firebase Realtime Database setup for cross-device synchronization

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue, off, push, remove } from 'firebase/database'

// Firebase configuration
// Replace these with your Firebase project credentials
// Get them from: https://console.firebase.google.com -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
}

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.databaseURL && 
         firebaseConfig.projectId
}

let app = null
let database = null

// Initialize Firebase only if configured
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig)
    database = getDatabase(app)
    console.log('✅ Firebase initialized successfully')
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
    console.warn('⚠️ Falling back to localStorage for data storage')
  }
} else {
  console.warn('⚠️ Firebase not configured. Using localStorage only (no cross-device sync).')
  console.log('📝 To enable cross-device sync, configure Firebase in .env file')
}

// Firebase database utility functions
export const firebaseDB = {
  // Check if Firebase is available
  isAvailable: () => {
    return database !== null && isFirebaseConfigured()
  },

  // Set data at a path
  set: async (path, value) => {
    if (!database) {
      throw new Error('Firebase not initialized')
    }
    try {
      const dbRef = ref(database, path)
      await set(dbRef, value)
      console.log('✅ Firebase: Data written to', path)
      return true
    } catch (error) {
      console.error('❌ Firebase: Error writing data:', error)
      throw error
    }
  },

  // Get data from a path
  get: async (path) => {
    if (!database) {
      throw new Error('Firebase not initialized')
    }
    try {
      const dbRef = ref(database, path)
      const snapshot = await get(dbRef)
      if (snapshot.exists()) {
        console.log('✅ Firebase: Data read from', path)
        return snapshot.val()
      }
      return null
    } catch (error) {
      console.error('❌ Firebase: Error reading data:', error)
      throw error
    }
  },

  // Push data to a list (auto-generates key)
  push: async (path, value) => {
    if (!database) {
      throw new Error('Firebase not initialized')
    }
    try {
      const dbRef = ref(database, path)
      const newRef = push(dbRef)
      await set(newRef, value)
      console.log('✅ Firebase: Data pushed to', path, 'Key:', newRef.key)
      return newRef.key
    } catch (error) {
      console.error('❌ Firebase: Error pushing data:', error)
      throw error
    }
  },

  // Remove data at a path
  remove: async (path) => {
    if (!database) {
      throw new Error('Firebase not initialized')
    }
    try {
      const dbRef = ref(database, path)
      await remove(dbRef)
      console.log('✅ Firebase: Data removed from', path)
      return true
    } catch (error) {
      console.error('❌ Firebase: Error removing data:', error)
      throw error
    }
  },

  // Listen to real-time changes
  onValue: (path, callback) => {
    if (!database) {
      throw new Error('Firebase not initialized')
    }
    try {
      const dbRef = ref(database, path)
      console.log('👂 Firebase: Setting up listener for', path)
      console.log('📡 Firebase: Database URL:', database.app.options.databaseURL)
      console.log('📡 Firebase: Database connected:', database._databaseId?.database)
      
      // Set up listener - this fires immediately with current data AND on every change
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const timestamp = new Date().toISOString()
        console.log(`📡 [${timestamp}] Firebase listener fired for ${path}`)
        
        if (snapshot.exists()) {
          const data = snapshot.val()
          console.log('✅ Firebase: Data received at', path, '- Type:', Array.isArray(data) ? 'array' : typeof data)
          console.log('📦 Firebase: Data snapshot:', JSON.stringify(data).substring(0, 200) + '...')
          
          // Check data size
          if (Array.isArray(data)) {
            console.log('📊 Firebase: Array with', data.length, 'items')
          } else if (typeof data === 'object' && data !== null) {
            const keys = Object.keys(data)
            console.log('📊 Firebase: Object with', keys.length, 'keys:', keys.slice(0, 5))
          }
          
          callback(data)
        } else {
          console.log('⚠️ Firebase: No data at', path, '(path does not exist yet)')
          callback(null)
        }
      }, (error) => {
        console.error('❌ Firebase: Error in listener for', path, ':', error)
        console.error('❌ Error code:', error.code)
        console.error('❌ Error message:', error.message)
        console.error('❌ Full error:', error)
        
        // Try to reconnect or handle error
        if (error.code === 'PERMISSION_DENIED') {
          console.error('🔒 PERMISSION_DENIED: Check database rules!')
        } else if (error.code === 'UNAVAILABLE') {
          console.error('🌐 UNAVAILABLE: Check internet connection!')
        }
      })
      
      console.log('✅ Firebase: Listener successfully attached to', path)
      
      // Return unsubscribe function
      return () => {
        console.log('🔇 Firebase: Unsubscribing from', path)
        unsubscribe()
        off(dbRef)
      }
    } catch (error) {
      console.error('❌ Firebase: Error setting up listener:', error)
      console.error('❌ Error details:', error.message, error.stack)
      throw error
    }
  },

  // Stop listening to a path
  off: (path) => {
    if (!database) {
      return
    }
    try {
      const dbRef = ref(database, path)
      off(dbRef)
      console.log('🔇 Firebase: Removed listener from', path)
    } catch (error) {
      console.error('❌ Firebase: Error removing listener:', error)
    }
  }
}

export default firebaseDB

