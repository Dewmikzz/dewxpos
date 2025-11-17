import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import TableView from './components/TableView'
import Dashboard from './components/Dashboard'
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<TableView />} />
      </Routes>
    </Router>
  )
}

export default App

