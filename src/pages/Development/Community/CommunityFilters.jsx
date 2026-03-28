import React, { memo, useCallback } from 'react';
import { FaSearch, FaTimes, FaSlidersH } from 'react-icons/fa';
import StyledDropdown from '../../../components/Common/StyledDropdown';
import { motion } from 'framer-motion';

// Grayscale palette — consistent with other Development sub-pages
const COLORS = {
  text: { primary: '#212529', secondary: '#495057' },
  accent: { primary: '#343a40' },
};

/**
 * CommunityFilters
 * Search bar + Platform dropdown + Category dropdown + result count + clear btn
 */
const CommunityFilters = memo(({
  searchQuery,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  platforms,
  selectedCategory,
  onCategoryChange,
  categories,
  onClearFilters,
  resultCount,
  accentColor = COLORS.accent.primary,
}) => {
  const handleClearSearch = useCallback(() => onSearchChange(''), [onSearchChange]);

  const hasActiveFilters =
    searchQuery || (selectedPlatform && selectedPlatform !== 'All') || (selectedCategory && selectedCategory !== 'All');

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

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ color: COLORS.text.secondary }}
          >
            <FaTimes size={10} /> Clear all
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search communities…"
            className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white transition-all"
            style={{ color: COLORS.text.primary }}
          />
          <FaSearch
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#adb5bd' }}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        {/* Platform dropdown */}
        <div className="w-full md:w-48">
          <StyledDropdown
            label=""
            value={selectedPlatform}
            options={platforms.map((p) => ({ label: p, value: p }))}
            onChange={onPlatformChange}
            placeholder="Platform"
            accentColor={accentColor}
          />
        </div>

        {/* Category dropdown */}
        <div className="w-full md:w-48">
          <StyledDropdown
            label=""
            value={selectedCategory}
            options={categories.map((c) => ({ label: c, value: c }))}
            onChange={onCategoryChange}
            placeholder="Category"
            accentColor={accentColor}
          />
        </div>
      </div>

      {/* Result count */}
      {resultCount !== undefined && (
        <div className="mt-4 text-xs font-medium" style={{ color: COLORS.text.secondary }}>
          Showing <span className="font-bold" style={{ color: COLORS.text.primary }}>{resultCount}</span> communities
        </div>
      )}
    </motion.div>
  );
});

CommunityFilters.displayName = 'CommunityFilters';
export default CommunityFilters;
