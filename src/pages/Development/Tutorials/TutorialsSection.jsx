import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TutorialCard from './TutorialCard';
import { useContentFilter, usePagination } from '../../hooks/useContentFilter';
import { sampleTutorials } from '../../utils/sampleData';

export default function TutorialsSection() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    setTutorials(sampleTutorials);
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
    tutorials,
    ['title', 'description', 'tags'],
    { category: '', difficulty: '', isPremium: false },
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

  const categories = ['DSA', 'Web', 'DevOps', 'AI'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">Loading tutorials...</div>
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
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => updateFilter('category', e.target.value || '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty || ''}
              onChange={(e) => updateFilter('difficulty', e.target.value || '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Levels</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
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
              <option value="duration">Duration</option>
              <option value="views">Most Viewed</option>
              <option value="createdAt">Newest</option>
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
            Found {count} tutorial{count !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Tutorials Grid */}
      {currentItems.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {currentItems.map((tutorial, index) => (
              <motion.div
                key={tutorial.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TutorialCard tutorial={tutorial} />
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
            No tutorials found. Try adjusting your filters.
          </div>
        </motion.div>
      )}
    </div>
  );
}
