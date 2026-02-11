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

  const languages = ['javascript', 'python', 'java', 'cpp', 'go'];
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
        className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search code examples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={filters.language || ''}
              onChange={(e) => updateFilter('language', e.target.value || '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Complexity</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Complexities</option>
              {complexities.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sort.field}
              onChange={(e) => updateSort(e.target.value, sort.order)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="rating">Rating</option>
              <option value="copies">Most Copied</option>
              <option value="complexity">Complexity</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Filters
          </button>
          <span className="text-sm text-gray-600">
            Found {count} code example{count !== 1 ? 's' : ''}
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
