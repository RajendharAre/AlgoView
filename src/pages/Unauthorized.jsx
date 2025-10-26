import { motion } from 'framer-motion'
import { ShieldAlert, Home, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="text-red-600" size={40} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-8">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            
            <div className="space-y-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home size={18} />
                Go to Homepage
              </Link>
              
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogIn size={18} />
                Login to Account
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you continue to experience issues, please contact support.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Unauthorized