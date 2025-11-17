import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, AlertCircle } from 'lucide-react'
import { auth } from '../utils/auth'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (auth.login(username, password)) {
        navigate('/dashboard')
      } else {
        setError('Invalid username or password')
        setLoading(false)
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-coffee-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-coffee-800 mb-2">Admin Login</h1>
          <p className="text-coffee-600">Lakopi Restaurant Dashboard</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-coffee-800 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-coffee-200 rounded-lg focus:border-coffee-500 focus:outline-none text-coffee-800"
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-coffee-800 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-coffee-200 rounded-lg focus:border-coffee-500 focus:outline-none text-coffee-800"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-coffee-400 cursor-not-allowed'
                : 'bg-coffee-600 hover:bg-coffee-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-coffee-200">
          <p className="text-xs text-center text-coffee-500">
            Default credentials: admin / admin123
          </p>
          <p className="text-xs text-center text-coffee-400 mt-2">
            Change password in src/utils/auth.js
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

