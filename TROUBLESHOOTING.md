# 🔍 Troubleshooting Cross-Device Sync

## Issue: Orders Not Updating Across Devices

### Step 1: Check Firebase Initialization

**On Both Devices (the one placing orders AND the dashboard laptop):**

1. Open browser console (F12)
2. Look for these messages:

**✅ Good:**
```
✅ Firebase initialized successfully
✅ Setting up Firebase real-time listener for orders
👂 Firebase: Listening to orders
```

**❌ Problem:**
```
⚠️ Firebase not configured. Using localStorage only
```
→ This means `.env` file is missing or wrong on one device

---

### Step 2: Check Console Messages When Placing Order

**On Device A (placing order):**

Look for:
```
📝 Placing order: [order-id]
🌐 Firebase available? true
✅ Using Firebase for cross-device sync
✅ Order saved to Firebase - will sync to all devices
```

**On Device B (dashboard):**

Look for:
```
📡 Firebase: Data updated at orders [orders array]
📡 Firebase: Orders updated in real-time: X orders
🎉 NEW ORDERS DETECTED: 1
🔔 Triggering notification sound
```

**If you don't see these messages:**
→ Firebase isn't working properly

---

### Step 3: Check Firebase Database

1. Go to: https://console.firebase.google.com/project/lakopi-pos/database/lakopi-pos-default-rtdb/data
2. Check if `orders` path exists
3. Check if orders are being saved there

**Expected structure:**
```
orders: [
  {
    id: "...",
    tableNumber: 1,
    items: [...],
    status: "Pending",
    ...
  },
  ...
]
```

**If orders are not there:**
→ Orders aren't being saved to Firebase (check Step 2)

---

### Step 4: Check Database Rules

1. Go to: https://console.firebase.google.com/project/lakopi-pos/database/lakopi-pos-default-rtdb/rules
2. Rules should be:

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true
    },
    "menuItems": {
      ".read": true,
      ".write": true
    }
  }
}
```

**If rules are wrong:**
→ Update and click "Publish"

---

### Step 5: Common Issues

#### Issue: "Firebase not initialized" on one device

**Solution:**
- Make sure `.env` file exists on that device
- Restart dev server: `npm run dev`
- Check `.env` has all 7 variables

#### Issue: Orders appear in Firebase Console but not in dashboard

**Possible causes:**
1. Dashboard not listening to Firebase
2. Firebase listener error
3. Orders stored as object instead of array

**Check console for errors:**
- Look for red errors in console
- Check for "Permission denied" errors

#### Issue: Permission denied errors

**Solution:**
1. Check database rules (Step 4)
2. Make sure rules are published
3. Try refreshing dashboard page

#### Issue: Orders sync but no sound

**Solution:**
1. Check if sound is enabled (bell icon in dashboard)
2. User must interact with page first (click/touch)
3. Check browser console for AudioContext errors

---

### Step 6: Manual Test

**Test Firebase connection:**

1. Open Firebase Console → Database
2. Manually add an order:
   - Click `+` next to root
   - Key: `orders`
   - Value: `[{"id":"test123","tableNumber":1,"status":"Pending","items":[],"total":10}]`
   - Click "Save"

3. Check dashboard - order should appear instantly

**If it doesn't appear:**
→ Dashboard isn't listening to Firebase

**If it appears:**
→ Firebase works, but orders aren't being saved from TableView

---

### Step 7: Debug Mode

**Add to browser console on dashboard:**

```javascript
// Check if Firebase is available
console.log('Firebase available:', window.firebaseStorage?.isFirebaseAvailable?.())

// Force reload orders
loadOrders()
```

---

### Quick Fixes

1. **Refresh both pages** (Device A and B)
2. **Restart dev server** on both devices
3. **Check `.env` file** on both devices
4. **Check database rules** are published
5. **Check browser console** for errors

---

## Still Not Working?

**Check these:**

1. ✅ Both devices have `.env` file
2. ✅ Both devices show "Firebase initialized" in console
3. ✅ Firebase Console shows orders being saved
4. ✅ Database rules allow read/write
5. ✅ No errors in browser console
6. ✅ Dashboard shows "Listening to orders" message

**If all above are ✅ but still not working:**
→ Contact support with console logs from both devices

