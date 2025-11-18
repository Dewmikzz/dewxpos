# 🔍 Firebase Debug Guide

## Quick Check: Is Firebase Working?

### On Device A (Placing Orders)

1. Open browser console (F12)
2. Place an order
3. Look for these messages:

```
📝 Placing order: [order-id]
🌐 Firebase available? true
✅ Using Firebase for cross-device sync
✅ Order saved to Firebase - will sync to all devices
```

**If you see:**
- `⚠️ Firebase not available` → Firebase not initialized (check `.env` file)
- `❌ Error placing order` → Check console for error details

---

### On Device B (Dashboard - Your Laptop)

1. Open browser console (F12)
2. Look for these messages when page loads:

```
✅ Firebase initialized successfully
✅ Setting up Firebase real-time listener for orders
👂 Setting up Firebase listener for orders at path: orders
✅ Firebase listener set up successfully
```

3. When an order is placed on Device A, you should see:

```
📡 Firebase listener triggered! Data received: [data]
📡 Firebase: Orders updated in real-time: X orders
📦 Processing X orders from Firebase
🎉 NEW ORDERS DETECTED: 1
🔔 Triggering notification sound
```

**If you DON'T see "Firebase listener triggered" when order is placed:**
→ Firebase listener isn't working (see troubleshooting below)

---

## Common Issues & Fixes

### Issue 1: Firebase Not Initialized on One Device

**Symptoms:**
- Console shows: `⚠️ Firebase not configured`
- Orders use localStorage instead

**Fix:**
1. Make sure `.env` file exists on that device
2. Check `.env` has all 7 variables:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_DATABASE_URL=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. Restart dev server: `npm run dev`

---

### Issue 2: Orders Saved But Not Received

**Symptoms:**
- Device A shows: `✅ Order saved to Firebase`
- Device B doesn't show: `📡 Firebase listener triggered`

**Possible Causes:**

#### A. Listener Not Set Up
**Check:**
- Dashboard console should show: `✅ Setting up Firebase real-time listener`
- If not, Firebase isn't available on dashboard

#### B. Database Rules Blocking
**Check:**
1. Go to: https://console.firebase.google.com/project/lakopi-pos/database/lakopi-pos-default-rtdb/rules
2. Rules should allow read/write:
   ```json
   {
     "rules": {
       "orders": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```
3. Click "Publish"

#### C. Firebase Connection Error
**Check:**
- Look for red errors in console
- Common errors:
  - `Permission denied` → Check database rules
  - `Network error` → Check internet connection
  - `Firebase not initialized` → Check `.env` file

---

### Issue 3: Orders Stored as Object Instead of Array

**Symptoms:**
- Console shows: `⚠️ Firebase returned object instead of array`

**What's happening:**
- Firebase Realtime Database converts arrays to objects with numeric keys
- Example: `[{order1}, {order2}]` becomes `{0: {order1}, 1: {order2}}`

**Fix:**
- ✅ Already fixed in code! The code now automatically converts objects back to arrays
- Check console for: `✅ Converted Firebase object to array: X orders`

---

### Issue 4: Listener Not Triggering

**Test manually:**

1. **Check Firebase Console:**
   - Go to: https://console.firebase.google.com/project/lakopi-pos/database/lakopi-pos-default-rtdb/data
   - Check if `orders` path exists
   - Check if orders are being saved there

2. **Manually add order in Firebase Console:**
   - Click `+` next to root
   - Key: `orders`
   - Value: 
     ```json
     [
       {
         "id": "test123",
         "tableNumber": 1,
         "status": "Pending",
         "items": [],
         "total": 10,
         "timestamp": "2024-01-01T00:00:00.000Z"
       }
     ]
     ```
   - Click "Save"

3. **Check Dashboard:**
   - Should immediately show: `📡 Firebase listener triggered!`
   - Order should appear instantly

**If it doesn't appear:**
→ Firebase listener isn't working (check console for errors)

**If it appears:**
→ Firebase works, but orders aren't being saved from TableView (check Device A console)

---

## Step-by-Step Debug

### Step 1: Verify Firebase on Both Devices

**On both devices, check console for:**
```
✅ Firebase initialized successfully
```

If missing → Fix `.env` file

---

### Step 2: Verify Listener Setup

**On dashboard (Device B), check console for:**
```
✅ Setting up Firebase real-time listener for orders
👂 Setting up Firebase listener for orders at path: orders
✅ Firebase listener set up successfully
```

If missing → Firebase not available

---

### Step 3: Test Order Placement

**On Device A:**
1. Place an order
2. Check console for: `✅ Order saved to Firebase`

**On Device B:**
1. Check console for: `📡 Firebase listener triggered!`
2. Order should appear

---

### Step 4: Check Firebase Console

1. Go to Firebase Database: https://console.firebase.google.com/project/lakopi-pos/database/lakopi-pos-default-rtdb/data
2. Check if `orders` exists
3. Check if orders are being saved

---

## Still Not Working?

**Collect these logs:**

1. **Device A (placing orders) console:**
   - Copy all messages when placing order

2. **Device B (dashboard) console:**
   - Copy all messages when page loads
   - Copy any errors

3. **Firebase Console:**
   - Screenshot of database
   - Screenshot of rules

4. **Check:**
   - Are both devices on same network?
   - Are both devices using same Firebase project?
   - Do both have `.env` files?

---

## Quick Test

**Test Firebase connection:**

In browser console (F12) on dashboard, type:
```javascript
// Check Firebase
console.log('Firebase available:', window.firebaseStorage?.isFirebaseAvailable?.())

// Force reload
loadOrders()
```

---

## Expected Console Flow

### When Dashboard Loads:
```
✅ Firebase initialized successfully
✅ Setting up Firebase real-time listener for orders
👂 Setting up Firebase listener for orders at path: orders
✅ Firebase listener set up successfully
✅ Loaded orders from Firebase: X
```

### When Order Placed on Another Device:
```
📡 Firebase listener triggered! Data received: [...]
📡 Firebase: Orders updated in real-time: X orders
📦 Processing X orders from Firebase
🎉 NEW ORDERS DETECTED: 1
🔔 Triggering notification sound
```

---

## Success Indicators

✅ Firebase initialized on both devices
✅ Listener set up on dashboard
✅ Orders saved to Firebase
✅ Listener triggers when order placed
✅ Orders appear on dashboard
✅ Notification sound plays

If all ✅ → Everything works!

