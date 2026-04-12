import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowLeft,
  FaSearch,
  FaTimes,
  FaSlidersH,
  FaChevronDown,
  FaThumbsUp,
  FaEye,
  FaCheckCircle,
} from 'react-icons/fa'
import StyledDropdown from '../../../components/Common/StyledDropdown'
import QAMarkdown from './QAMarkdown'
import {
  sampleQAData,
  getQACategories,
  getQADifficulties,
  filterQAData,
} from '../../../utils/sampleQAData'

// Semantic color tokens from grayscale palette
const COLORS = {
  bg: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
    tertiary: '#dee2e6',
  },
  text: {
    primary: '#212529',
    secondary: '#495057',
    tertiary: '#6c757d',
    muted: '#adb5bd',
  },
  border: {
    light: '#dee2e6',
    medium: '#ced4da',
  },
  accent: {
    primary: '#343a40',
    secondary: '#6c757d',
  },
}

const DIFFICULTY_COLORS = {
  Beginner: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
  Intermediate: { bg: '#fff3cd', text: '#856404', border: '#ffc107' },
  Advanced: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
}

const ITEMS_PER_PAGE = 10

export default function QAPage() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('upvotes')
  const [expandedId, setExpandedId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

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

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredData.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredData, currentPage])

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy])

  const toggleExpand = id => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDifficulty('')
    setSortBy('upvotes')
  }

  return (
    <div style={{ backgroundColor: COLORS.bg.primary, minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: COLORS.bg.primary, borderBottomColor: COLORS.border.light }}
        className="border-b py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/development')}
            style={{ color: COLORS.text.primary }}
            className="flex items-center gap-2 hover:opacity-80 mb-4 font-semibold"
          >
            <FaArrowLeft size={16} />
            Back to Development Hub
          </button>
          <h1 style={{ color: COLORS.text.primary }} className="text-4xl font-bold mb-2">
            Q&A Knowledge Base
          </h1>
          <p style={{ color: COLORS.text.secondary }} className="text-lg">
            Curated interview questions and answers covering React, JavaScript, System Design, and
            more.
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#ffffff',
            borderColor: COLORS.border.light,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          }}
          className="rounded-xl p-6 mb-8 border"
        >
          {/* Filter Header */}
          <div className="flex items-center gap-2 mb-5">
            <div
              style={{
                backgroundColor: COLORS.bg.secondary,
                color: COLORS.text.secondary,
              }}
              className="p-2 rounded-lg"
            >
              <FaSlidersH size={14} />
            </div>
            <span
              style={{ color: COLORS.text.primary }}
              className="text-sm font-semibold tracking-wide uppercase"
            >
              Filters
            </span>
            <div style={{ backgroundColor: COLORS.border.light }} className="flex-1 h-px ml-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Search */}
            <div>
              <label
                style={{ color: COLORS.text.secondary }}
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              >
                Search
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    borderColor: COLORS.border.medium,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.bg.primary,
                  }}
                  className="w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm transition-all duration-200 outline-none"
                  onFocus={e => {
                    e.target.style.borderColor = COLORS.accent.primary
                    e.target.style.boxShadow = `0 0 0 3px ${COLORS.accent.primary}20`
                    e.target.style.backgroundColor = '#ffffff'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = COLORS.border.medium
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = COLORS.bg.primary
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none group-focus-within:pointer-events-auto">
                  <FaSearch
                    size={14}
                    style={{ color: COLORS.text.muted }}
                    className="transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ color: COLORS.text.muted }}
                      className="hover:opacity-70 transition-opacity pointer-events-auto"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            <StyledDropdown
              label="Category"
              value={selectedCategory}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat, label: cat })),
              ]}
              onChange={val => setSelectedCategory(val)}
              placeholder="All Categories"
              labelStyle={{ color: COLORS.text.secondary }}
              buttonStyle={{
                borderColor: COLORS.border.medium,
                color: selectedCategory ? COLORS.text.primary : COLORS.text.tertiary,
                backgroundColor: COLORS.bg.primary,
              }}
              accentColor={COLORS.accent.primary}
            />

            {/* Difficulty */}
            <StyledDropdown
              label="Difficulty"
              value={selectedDifficulty}
              options={[
                { value: '', label: 'All Levels' },
                ...difficulties.map(diff => ({ value: diff, label: diff })),
              ]}
              onChange={val => setSelectedDifficulty(val)}
              placeholder="All Levels"
              labelStyle={{ color: COLORS.text.secondary }}
              buttonStyle={{
                borderColor: COLORS.border.medium,
                color: selectedDifficulty ? COLORS.text.primary : COLORS.text.tertiary,
                backgroundColor: COLORS.bg.primary,
              }}
              accentColor={COLORS.accent.primary}
            />

            {/* Sort */}
            <StyledDropdown
              label="Sort By"
              value={sortBy}
              options={[
                { value: 'upvotes', label: 'Most Upvoted' },
                { value: 'views', label: 'Most Viewed' },
                { value: 'newest', label: 'Newest' },
                { value: 'difficulty', label: 'Difficulty' },
              ]}
              onChange={val => setSortBy(val)}
              placeholder="Sort By"
              labelStyle={{ color: COLORS.text.secondary }}
              buttonStyle={{
                borderColor: COLORS.border.medium,
                color: COLORS.text.primary,
                backgroundColor: COLORS.bg.primary,
              }}
              accentColor={COLORS.accent.primary}
            />
          </div>

          {/* Filter Actions */}
          <div
            style={{ borderTopColor: COLORS.border.light }}
            className="mt-5 pt-4 border-t flex justify-between items-center"
          >
            <button
              onClick={clearFilters}
              style={{
                color: COLORS.text.secondary,
                backgroundColor: COLORS.bg.secondary,
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-md hover:opacity-80 transition-all duration-200 uppercase tracking-wider"
            >
              <FaTimes size={10} />
              Clear Filters
            </button>
            <span
              style={{
                color: COLORS.text.tertiary,
                backgroundColor: COLORS.bg.secondary,
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {filteredData.length} question{filteredData.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* Q&A Accordion List */}
        {paginatedData.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor:
                        expandedId === item.id ? COLORS.accent.primary : COLORS.border.light,
                    }}
                    className="border rounded-xl overflow-hidden transition-all duration-200"
                    onMouseEnter={e => {
                      if (expandedId !== item.id) {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (expandedId !== item.id) {
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="w-full flex items-start gap-4 p-5 text-left transition-colors"
                      style={{
                        backgroundColor: expandedId === item.id ? COLORS.bg.primary : '#ffffff',
                      }}
                      onMouseEnter={e => {
                        if (expandedId !== item.id)
                          e.currentTarget.style.backgroundColor = COLORS.bg.primary
                      }}
                      onMouseLeave={e => {
                        if (expandedId !== item.id)
                          e.currentTarget.style.backgroundColor = '#ffffff'
                      }}
                    >
                      {/* Number badge */}
                      <div
                        style={{
                          backgroundColor: COLORS.bg.secondary,
                          color: COLORS.text.tertiary,
                        }}
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mt-0.5"
                      >
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
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
                          <span
                            style={{
                              backgroundColor: COLORS.bg.secondary,
                              color: COLORS.text.secondary,
                              borderColor: COLORS.border.light,
                            }}
                            className="px-2 py-0.5 text-xs font-medium rounded-md border"
                          >
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
                        <h3
                          style={{ color: COLORS.text.primary }}
                          className="text-[15px] font-semibold leading-snug"
                        >
                          {item.question}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span
                            style={{ color: COLORS.text.muted }}
                            className="flex items-center gap-1 text-xs"
                          >
                            <FaThumbsUp size={11} /> {item.upvotes}
                          </span>
                          <span
                            style={{ color: COLORS.text.muted }}
                            className="flex items-center gap-1 text-xs"
                          >
                            <FaEye size={11} /> {item.views}
                          </span>
                          <span style={{ color: COLORS.text.muted }} className="text-xs">
                            By {item.author}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: COLORS.text.muted }}
                        className="mt-1 flex-shrink-0"
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
                          <div
                            style={{ borderTopColor: COLORS.border.light }}
                            className="px-5 pb-5 border-t"
                          >
                            <div className="pt-4">
                              <QAMarkdown content={item.answer} />
                            </div>
                            <div
                              style={{ borderTopColor: COLORS.border.light }}
                              className="mt-4 pt-3 border-t flex items-center gap-3"
                            >
                              <span style={{ color: COLORS.text.muted }} className="text-xs">
                                Tags: {item.tags.join(', ')}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  style={{ borderColor: COLORS.border.medium, color: COLORS.text.secondary }}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = currentPage - 2 + i
                    if (pageNum < 1 || pageNum > totalPages) return null

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          backgroundColor:
                            currentPage === pageNum ? COLORS.accent.primary : COLORS.bg.primary,
                          color:
                            currentPage === pageNum ? COLORS.bg.primary : COLORS.text.secondary,
                          borderColor: COLORS.border.medium,
                        }}
                        className="px-3 py-2 rounded-lg border"
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  style={{ borderColor: COLORS.border.medium, color: COLORS.text.secondary }}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                >
                  Next
                </button>
              </div>
            )}

            <div style={{ color: COLORS.text.secondary }} className="text-center text-sm mt-4">
              Page {currentPage} of {totalPages}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div style={{ color: COLORS.text.tertiary }} className="text-lg">
              No questions found. Try adjusting your filters.
            </div>
          </motion.div>
        )}

        {/* Footer Tip */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderColor: COLORS.border.light,
            color: COLORS.text.tertiary,
          }}
          className="mt-8 p-4 border rounded-lg text-center text-sm"
        >
          <strong style={{ color: COLORS.text.secondary }}>Tip:</strong> Click on any question to
          reveal the detailed answer. Use filters to narrow down by category or difficulty level.
        </div>
      </div>
    </div>
  )
}
