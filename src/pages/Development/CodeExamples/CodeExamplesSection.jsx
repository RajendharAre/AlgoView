import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeCard from './CodeCard';
import { useContentFilter, usePagination } from '../../hooks/useContentFilter';
import { sampleCodeExamples } from '../../utils/sampleData';

export default function CodeExamplesSection() {
  const [codeExamples, setCodeExamples] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    setCodeExamples(sampleCodeExamples);
    setLoading(false);
  }, []);

  // Content filter hook
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

  // Pagination
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
  const complexities = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">Loading code examples...</div>
      </div>
    );
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
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
          </div>
          <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Filters</span>
          <div className="flex-1 h-px bg-gray-200 ml-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Search</label>
            <input
              type="text"
              placeholder="Search code examples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 rounded-lg"
            />
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Language</label>
            <select
              value={filters.language || ''}
              onChange={(e) => updateFilter('language', e.target.value || '')}
              className="w-full"
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Complexity Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Time Complexity</label>
            <select
              className="w-full"
            >
              <option value="">All Complexities</option>
              {complexities.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Sort By</label>
            <select
              value={sort.field}
              onChange={(e) => updateSort(e.target.value, sort.order)}
              className="w-full"
            >
              <option value="rating">Rating</option>
              <option value="copies">Most Copied</option>
              <option value="complexity">Complexity</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100 px-3.5 py-1.5 rounded-md hover:bg-gray-200 transition-colors uppercase tracking-wider"
          >
            Clear Filters
          </button>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ← Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = currentPage - 2 + i;
                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextPage}
                disabled={!hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-600 mt-4">
            Page {currentPage} of {totalPages}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 text-lg">
            No code examples found. Try adjusting your filters.
          </div>
        </motion.div>
      )}
    </div>
  );
}
