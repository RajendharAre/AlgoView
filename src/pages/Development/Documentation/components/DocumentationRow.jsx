import React, { memo } from 'react';
import { FaExternalLinkAlt, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * DocumentationRow Component
 * Displays a single documentation entry in list format
 * Matches Tutorials page styling with grayscale palette
 * Memoized to prevent unnecessary re-renders
 */
const DocumentationRow = memo(({
  documentation,
  onRowClick,
  accentColor = '#343a40',
  colors
}) => {
  const {
    id,
    title,
    category,
    description,
    difficulty,
    embedAllowed
  } = documentation;

  // Difficulty badge color
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Intermediate':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Advanced':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#4b5563', border: 'rgba(107, 114, 128, 0.3)' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div
        onClick={() => onRowClick(documentation)}
        style={{
          borderBottomColor: colors?.border.light || '#dee2e6',
          backgroundColor: 'transparent'
        }}
        className="px-6 py-4 border-b hover:bg-opacity-50 transition-all duration-200 cursor-pointer"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors?.bg.secondary || '#e9ecef'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div className="flex items-start justify-between gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-3 mb-2">
              <h3 
                style={{ color: colors?.text.primary || '#212529' }}
                className="text-base font-semibold group-hover:opacity-80 transition-opacity truncate"
                onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                onMouseLeave={(e) => e.currentTarget.style.color = colors?.text.primary || '#212529'}
              >
                {title}
              </h3>
              {embedAllowed && (
                <span
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    color: '#a855f7',
                    borderColor: 'rgba(168, 85, 247, 0.3)'
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border"
                  title="Can be viewed in embedded modal"
                >
                  <FaEye size={12} />
                  Embed
                </span>
              )}
            </div>

            {/* Description */}
            <p 
              style={{ color: colors?.text.secondary || '#495057' }}
              className="text-sm mb-3 line-clamp-2"
            >
              {description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Category Badge */}
              <span 
                style={{
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  color: colors?.text.secondary || '#495057',
                  borderColor: 'rgba(107, 114, 128, 0.2)'
                }}
                className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border"
              >
                {category}
              </span>

              {/* Difficulty Badge */}
              <span 
                style={{
                  backgroundColor: getDifficultyColor(difficulty).bg,
                  color: getDifficultyColor(difficulty).text,
                  borderColor: getDifficultyColor(difficulty).border
                }}
                className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border"
              >
                {difficulty}
              </span>
            </div>
          </div>

          {/* Action Icon */}
          <div className="flex-shrink-0 pt-1">
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
              style={{ color: colors?.text.tertiary || '#6c757d' }}
              onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
              onMouseLeave={(e) => e.currentTarget.style.color = colors?.text.tertiary || '#6c757d'}
              className="transition-colors"
            >
              <FaExternalLinkAlt size={16} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

DocumentationRow.displayName = 'DocumentationRow';

export default DocumentationRow;
