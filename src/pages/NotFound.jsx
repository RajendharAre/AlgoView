import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 mb-8"
        >
          Sorry, we couldn't find the page you're looking for. It might have been removed, 
          had its name changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
        >
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home size={18} className="mr-2" />
            Go to Homepage
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            <Search size={18} className="mr-2" />
            Browse Algorithms
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500"
        >
          <p>Need help? <Link to="/support" className="text-blue-600 hover:underline">Contact support</Link></p>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound