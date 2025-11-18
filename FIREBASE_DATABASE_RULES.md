# 🔒 Firebase Database Rules

## Current Rules (Development Mode)

Go to Firebase Console → Realtime Database → Rules tab and paste this:

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
    },
    "settings": {
      ".read": true,
      ".write": false
    }
  }
}
```

**Click "Publish" to save!**

---

## What These Rules Do

- ✅ **orders** - Anyone can read and write orders (good for POS system)
- ✅ **menuItems** - Anyone can read and write menu items
- ✅ **settings** - Anyone can read, but only server can write

---

## For Production (Later)

When ready, add authentication:
1. Enable Firebase Authentication
2. Update rules to require authentication
3. Add role-based access (admin, staff, customer)

---

## ✅ Next Steps

1. ✅ .env file created with your Firebase config
2. ⚠️ **IMPORTANT:** Set database rules (see above)
3. ✅ Test locally: `npm run dev`
4. ✅ Check console for: "✅ Firebase initialized successfully"

---

## Test It Now!

```bash
npm run dev
```

Open browser console (F12) - you should see:
```
✅ Firebase initialized successfully
✅ Setting up Firebase real-time listener for orders
```

If you see errors, check:
- Database rules are published
- Database is enabled in Firebase Console
- .env file has correct values

