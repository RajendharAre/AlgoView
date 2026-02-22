import React, { memo, useCallback } from 'react';
import { FaSearch, FaTimes, FaSlidersH } from 'react-icons/fa';
import { motion } from 'framer-motion';
import StyledDropdown from '@/components/Common/StyledDropdown';

/**
 * DocumentationFilters Component
 * Provides search, category, difficulty filtering
 * Matches Tutorials page styling
 */
const DocumentationFilters = memo(({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedDifficulty,
  onDifficultyChange,
  difficulties,
  colors
}) => {
  // Clear all filters
  const handleClearAll = useCallback(() => {
    onSearchChange('');
    onCategoryChange('All');
    onDifficultyChange('All');
  }, [onSearchChange, onCategoryChange, onDifficultyChange]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#ffffff',
        borderColor: colors.border.light,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      }}
      className="rounded-xl p-6 mb-8 border"
    >
      {/* Filter Header */}
      <div className="flex items-center gap-2 mb-5">
        <div
          style={{
            backgroundColor: colors.bg.secondary,
            color: colors.text.secondary,
          }}
          className="p-2 rounded-lg"
        >
          <FaSlidersH size={14} />
        </div>
        <span style={{ color: colors.text.primary }} className="text-sm font-semibold tracking-wide uppercase">
          Filters
        </span>
        <div style={{ backgroundColor: colors.border.light }} className="flex-1 h-px ml-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Search */}
        <div>
          <label style={{ color: colors.text.secondary }} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
            Search
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                borderColor: colors.border.medium,
                color: colors.text.primary,
                backgroundColor: colors.bg.primary,
              }}
              className="w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm transition-all duration-200 outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = colors.accent.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.accent.primary}20`;
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border.medium;
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = colors.bg.primary;
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none group-focus-within:pointer-events-auto">
              <FaSearch
                size={14}
                style={{ color: colors.text.tertiary }}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="pointer-events-auto"
                  style={{ color: colors.text.tertiary }}
                  aria-label="Clear search"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        <StyledDropdown
          label="Category"
          value={selectedCategory}
          options={[
            { value: 'All', label: 'All Categories' },
            ...categories.map(cat => ({ value: cat, label: cat }))
          ]}
          onChange={onCategoryChange}
          placeholder="All Categories"
          labelStyle={{ color: colors.text.secondary }}
          buttonStyle={{
            borderColor: colors.border.medium,
            color: selectedCategory ? colors.text.primary : colors.text.tertiary,
            backgroundColor: colors.bg.primary,
          }}
          accentColor={colors.accent.primary}
        />

        {/* Difficulty Dropdown */}
        <StyledDropdown
          label="Difficulty"
          value={selectedDifficulty}
          options={[
            { value: 'All', label: 'All Levels' },
            ...difficulties.map(diff => ({ value: diff, label: diff }))
          ]}
          onChange={onDifficultyChange}
          placeholder="All Levels"
          labelStyle={{ color: colors.text.secondary }}
          buttonStyle={{
            borderColor: colors.border.medium,
            color: selectedDifficulty ? colors.text.primary : colors.text.tertiary,
            backgroundColor: colors.bg.primary,
          }}
          accentColor={colors.accent.primary}
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={handleClearAll}
              style={{
                color: colors.accent.primary,
                backgroundColor: `${colors.accent.primary}10`,
                borderColor: `${colors.accent.primary}30`,
              }}
              className="w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all border hover:opacity-80"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
});

DocumentationFilters.displayName = 'DocumentationFilters';

export default DocumentationFilters;
