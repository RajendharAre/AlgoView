import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaEye, FaStar, FaTimes, FaCrown } from 'react-icons/fa';

// Grayscale palette
const COLORS = {
  bg: {
    primary: '#f8f9fa',
    secondary: '#e9ecef',
    tertiary: '#dee2e6',
    dark: '#343a40',
  },
  text: {
    primary: '#212529',
    secondary: '#495057',
    tertiary: '#6c757d',
    muted: '#adb5bd',
    light: '#f8f9fa',
  },
  border: {
    light: '#dee2e6',
    medium: '#ced4da',
  },
  star: '#f59e0b',
};

// UI accent colors for tags and badges
const CATEGORY_COLORS = {
  Web: { bg: '#dbeafe', text: '#1e40af' },
  DevOps: { bg: '#d1fae5', text: '#065f46' },
  Cloud: { bg: '#ede9fe', text: '#5b21b6' },
  AI: { bg: '#fef3c7', text: '#92400e' },
};

const DIFFICULTY_COLORS = {
  Beginner: { bg: '#d1fae5', text: '#065f46' },
  Intermediate: { bg: '#fef3c7', text: '#92400e' },
  Advanced: { bg: '#fee2e2', text: '#991b1b' },
};

const TAG_COLORS = { bg: '#e0e7ff', text: '#4338ca' };
const PREMIUM_COLORS = { bg: '#fef3c7', text: '#92400e', icon: '#d97706' };

export default function TutorialCard({ tutorial }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const catColor = CATEGORY_COLORS[tutorial.category] || { bg: COLORS.bg.tertiary, text: COLORS.text.secondary };
  const diffColor = DIFFICULTY_COLORS[tutorial.difficulty] || { bg: COLORS.bg.tertiary, text: COLORS.text.secondary };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`star-${i}`} style={{ color: COLORS.star }} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half-star" style={{ color: COLORS.star, opacity: 0.5 }} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} style={{ color: COLORS.border.light }} />
      );
    }

    return stars;
  };

  return (
    <>
      {/* Card */}
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ backgroundColor: COLORS.bg.primary, borderColor: COLORS.border.light }}
        className="h-full rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        {/* Image */}
        <div style={{ backgroundColor: COLORS.bg.secondary }} className="relative h-48 overflow-hidden">
          <img
            src={tutorial.imageUrl}
            alt={tutorial.title}
            className="w-full h-full object-cover"
          />
          {tutorial.isPremium && (
            <div style={{ backgroundColor: PREMIUM_COLORS.bg, color: PREMIUM_COLORS.text }} className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <FaCrown size={12} style={{ color: PREMIUM_COLORS.icon }} />
              Premium
            </div>
          )}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <button
              onClick={() => setShowDetails(true)}
              style={{ backgroundColor: COLORS.bg.primary, color: COLORS.text.primary }}
              className="px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              View Details
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category & Difficulty */}
          <div className="flex justify-between items-start mb-3">
            <span style={{ backgroundColor: catColor.bg, color: catColor.text }} className="inline-block px-3 py-1 text-xs font-medium rounded-full">
              {tutorial.category}
            </span>
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: diffColor.bg, color: diffColor.text }}>
              {tutorial.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 style={{ color: COLORS.text.primary }} className="text-lg font-bold mb-2 line-clamp-2 cursor-pointer transition">
            {tutorial.title}
          </h3>

          {/* Description */}
          <p style={{ color: COLORS.text.secondary }} className="text-sm mb-4 line-clamp-2">
            {tutorial.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tutorial.tags.slice(0, 2).map((tag, i) => (
              <span key={i} style={{ color: TAG_COLORS.text, backgroundColor: TAG_COLORS.bg }} className="text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {tutorial.tags.length > 2 && (
              <span style={{ color: COLORS.text.muted }} className="text-xs">+{tutorial.tags.length - 2} more</span>
            )}
          </div>

          {/* Rating */}
          <div style={{ borderTopColor: COLORS.border.light }} className="flex items-center justify-between mb-4 pb-4 border-t">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {renderStars(tutorial.rating)}
              </div>
              <span style={{ color: COLORS.text.primary }} className="text-sm font-semibold">{tutorial.rating}</span>
              <span style={{ color: COLORS.text.tertiary }} className="text-xs">({tutorial.ratingCount})</span>
            </div>
          </div>

          {/* Meta Info */}
          <div style={{ color: COLORS.text.secondary }} className="flex justify-between text-sm mb-4">
            <div className="flex items-center gap-1">
              <FaClock size={14} />
              <span>{tutorial.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <FaEye size={14} />
              <span>{tutorial.views || 0} views</span>
            </div>
          </div>

          {/* Author */}
          <div style={{ color: COLORS.text.tertiary, borderTopColor: COLORS.border.light }} className="text-xs border-t pt-3">
            By <span style={{ color: COLORS.text.primary }} className="font-semibold">{tutorial.author}</span>
          </div>

          {/* Read Button */}
          <button style={{ backgroundColor: COLORS.bg.dark, color: COLORS.text.light }} className="w-full mt-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
            Start Learning
          </button>
        </div>
      </motion.div>

      {/* Details Modal */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDetails(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: COLORS.bg.primary }}
            className="rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div style={{ backgroundColor: COLORS.bg.primary, borderBottomColor: COLORS.border.light }} className="sticky top-0 p-6 border-b flex justify-between items-start">
              <div>
                <h2 style={{ color: COLORS.text.primary }} className="text-2xl font-bold mb-2">{tutorial.title}</h2>
                <div className="flex gap-2">
                  <span style={{ backgroundColor: catColor.bg, color: catColor.text }} className="px-3 py-1 text-xs font-medium rounded-full">
                    {tutorial.category}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: diffColor.bg, color: diffColor.text }}>
                    {tutorial.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                style={{ color: COLORS.text.tertiary }}
                className="hover:opacity-70 text-xl"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div style={{ backgroundColor: COLORS.bg.primary }} className="p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaClock style={{ color: COLORS.text.tertiary }} /></div>
                  <div style={{ color: COLORS.text.tertiary }} className="text-xs mt-1">Duration</div>
                  <div style={{ color: COLORS.text.primary }} className="text-lg font-bold">{tutorial.duration} min</div>
                </div>
                <div style={{ backgroundColor: COLORS.bg.primary }} className="p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaEye style={{ color: COLORS.star }} /></div>
                  <div style={{ color: COLORS.text.tertiary }} className="text-xs mt-1">Views</div>
                  <div style={{ color: COLORS.text.primary }} className="text-lg font-bold">{tutorial.views || 0}</div>
                </div>
                <div style={{ backgroundColor: COLORS.bg.primary }} className="p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaStar style={{ color: COLORS.star }} /></div>
                  <div style={{ color: COLORS.text.tertiary }} className="text-xs mt-1">Rating</div>
                  <div style={{ color: COLORS.text.primary }} className="text-lg font-bold">{tutorial.rating}</div>
                </div>
                <div style={{ backgroundColor: COLORS.bg.primary }} className="p-4 rounded-lg">
                  <div className="text-2xl mb-2"><FaStar style={{ color: COLORS.star }} /></div>
                  <div style={{ color: COLORS.text.tertiary }} className="text-xs mt-1">Reviews</div>
                  <div style={{ color: COLORS.text.primary }} className="text-lg font-bold">{tutorial.ratingCount || 0}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 style={{ color: COLORS.text.primary }} className="text-lg font-bold mb-2">Overview</h3>
                <p style={{ color: COLORS.text.secondary }} className="leading-relaxed">{tutorial.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 style={{ color: COLORS.text.primary }} className="text-lg font-bold mb-2">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {tutorial.tags.map((tag, i) => (
                    <span key={i} style={{ backgroundColor: TAG_COLORS.bg, color: TAG_COLORS.text }} className="px-3 py-1 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div style={{ backgroundColor: COLORS.bg.primary }} className="mb-6 p-4 rounded-lg">
                <div style={{ color: COLORS.text.tertiary }} className="text-sm mb-1">Author</div>
                <div style={{ color: COLORS.text.primary }} className="text-lg font-bold">{tutorial.author}</div>
              </div>

              {/* CTA Button */}
              <button style={{ backgroundColor: COLORS.bg.dark, color: COLORS.text.light }} className="w-full py-3 rounded-lg font-bold hover:opacity-90 transition text-lg">
                {tutorial.isPremium ? 'Unlock Premium to Learn' : 'Start Learning Now'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
