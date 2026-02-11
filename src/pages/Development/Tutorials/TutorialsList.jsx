import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import TutorialCard from './TutorialCard';
import { useContentFilter, usePagination } from '../../../hooks/useContentFilter';
import { sampleTutorials } from '../../../utils/sampleData';

export default function TutorialsList() {
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTutorials(sampleTutorials);
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
    tutorials,
    ['title', 'description', 'tags'],
    { category: '', difficulty: '' },
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/development')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
          >
            <FaArrowLeft size={16} />
            Back to Development Hub
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tutorials</h1>
          <p className="text-lg text-gray-600">
            Comprehensive step-by-step guides covering DSA, Web Development, and more.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Category */}
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

            {/* Difficulty */}
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
                <option value="rating">Highest Rated</option>
                <option value="duration">Duration</option>
                <option value="views">Most Viewed</option>
                <option value="createdAt">Newest</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <FaTimes size={14} />
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
                  Next
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
    </div>
  );
}
