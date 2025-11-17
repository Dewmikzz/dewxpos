import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import TableView from './components/TableView'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { initializeOrders, initializeMenu } from './utils/storage'

function App() {
  useEffect(() => {
    initializeOrders()
    initializeMenu()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/table/:tableNumber" element={<TableView />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<TableView />} />
      </Routes>
    </Router>
  )
}

export default App

