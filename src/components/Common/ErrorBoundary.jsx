import { Component } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, RotateCw, AlertTriangle } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={48} className="text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Something went wrong
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mb-8"
            >
              We're sorry, but something unexpected happened. This could be due to a network issue, 
              a missing file, or a temporary problem with our service.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left"
            >
              <h3 className="font-medium text-gray-900 mb-2">Error Details:</h3>
              <p className="text-sm text-gray-600 mb-4">
                {this.state.error && this.state.error.toString()}
              </p>
              <button
                onClick={this.handleRetry}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Try again
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Home size={18} className="mr-2" />
                Go to Homepage
              </Link>
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                <RotateCw size={18} className="mr-2" />
                Retry
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-sm text-gray-500"
            >
              <p>If the problem persists, please <Link to="/support" className="text-blue-600 hover:underline">contact support</Link>.</p>
            </motion.div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary