import React, { memo, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * VideoCard Component
 * Displays individual video with thumbnail, title, description, and play action
 * Memoized to prevent unnecessary re-renders
 * Simplified design - no metadata (views, duration, rating, etc.)
 */
const VideoCard = memo(({
  video,
  onPlay,
  accentColor = '#343a40'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    thumbnail,
    description
  } = video;

  // Validate thumbnail URL
  const validThumbnail = thumbnail && thumbnail.startsWith('http') 
    ? thumbnail 
    : 'https://via.placeholder.com/400x225?text=Video';

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Handle image load error with fallback
  const handleImageError = (e) => {
    setImageError(true);
    setImageLoaded(true);
    // Try lower quality thumbnail if maxresdefault fails
    if (e.target.src.includes('maxresdefault')) {
      const fallbackUrl = thumbnail.replace('maxresdefault', 'hqdefault');
      e.target.src = fallbackUrl;
    } else if (e.target.src.includes('hqdefault')) {
      const fallbackUrl = thumbnail.replace('hqdefault', 'sddefault');
      e.target.src = fallbackUrl;
    } else {
      // Use placeholder as last resort
      e.target.src = 'https://via.placeholder.com/400x225?text=Video';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer transform hover:-translate-y-1">
        
        {/* Thumbnail Container */}
        <div className="relative overflow-hidden bg-gray-200 aspect-video">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
          )}

          {/* Image */}
          <img
            src={validThumbnail}
            alt={title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            decoding="async"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlay(video)}
              style={{ backgroundColor: accentColor }}
              className="rounded-full p-4 shadow-lg text-white hover:shadow-xl transition-shadow"
              aria-label="Play video"
            >
              <FaPlay size={24} className="ml-1" />
            </motion.button>
          </div>

        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3
            className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-opacity-80 transition-colors"
            title={title}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
            {description}
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPlay(video)}
            style={{ backgroundColor: accentColor }}
            className="w-full mt-auto px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
          >
            <FaPlay size={12} />
            Watch Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
