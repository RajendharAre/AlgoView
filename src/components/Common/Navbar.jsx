import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Home, 
  BookOpen, 
  Code,
  LogIn,
  ChevronDown,
  Lightbulb,
  Info
} from 'lucide-react'
import { signOut } from '../../store/slices/userSlice'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [dsaDropdownOpen, setDsaDropdownOpen] = useState(false)
  const { currentUser, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const dsaDropdownRef = useRef(null)
  
  // Close DSA dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dsaDropdownRef.current && !dsaDropdownRef.current.contains(event.target)) {
        setDsaDropdownOpen(false);
      }
    };
    
    // Add event listener when dropdown is open
    if (dsaDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dsaDropdownOpen]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap()
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setUserDropdownOpen(false)
    }
  }

  // Handle DSA dropdown state based on navigation
  useEffect(() => {
    const isDSARoute = location.pathname.startsWith('/dsa');
    
    // If we're navigating away from DSA section, close the dropdown
    if (!isDSARoute && dsaDropdownOpen) {
      setDsaDropdownOpen(false);
    }
    // When on the main DSA page, ensure dropdown stays open
    else if (location.pathname === '/dsa') {
      setDsaDropdownOpen(true);
    }
    // When on DSA sub-pages, don't interfere with user's choice
  }, [location.pathname])

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { 
      name: 'DSA', 
      path: '/dsa', 
      icon: BookOpen,
      dropdown: [
        { name: 'Algorithms', path: '/dsa/algorithms' },
        { name: 'Problems', path: '/dsa/problems' },
        { name: 'Practice', path: '/dsa/practice' },
        { name: 'Discussions', path: '/dsa/discussions' },
      ]
    },
    { name: 'Development', path: '/development', icon: Code },
    { name: 'Ideas', path: '/ideas', icon: Lightbulb },
    { name: 'About', path: '/about', icon: Info },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Algorithm Visualizer Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">Algorithm Visualizer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <div ref={dsaDropdownRef} className="relative">
                      <Link
                        to={item.path}
                        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setDsaDropdownOpen(!dsaDropdownOpen);
                        }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{item.name}</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Link>
                                        
                      {dsaDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setDsaDropdownOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{currentUser.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-4 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div ref={dsaDropdownRef} className="space-y-1">
                        <Link
                          to={item.path}
                          className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                          onClick={(e) => {
                            e.preventDefault();
                            setDsaDropdownOpen(!dsaDropdownOpen);
                          }}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                          <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${dsaDropdownOpen ? 'rotate-180' : ''}`} />
                        </Link>
                                            
                        {dsaDropdownOpen && (
                          <div className="pl-6 space-y-1">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setDsaDropdownOpen(false)
                                }}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar