import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch, FaTimes, FaChevronDown, FaFilter, FaSlidersH } from 'react-icons/fa';
import CodeCard from './CodeCard';
import StyledDropdown from '../../../components/Common/StyledDropdown';
import { useContentFilter, usePagination } from '../../../hooks/useContentFilter';
import { sampleCodeExamples } from '../../../utils/sampleData';

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
    primary: '#343a40', // gunmetal
    secondary: '#6c757d', // slate-grey
  }
};

export default function CodeExamplesList() {
  const navigate = useNavigate();
  const [codeExamples, setCodeExamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCodeExamples(sampleCodeExamples);
    setLoading(false);
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sort,
    updateSort,
    results,
    count
  } = useContentFilter(
    codeExamples,
    ['title', 'description', 'tags'],
    { language: '' },
    { field: 'rating', order: 'desc' }
  );

  const {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage
  } = usePagination(results, 12);

  const languages = ['javascript', 'python', 'java', 'cpp', 'go', 'sql'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div style={{ color: COLORS.text.tertiary }}>Loading code examples...</div>
      </div>
    );
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
          <h1 style={{ color: COLORS.text.primary }} className="text-4xl font-bold mb-2">Code Examples</h1>
          <p style={{ color: COLORS.text.secondary }} className="text-lg">
            Ready-to-use code snippets with syntax highlighting in multiple languages.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <span style={{ color: COLORS.text.primary }} className="text-sm font-semibold tracking-wide uppercase">
              Filters
            </span>
            <div style={{ backgroundColor: COLORS.border.light }} className="flex-1 h-px ml-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Search */}
            <div>
              <label style={{ color: COLORS.text.secondary }} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">Search</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search code examples..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderColor: COLORS.border.medium,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.bg.primary,
                  }}
                  className="w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent"
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.accent.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${COLORS.accent.primary}20`;
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = COLORS.border.medium;
                    e.target.style.boxShadow = 'none';
                    e.target.style.backgroundColor = COLORS.bg.primary;
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none group-focus-within:pointer-events-auto">
                  <FaSearch
                    size={14}
                    style={{ color: COLORS.text.muted }}
                    className="transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{ color: COLORS.text.muted }}
                      className="hover:opacity-70 transition-opacity pointer-events-auto"
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Language */}
            <StyledDropdown
              label="Language"
              value={filters.language || ''}
              options={[
                { value: '', label: 'All Languages' },
                ...languages.map(lang => ({ 
                  value: lang, 
                  label: lang.charAt(0).toUpperCase() + lang.slice(1) 
                }))
              ]}
              onChange={(val) => updateFilter('language', val)}
              placeholder="All Languages"
              labelStyle={{ color: COLORS.text.secondary }}
              buttonStyle={{
                borderColor: COLORS.border.medium,
                color: filters.language ? COLORS.text.primary : COLORS.text.tertiary,
                backgroundColor: COLORS.bg.primary,
              }}
              accentColor={COLORS.accent.primary}
            />

            {/* Sort */}
            <StyledDropdown
              label="Sort By"
              value={sort.field}
              options={[
                { value: 'rating', label: 'Highest Rated' },
                { value: 'copies', label: 'Most Copied' },
                { value: 'complexity', label: 'Complexity' }
              ]}
              onChange={(val) => updateSort(val, sort.order)}
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
              {count} result{count !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* Code Examples Grid */}
        {currentItems.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {currentItems.map((example, index) => (
                <motion.div
                  key={example.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CodeCard codeExample={example} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={prevPage}
                  disabled={!hasPrevPage}
                  style={{ borderColor: COLORS.border.medium, color: COLORS.text.secondary }}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = currentPage - 2 + i;
                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        style={{
                          backgroundColor: currentPage === pageNum ? COLORS.accent.primary : COLORS.bg.primary,
                          color: currentPage === pageNum ? COLORS.bg.primary : COLORS.text.secondary,
                          borderColor: COLORS.border.medium
                        }}
                        className={`px-3 py-2 rounded-lg border`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={!hasNextPage}
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
              No code examples found. Try adjusting your filters.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
