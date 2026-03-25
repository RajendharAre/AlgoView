/**
 * PageTracker Component
 * Automatically tracks page views whenever the route changes
 * Should be placed at the top level of your app
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';

export const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever location changes
    trackPageView(location.pathname, document.title);
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [location]);

  // This component doesn't render anything, just tracks
  return null;
};

export default PageTracker;
