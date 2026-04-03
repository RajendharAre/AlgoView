import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Common/Navbar'
import Footer from './Common/Footer'
import NotificationBanner from './Common/NotificationBanner'
import { PageTracker } from './Analytics/PageTracker'
import SchemaMarkup from './Common/SchemaMarkup'

const MainApp = () => {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Analytics & SEO */}
      <PageTracker />
      <SchemaMarkup />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Notification Banner for Important Alerts */}
      <NotificationBanner />
      
      {/* Main Content with Page Transitions */}
      <main className="flex-1 pt-16">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MainApp