/**
 * Analytics Library
 * Helper functions for Google Analytics 4 (GA4) tracking
 * Initialize and track page views, events, and user interactions
 */

import ReactGA from 'react-ga4';

/**
 * Initialize Google Analytics 4 with measurement ID
 * Call this once in your main.jsx
 */
export const initializeGA = (measurementId) => {
  try {
    ReactGA.initialize(measurementId);
    console.log('✅ Google Analytics 4 initialized:', measurementId);
  } catch (error) {
    console.error('❌ GA4 initialization error:', error);
  }
};

/**
 * Track page views
 * Called automatically by PageTracker component on route change
 */
export const trackPageView = (path, title = '') => {
  try {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || document.title,
    });
    console.log('📊 Page view tracked:', path);
  } catch (error) {
    console.error('❌ Page view tracking error:', error);
  }
};

/**
 * Track custom events
 * Usage: trackEvent('user_signup', { method: 'email' })
 */
export const trackEvent = (eventName, eventData = {}) => {
  try {
    ReactGA.event(eventName, eventData);
    console.log('📍 Event tracked:', eventName, eventData);
  } catch (error) {
    console.error('❌ Event tracking error:', error);
  }
};

/**
 * Algorithm Visualization Events
 */
export const trackVisualizationStart = (algorithmName, category = 'algorithm') => {
  trackEvent('visualization_started', {
    algorithm_name: algorithmName,
    algorithm_category: category,
    timestamp: new Date().toISOString(),
  });
};

export const trackVisualizationComplete = (algorithmName, timeSpent) => {
  trackEvent('visualization_completed', {
    algorithm_name: algorithmName,
    time_spent_seconds: timeSpent,
  });
};

/**
 * User Engagement Events
 */
export const trackSearch = (query, resultCount = 0) => {
  trackEvent('search_performed', {
    search_query: query,
    result_count: resultCount,
  });
};

export const trackCodeView = (language, algorithm) => {
  trackEvent('code_example_viewed', {
    language: language,
    algorithm_name: algorithm,
  });
};

export const trackCodeCopy = (language, codeLength) => {
  trackEvent('code_copied', {
    language: language,
    code_length: codeLength,
  });
};

/**
 * Authentication Events
 */
export const trackUserSignUp = (signupMethod = 'email') => {
  trackEvent('user_signup', {
    signup_method: signupMethod,
    timestamp: new Date().toISOString(),
  });
};

export const trackUserLogin = (loginMethod = 'email') => {
  trackEvent('user_login', {
    login_method: loginMethod,
  });
};

export const trackUserLogout = () => {
  trackEvent('user_logout');
};

/**
 * Premium/Monetization Events
 */
export const trackPremiumUpgrade = (planName, price, currency = 'INR') => {
  trackEvent('premium_upgrade', {
    plan_name: planName,
    price: price,
    currency: currency,
    timestamp: new Date().toISOString(),
  });
};

export const trackAdClick = (adPosition, adFormat = 'banner') => {
  trackEvent('ad_clicked', {
    ad_position: adPosition,
    ad_format: adFormat,
  });
};

export const trackAdView = (adPosition) => {
  trackEvent('ad_impression', {
    ad_position: adPosition,
  });
};

/**
 * Content Interaction Events
 */
export const trackTutorialView = (tutorialId, tutorialTitle) => {
  trackEvent('tutorial_viewed', {
    tutorial_id: tutorialId,
    tutorial_title: tutorialTitle,
  });
};

export const trackProblemAttempt = (problemId, problemDifficulty) => {
  trackEvent('problem_attempted', {
    problem_id: problemId,
    difficulty_level: problemDifficulty,
  });
};

export const trackProblemSolved = (problemId, timeToSolve) => {
  trackEvent('problem_solved', {
    problem_id: problemId,
    time_to_solve_seconds: timeToSolve,
  });
};

/**
 * Social/Community Events
 */
export const trackDiscussionCreated = (category) => {
  trackEvent('discussion_created', {
    category: category,
  });
};

export const trackFeedbackSubmitted = (feedbackType, rating = 0) => {
  trackEvent('feedback_submitted', {
    feedback_type: feedbackType,
    rating: rating,
  });
};

/**
 * Navigation Events
 */
export const trackNavigate = (from, to) => {
  trackEvent('navigation', {
    from_page: from,
    to_page: to,
  });
};

/**
 * Error Tracking
 */
export const trackError = (errorMessage, errorType = 'unknown') => {
  trackEvent('error_occurred', {
    error_message: errorMessage,
    error_type: errorType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Performance Events
 */
export const trackPageLoadTime = (path, loadTime) => {
  trackEvent('page_load_time', {
    page_path: path,
    load_time_ms: loadTime,
  });
};

export default {
  initializeGA,
  trackPageView,
  trackEvent,
  trackVisualizationStart,
  trackVisualizationComplete,
  trackSearch,
  trackCodeView,
  trackCodeCopy,
  trackUserSignUp,
  trackUserLogin,
  trackUserLogout,
  trackPremiumUpgrade,
  trackAdClick,
  trackAdView,
  trackTutorialView,
  trackProblemAttempt,
  trackProblemSolved,
  trackDiscussionCreated,
  trackFeedbackSubmitted,
  trackNavigate,
  trackError,
  trackPageLoadTime,
};
