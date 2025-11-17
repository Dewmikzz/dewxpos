// Authentication utility for admin login

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123' // Change this to your desired password

export const auth = {
  // Check if user is logged in
  isAuthenticated: () => {
    const authData = localStorage.getItem('lakopi_admin_auth')
    if (!authData) return false
    
    try {
      const { token, expiresAt } = JSON.parse(authData)
      // Check if token is still valid (24 hours)
      if (new Date().getTime() > expiresAt) {
        localStorage.removeItem('lakopi_admin_auth')
        return false
      }
      return !!token
    } catch (error) {
      return false
    }
  },

  // Login function
  login: (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
      const authData = {
        token: 'admin_token_' + Date.now(),
        expiresAt: expiresAt
      }
      localStorage.setItem('lakopi_admin_auth', JSON.stringify(authData))
      return true
    }
    return false
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('lakopi_admin_auth')
  },

  // Get current token
  getToken: () => {
    const authData = localStorage.getItem('lakopi_admin_auth')
    if (!authData) return null
    
    try {
      const { token, expiresAt } = JSON.parse(authData)
      if (new Date().getTime() > expiresAt) {
        localStorage.removeItem('lakopi_admin_auth')
        return null
      }
      return token
    } catch (error) {
      return null
    }
  }
}

