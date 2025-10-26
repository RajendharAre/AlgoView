import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Layout/Navbar'

const MainApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default MainApp