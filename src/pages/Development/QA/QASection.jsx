import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown, FaThumbsUp, FaEye, FaCheckCircle, FaSearch, FaTimes } from 'react-icons/fa'
import QAMarkdown from './QAMarkdown'
import {
  sampleQAData,
  getQACategories,
  getQADifficulties,
  filterQAData,
} from '../../../utils/sampleQAData'

const DIFFICULTY_COLORS = {
  Beginner: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
  Intermediate: { bg: '#fff3cd', text: '#856404', border: '#ffc107' },
  Advanced: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
}

export default function QASection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [sortBy, setSortBy] = useState('upvotes')
  const [expandedId, setExpandedId] = useState(null)

  const categories = getQACategories()
  const difficulties = getQADifficulties()

  const filteredData = useMemo(() => {
    return filterQAData({
      data: sampleQAData,
      searchQuery,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      sortBy,
    })
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const toggleExpand = id => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div>
      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 mb-8 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Filters
          </span>
          <div className="flex-1 h-px bg-gray-200 ml-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={12} />
                  </button>
                ) : (
                  <FaSearch size={14} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none"
            >
              <option value="All">All Levels</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none"
            >
              <option value="upvotes">Most Upvoted</option>
              <option value="views">Most Viewed</option>
              <option value="newest">Newest</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
              setSelectedDifficulty('All')
              setSortBy('upvotes')
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3.5 py-1.5 rounded-md hover:bg-gray-200 transition-colors uppercase tracking-wider"
          >
            <FaTimes size={10} />
            Clear Filters
          </button>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {filteredData.length} question{filteredData.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Q&A List — Accordion */}
      {filteredData.length > 0 ? (
        <div className="space-y-3">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Question Header (clickable) */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        style={{
                          backgroundColor: DIFFICULTY_COLORS[item.difficulty]?.bg,
                          color: DIFFICULTY_COLORS[item.difficulty]?.text,
                          borderColor: DIFFICULTY_COLORS[item.difficulty]?.border,
                        }}
                        className="px-2 py-0.5 text-xs font-semibold rounded-md border"
                      >
                        {item.difficulty}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                        {item.category}
                      </span>
                      {item.isVerified && (
                        <FaCheckCircle
                          className="text-green-500"
                          size={13}
                          title="Verified answer"
                        />
                      )}
                    </div>
                    <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
                      {item.question}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FaThumbsUp size={11} /> {item.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye size={11} /> {item.views}
                      </span>
                      <span>By {item.author}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 text-gray-400 flex-shrink-0"
                  >
                    <FaChevronDown size={14} />
                  </motion.div>
                </button>

                {/* Answer (expandable) */}
                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="pt-4">
                          <QAMarkdown content={item.answer} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No questions found. Try adjusting your filters.
          </div>
        </motion.div>
      )}
    </div>
  )
}
