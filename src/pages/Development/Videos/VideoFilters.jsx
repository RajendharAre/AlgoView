import React, { memo, useCallback } from 'react';
import { FaSearch, FaTimes, FaSlidersH } from 'react-icons/fa';
import StyledDropdown from '../../../components/Common/StyledDropdown';
import { motion } from 'framer-motion';

/**
 * VideoFilters Component
 * Handles search, topic filter, and difficulty filter
 * Memoized to prevent unnecessary re-renders
 */
const VideoFilters = memo(({
  searchTerm,
  onSearchChange,
  selectedTopic,
  onTopicChange,
  selectedDifficulty,
  onDifficultyChange,
  onClearFilters,
  resultCount,
  topics,
  difficulties,
  accentColor = '#343a40'
}) => {
  // Clear individual filter
  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedTopic || selectedDifficulty;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          style={{ backgroundColor: `${accentColor}15` }}
          className="p-2 rounded-lg"
        >
          <FaSlidersH size={16} style={{ color: accentColor }} />
        </div>
        <span
          style={{ color: accentColor }}
          className="text-sm font-semibold tracking-wide uppercase"
        >
          Filters
        </span>
        <div
          style={{ backgroundColor: '#e5e7eb' }}
          className="flex-1 h-px ml-2"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
            Search Videos
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all"
              style={{
                focusBorderColor: accentColor,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = accentColor;
                e.target.style.boxShadow = `0 0 0 3px ${accentColor}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none group-focus-within:pointer-events-auto">
              <FaSearch
                size={14}
                className="text-gray-400 group-focus-within:text-gray-600 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto"
                  aria-label="Clear search"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Topic Filter */}
        <StyledDropdown
          label="Topic"
          value={selectedTopic}
          options={[
            { value: '', label: 'All Topics' },
            ...topics.map(topic => ({ value: topic, label: topic }))
          ]}
          onChange={onTopicChange}
          placeholder="All Topics"
          labelStyle={{ color: '#4b5563' }}
          buttonStyle={{
            borderColor: '#d1d5db',
            color: selectedTopic ? '#111827' : '#9ca3af',
            backgroundColor: '#ffffff',
          }}
          accentColor={accentColor}
        />

        {/* Difficulty Filter */}
        <StyledDropdown
          label="Difficulty"
          value={selectedDifficulty}
          options={[
            { value: '', label: 'All Levels' },
            ...difficulties.map(diff => ({ value: diff, label: diff }))
          ]}
          onChange={onDifficultyChange}
          placeholder="All Levels"
          labelStyle={{ color: '#4b5563' }}
          buttonStyle={{
            borderColor: '#d1d5db',
            color: selectedDifficulty ? '#111827' : '#9ca3af',
            backgroundColor: '#ffffff',
          }}
          accentColor={accentColor}
        />
      </div>

      {/* Filter Actions & Results */}
      <div
        className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
      >
        <button
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md transition-all uppercase tracking-wider ${
            hasActiveFilters
              ? 'text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
        >
          <FaTimes size={12} />
          Clear All Filters
        </button>

        <div
          style={{
            backgroundColor: `${accentColor}10`,
            color: accentColor,
            borderColor: `${accentColor}30`,
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border"
        >
          {resultCount} video{resultCount !== 1 ? 's' : ''} found
        </div>
      </div>
    </motion.div>
  );
});

VideoFilters.displayName = 'VideoFilters';

export default VideoFilters;
