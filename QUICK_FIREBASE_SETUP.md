# 🔥 Quick Firebase Setup (5 Minutes)

## Step 1: Go to Firebase Console
👉 **Open:** https://console.firebase.google.com/
- Sign in with Google account

---

## Step 2: Create Project

1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `lakopi-pos` (or your choice)
3. Click **"Continue"**
4. (Optional) Disable Google Analytics or skip
5. Click **"Create project"**
6. Wait ~30 seconds
7. Click **"Continue"**

---

## Step 3: Enable Database

1. In left sidebar, click **"Realtime Database"**
2. Click **"Create Database"** button
3. Choose location: **`asia-southeast1`** (Singapore) or closest to you
4. Click **"Next"**
5. Select **"Start in test mode"**
6. Click **"Enable"**

✅ **Database created!**

---

## Step 4: Get Your Config

1. Click **⚙️ Gear icon** next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **Web icon** `</>` or **"+ Add app"** → Web
5. App nickname: `Lakopi POS Web`
6. Click **"Register app"**

You'll see this code:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**📋 Copy these values - you'll need them!**

---

## Step 5: Create .env File

1. In your project folder (where `package.json` is), create a file named: `.env`

2. Paste this template and fill in your values:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Replace the values:**
- `VITE_FIREBASE_API_KEY` = `apiKey` from Firebase
- `VITE_FIREBASE_AUTH_DOMAIN` = `authDomain` from Firebase
- `VITE_FIREBASE_DATABASE_URL` = `databaseURL` from Firebase
- `VITE_FIREBASE_PROJECT_ID` = `projectId` from Firebase
- `VITE_FIREBASE_STORAGE_BUCKET` = `storageBucket` from Firebase
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = `messagingSenderId` from Firebase
- `VITE_FIREBASE_APP_ID` = `appId` from Firebase

---

## Step 6: Set Database Rules

1. In Firebase Console → **"Realtime Database"**
2. Click **"Rules"** tab
3. Replace with this:

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

4. Click **"Publish"**

---

## Step 7: Test It

```bash
npm install
npm run dev
```

**Open browser console (F12)** - You should see:
```
✅ Firebase initialized successfully
✅ Setting up Firebase real-time listener for orders
```

If you see:
```
⚠️ Firebase not configured
```
→ Check your `.env` file and restart server

---

## ✅ Done!

Now test:
1. Open **Device A**: `http://localhost:5173/table/1` - Place an order
2. Open **Device B**: `http://localhost:5173/dashboard` - Order appears instantly! 🎉

---

## 🚀 For Production (Vercel/Netlify)

### Vercel:
1. Project → **Settings** → **Environment Variables**
2. Add all `VITE_FIREBASE_*` variables from `.env`
3. **Redeploy**

### Netlify:
1. Site → **Site settings** → **Environment variables**
2. Add all `VITE_FIREBASE_*` variables from `.env`
3. **Redeploy**

---

## 🆘 Need Help?

**Problem:** "Firebase not initialized"
- ✅ Check `.env` file exists
- ✅ Check all 7 variables are filled
- ✅ Restart server: `npm run dev`

**Problem:** "Permission denied"
- ✅ Check Database Rules (Step 6)
- ✅ Make sure rules are published

**Problem:** Orders not syncing
- ✅ Check browser console for errors
- ✅ Verify `.env` variables match Firebase config

---

## 📝 Summary

1. ✅ Create Firebase project
2. ✅ Enable Realtime Database
3. ✅ Copy Firebase config
4. ✅ Create `.env` file with config
5. ✅ Set database rules
6. ✅ Test locally
7. ✅ Deploy with env variables

**That's it!** Your POS will sync across all devices! 🎊

