# Firebase Setup Guide for Cross-Device Sync

## 🔥 Quick Setup (5 minutes)

Follow these steps to enable cross-device order synchronization:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "lakopi-pos")
4. Click "Continue"
5. (Optional) Enable Google Analytics or skip
6. Click "Create project"

### Step 2: Enable Realtime Database

1. In your Firebase project, click "Realtime Database" in the left menu
2. Click "Create Database"
3. Choose location (closest to your users)
4. Choose "Start in test mode" (we'll secure it later)
5. Click "Enable"

### Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register app name (e.g., "Lakopi POS")
6. Copy the `firebaseConfig` object

### Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. Replace all values with your actual Firebase config values

### Step 5: Secure Your Database (IMPORTANT)

1. Go to "Realtime Database" → "Rules" tab
2. Replace the rules with:

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

**Note:** For production, you should add authentication and stricter rules. These rules allow anyone to read/write orders and menu items (suitable for a restaurant POS system).

### Step 6: Install Dependencies & Test

```bash
npm install
npm run dev
```

### Step 7: Deploy with Environment Variables

When deploying to Vercel/Netlify:

**For Vercel:**
1. Go to your project settings
2. Click "Environment Variables"
3. Add all the `VITE_FIREBASE_*` variables
4. Redeploy

**For Netlify:**
1. Go to Site settings
2. Click "Environment variables"
3. Add all the `VITE_FIREBASE_*` variables
4. Redeploy

## ✅ How to Verify It's Working

1. **Check browser console** - Should see "✅ Firebase initialized successfully"
2. **Place an order on Device A**
3. **Check admin dashboard on Device B** - Order should appear instantly
4. **Notification sound should play** on Device B

## 🔄 Fallback Behavior

If Firebase is not configured:
- App will automatically use `localStorage` (single-device mode)
- Console will show: "⚠️ Firebase not configured. Using localStorage only"
- Everything still works, just no cross-device sync

## 📊 Firebase Free Tier Limits

- **Storage:** 1 GB
- **Bandwidth:** 10 GB/month
- **Concurrent connections:** 100

**For a restaurant POS, this is usually sufficient!**

## 🆘 Troubleshooting

**"Firebase not initialized" error:**
- Check your `.env` file has all variables
- Restart dev server after adding `.env`
- Check Firebase console for database URL

**"Permission denied" error:**
- Check database rules in Firebase Console
- Ensure read/write is set to `true` for testing

**Orders not syncing:**
- Check browser console for errors
- Verify Firebase credentials are correct
- Check network tab for Firebase requests

## 🎉 Once Set Up

- ✅ Orders sync across ALL devices instantly
- ✅ Notification sounds work on all devices
- ✅ Menu changes sync across devices
- ✅ Works in production (main branch)

## 📝 Next Steps (Optional)

For better security in production:
1. Enable Firebase Authentication
2. Add user roles (admin, staff, customer)
3. Restrict write access to authenticated users
4. Implement order history and analytics

