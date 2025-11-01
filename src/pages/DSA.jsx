import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cpu, 
  Menu, 
  X,
  Shuffle,
  Search as SearchIcon,
  GitBranch,
  Binary,
  BarChart,
  Database,
  Lock
} from 'lucide-react'

const DSA = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Check if we're on a visualization page
  const isVisualizationPage = location.pathname.includes('/dsa/visualization/')

  // Toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Icons for categories (same as in Sidebar component)
  const categoryIcons = {
    sorting: Shuffle,
    searching: SearchIcon,
    graph: GitBranch,
    tree: Binary,
    dynamic: BarChart,
    greedy: Database,
    backtracking: Lock
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Collapsed sidebar - shows icons only */}
      {sidebarCollapsed && (
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          exit={{ width: 0 }}
          className="hidden md:flex flex-col bg-white border-r border-gray-200 z-10"
        >
          <div className="p-3 border-b border-gray-200 flex justify-center">
            <button 
              onClick={toggleSidebarCollapse}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {Object.entries(categoryIcons).map(([id, Icon]) => (
              <div key={id} className="flex justify-center p-3">
                <Icon 
                  size={20} 
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={() => {
                    setSidebarCollapsed(false)
                    setTimeout(() => setSidebarOpen(true), 100)
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full sidebar */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <>
            {/* Desktop sidebar */}
            <motion.div 
              data-testid="sidebar" 
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              className="hidden md:flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Algorithms</h2>
                <button 
                  onClick={toggleSidebarCollapse}
                  className="p-1 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Sidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          className="md:hidden fixed inset-y-0 left-0 z-50 w-80 pt-16"
        >
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col w-80 bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Algorithms</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar />
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            {/* Show hamburger menu on mobile or when sidebar is collapsed */}
            <button
              type="button"
              className="md:hidden mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Data Structures & Algorithms</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {/* Show default message when no algorithm is selected */}
          {location.pathname === '/dsa' || location.pathname === '/dsa/' ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-md">
                <Cpu size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Algorithm Visualizer</h2>
                <p className="text-gray-600 mb-6">
                  Select an algorithm from the sidebar to visualize how it works step by step.
                </p>
                <button
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen(true)
                    } else {
                      setSidebarCollapsed(false)
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Algorithms
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DSA