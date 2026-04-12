import React from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Zap,
  BarChart3,
  Clock,
  Search,
  GitBranch,
  Database,
  Settings,
  Sparkles,
  Heart,
} from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Enhanced Algorithm Card Component
 * Displays algorithm information with difficulty level, complexity, and visual indicators
 */
const AlgorithmCard = ({
  id,
  name,
  category,
  description,
  difficulty = 'Medium',
  timeComplexity = 'O(n²)',
  spaceComplexity = 'O(1)',
  tags = [],
  isNew = false,
  isFavorite = false,
  onFavoriteClick = null,
  actionUrl = '#',
}) => {
  const difficultyConfig = {
    Easy: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      dotColor: 'bg-green-500',
    },
    Medium: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      dotColor: 'bg-yellow-500',
    },
    Hard: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      dotColor: 'bg-red-500',
    },
  }

  const categoryConfig = {
    Sorting: {
      icon: <BarChart3 size={20} />,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    },
    Searching: {
      icon: <Search size={20} />,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    },
    Graph: {
      icon: <GitBranch size={20} />,
      color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    },
    'Dynamic Programming': {
      icon: <Database size={20} />,
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    },
  }

  const diffConfig = difficultyConfig[difficulty] || difficultyConfig.Medium
  const catConfig = categoryConfig[category] || {
    icon: <Settings size={20} />,
    color: 'bg-gray-100 text-gray-700',
  }

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="group">
      <Link to={actionUrl}>
        <div
          className="relative h-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700
          shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          {/* Background Gradient Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300" />

          {/* New Badge */}
          {isNew && (
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Sparkles size={12} /> New
              </span>
            </div>
          )}

          {/* Content */}
          <div className="relative p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{catConfig.icon}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${catConfig.color}`}
                  >
                    {category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
              {description}
            </p>

            {/* Complexity Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 flex items-start gap-2">
                <Clock size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Time</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {timeComplexity}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 flex items-start gap-2">
                <BarChart3 size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Space</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {spaceComplexity}
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty & Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${diffConfig.color}`}
              >
                <span className={`w-2 h-2 rounded-full ${diffConfig.dotColor}`}></span> {difficulty}
              </span>
              {tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={e => {
                  e.preventDefault()
                  onFavoriteClick?.()
                }}
                className={`transition-transform hover:scale-125 ${
                  isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                <span>Visualize</span>
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default AlgorithmCard
