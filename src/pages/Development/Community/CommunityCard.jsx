import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  FaDiscord,
  FaRedditAlien,
  FaGithub,
  FaStackOverflow,
  FaTelegram,
} from 'react-icons/fa';
import { SiDevdotto, SiHashnode } from 'react-icons/si';

// Semantic color tokens — matches Development Hub grayscale palette
const COLORS = {
  bg: { primary: '#f8f9fa', secondary: '#e9ecef' },
  text: { primary: '#212529', secondary: '#495057', tertiary: '#6c757d' },
  border: { light: '#dee2e6' },
  accent: { primary: '#343a40' },
};

/** Platform → icon + brand color mapping */
const PLATFORM_META = {
  Discord:          { Icon: FaDiscord,        color: '#5865F2' },
  Reddit:           { Icon: FaRedditAlien,    color: '#FF4500' },
  GitHub:           { Icon: FaGithub,         color: '#333333' },
  'Stack Overflow': { Icon: FaStackOverflow,  color: '#F48024' },
  Telegram:         { Icon: FaTelegram,       color: '#0088cc' },
  'Dev.to':         { Icon: SiDevdotto,       color: '#0A0A0A' },
  Hashnode:         { Icon: SiHashnode,       color: '#2962FF' },
};

/**
 * CommunityCard
 * Displays a single community resource with platform icon, description, tags,
 * and a "Join Community" CTA that opens in a new tab.
 */
const CommunityCard = memo(({ community, index = 0 }) => {
  const { name, platform, category, description, members, url, tags } = community;
  const meta = PLATFORM_META[platform] || { Icon: FaExternalLinkAlt, color: COLORS.accent.primary };
  const { Icon: PlatformIcon, color: brandColor } = meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group h-full"
    >
      <div
        style={{ borderColor: COLORS.border.light }}
        className="h-full flex flex-col rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* ── Header strip with platform icon ── */}
        <div
          style={{ backgroundColor: `${brandColor}10` }}
          className="flex items-center gap-3 px-5 py-4 border-b"
        >
          <div
            style={{ backgroundColor: `${brandColor}18` }}
            className="p-2.5 rounded-lg"
          >
            <PlatformIcon size={22} style={{ color: brandColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              style={{ color: COLORS.text.primary }}
              className="font-bold text-base truncate"
            >
              {name}
            </h3>
            <span
              style={{ color: brandColor }}
              className="text-xs font-semibold uppercase tracking-wide"
            >
              {platform}
            </span>
          </div>
          {/* Member / star count badge */}
          {members && (
            <span
              style={{ color: COLORS.text.tertiary, backgroundColor: COLORS.bg.secondary }}
              className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {members}
            </span>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 flex flex-col px-5 py-4 gap-3">
          {/* Description */}
          <p
            style={{ color: COLORS.text.secondary }}
            className="text-sm leading-relaxed line-clamp-3"
          >
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: `${brandColor}0D`,
                    color: brandColor,
                    borderColor: `${brandColor}30`,
                  }}
                  className="text-[0.7rem] font-medium px-2 py-0.5 rounded border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer CTA ── */}
        <div className="px-5 pb-4 pt-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: COLORS.accent.primary, color: '#f8f9fa' }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Join Community
            <FaExternalLinkAlt size={11} />
          </a>
        </div>
      </div>
    </motion.div>
  );
});

CommunityCard.displayName = 'CommunityCard';
export default CommunityCard;
