import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaUsers } from 'react-icons/fa'
import CommunityCard from './CommunityCard'
import CommunityFilters from './CommunityFilters'
import {
  communityConfig,
  getCommunityPlatforms,
  getCommunityCategories,
  filterCommunities,
} from '../../../utils/communityConfig'

// Semantic color tokens — matches Development Hub grayscale palette
const COLORS = {
  bg: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
  },
  text: {
    primary: '#212529',
    secondary: '#495057',
  },
  border: {
    light: '#dee2e6',
  },
  accent: {
    primary: '#343a40',
  },
}

/**
 * CommunityPage
 * Curated developer community links — Discord, Reddit, GitHub, SO, Telegram, etc.
 * Follows the same layout pattern as VideosPage / DocumentationPage.
 */
export default function CommunityPage() {
  const navigate = useNavigate()

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Derived data
  const platforms = useMemo(() => getCommunityPlatforms(), [])
  const categories = useMemo(() => getCommunityCategories(), [])

  const filteredCommunities = useMemo(
    () =>
      filterCommunities({
        communities: communityConfig,
        searchQuery,
        platform: selectedPlatform,
        category: selectedCategory,
      }),
    [searchQuery, selectedPlatform, selectedCategory]
  )

  // Handlers
  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedPlatform('All')
    setSelectedCategory('All')
  }, [])

  return (
    <div style={{ backgroundColor: COLORS.bg.primary, minHeight: '100vh' }}>
      {/* ── Header ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: COLORS.bg.primary,
          borderBottomColor: COLORS.border.light,
        }}
        className="border-b py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/development')}
            style={{ color: COLORS.text.primary }}
            className="flex items-center gap-2 hover:opacity-80 mb-4 font-semibold text-sm transition-opacity"
          >
            <FaArrowLeft size={16} />
            Back to Development Hub
          </button>

          {/* Title */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{ backgroundColor: `${COLORS.accent.primary}20` }}
                className="p-2 rounded-lg"
              >
                <FaUsers size={24} style={{ color: COLORS.accent.primary }} />
              </div>
              <h1 style={{ color: COLORS.text.primary }} className="text-4xl font-bold">
                Community
              </h1>
            </div>
            <p style={{ color: COLORS.text.secondary }} className="text-lg mt-2 max-w-3xl">
              Connect with developers across Discord, Reddit, GitHub, Stack Overflow, Telegram, and
              more. Find your tribe and start contributing.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <CommunityFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            platforms={platforms}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            onClearFilters={handleClearFilters}
            resultCount={filteredCommunities.length}
            accentColor={COLORS.accent.primary}
          />
        </motion.div>

        {/* ── Results info ────────────────────────────── */}
        {filteredCommunities.length !== communityConfig.length && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'rgba(52, 58, 64, 0.05)',
              borderColor: COLORS.border.light,
            }}
            className="rounded-lg px-4 py-3 mb-6 border flex items-center justify-between"
          >
            <span style={{ color: COLORS.text.secondary }} className="text-sm">
              Showing{' '}
              <strong style={{ color: COLORS.text.primary }}>{filteredCommunities.length}</strong>{' '}
              of {communityConfig.length} communities
            </span>
            <button
              onClick={handleClearFilters}
              style={{ color: COLORS.accent.primary }}
              className="text-sm font-semibold hover:underline"
            >
              Show all
            </button>
          </motion.div>
        )}

        {/* ── Grid ────────────────────────────────────── */}
        {filteredCommunities.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCommunities.map((community, idx) => (
              <CommunityCard key={community.id} community={community} index={idx} />
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <FaUsers size={48} style={{ color: '#ced4da' }} className="mb-4" />
            <h3 style={{ color: COLORS.text.primary }} className="text-xl font-bold mb-2">
              No communities found
            </h3>
            <p style={{ color: COLORS.text.secondary }} className="text-sm max-w-md mb-6">
              Try adjusting your filters or search query to find the community you're looking for.
            </p>
            <button
              onClick={handleClearFilters}
              style={{
                backgroundColor: COLORS.accent.primary,
                color: '#f8f9fa',
              }}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
