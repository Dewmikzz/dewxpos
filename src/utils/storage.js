// Storage utility for persistent data
// Uses localStorage with a wrapper to handle shared data

export const storage = {
  // Get data from storage
  get: (key, shared = false) => {
    try {
      const storageKey = shared ? `lakopi_shared_${key}` : `lakopi_${key}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  // Set data in storage
  set: (key, value, shared = false) => {
    try {
      const storageKey = shared ? `lakopi_shared_${key}` : `lakopi_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(value));
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('storageUpdate', { 
        detail: { key: storageKey, value } 
      }));
      return true;
    } catch (error) {
      console.error('Error writing to storage:', error);
      return false;
    }
  },

  // Remove data from storage
  remove: (key, shared = false) => {
    try {
      const storageKey = shared ? `lakopi_shared_${key}` : `lakopi_${key}`;
      localStorage.removeItem(storageKey);
      window.dispatchEvent(new CustomEvent('storageUpdate', { 
        detail: { key: storageKey, value: null } 
      }));
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  },
};

// Initialize orders array if it doesn't exist
export const initializeOrders = () => {
  const existingOrders = storage.get('orders', true);
  if (!existingOrders) {
    storage.set('orders', [], true);
  }
};

// Initialize menu items if they don't exist
export const initializeMenu = () => {
  const existingMenu = storage.get('menuItems', true);
  if (!existingMenu) {
    // Import default menu items
    import('../data/menu.js').then(({ defaultMenuItems }) => {
      storage.set('menuItems', defaultMenuItems, true);
    });
  }
};

