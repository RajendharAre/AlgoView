import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import DocumentationRow from './DocumentationRow';

/**
 * DocumentationList Component
 * Displays documentation entries organized by category
 * Matches Tutorials page styling with grayscale palette
 */
const DocumentationList = memo(({
  documentation,
  onRowClick,
  accentColor = '#343a40',
  colors
}) => {
  // Group documentation by category
  const groupedDocs = useMemo(() => {
    const groups = {};

    documentation.forEach(doc => {
      if (!groups[doc.category]) {
        groups[doc.category] = [];
      }
      groups[doc.category].push(doc);
    });

    return groups;
  }, [documentation]);

  const categories = Object.keys(groupedDocs).sort();

  // Empty state
  if (documentation.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-6"
      >
        <div className="text-center">
          <h3 style={{ color: colors?.text.primary || '#212529' }} className="text-xl font-semibold mb-2">
            No Documentation Found
          </h3>
          <p style={{ color: colors?.text.secondary || '#495057' }} className="mb-4">
            Try adjusting your filters or search query.
          </p>
          <div style={{ backgroundColor: colors?.bg.secondary || '#e9ecef', color: colors?.text.secondary || '#495057' }} className="inline-block px-4 py-2 rounded-lg text-sm">
            💡 Tip: Clear filters to see all documentation
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: '#ffffff',
        borderColor: colors?.border.light || '#dee2e6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      }}
      className="rounded-xl overflow-hidden border"
    >
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: categoryIndex * 0.05 }}
        >
          {/* Category Header */}
          <div 
            style={{ 
              backgroundColor: colors?.bg.secondary || '#e9ecef',
              borderBottomColor: colors?.border.light || '#dee2e6',
              color: colors?.text.primary || '#212529'
            }} 
            className="px-6 py-3 border-b sticky top-0 z-10"
          >
            <h2 className="text-sm font-bold uppercase tracking-wide">
              {category}
              <span 
                style={{
                  backgroundColor: '#ffffff',
                  color: colors?.text.secondary || '#495057'
                }}
                className="ml-2 text-xs font-normal px-2 py-1 rounded"
              >
                {groupedDocs[category].length}
              </span>
            </h2>
          </div>

          {/* Category Rows */}
          <div>
            {groupedDocs[category].map((doc, docIndex) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: (categoryIndex * 0.05) + (docIndex * 0.02) }}
              >
                <DocumentationRow
                  documentation={doc}
                  onRowClick={onRowClick}
                  accentColor={accentColor}
                  colors={colors}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{
          backgroundColor: colors?.bg.secondary || '#e9ecef',
          borderTopColor: colors?.border.light || '#dee2e6',
          color: colors?.text.secondary || '#495057'
        }}
        className="px-6 py-3 border-t text-xs text-center"
      >
        Showing {documentation.length} documentation {documentation.length === 1 ? 'entry' : 'entries'} across {categories.length} {categories.length === 1 ? 'category' : 'categories'}
      </motion.div>
    </motion.div>
  );
});

DocumentationList.displayName = 'DocumentationList';

export default DocumentationList;
