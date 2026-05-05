import { useState, useEffect } from 'react';

/**
 * Returns true when the window width is smaller than the specified breakpoint (default is 600px).
 * Automatically updates its state whenever the window is resized.
 *
 * @param {number} breakpoint - Width in pixels to evaluate against the viewport.
 * @returns {boolean} Whether the screen matches the mobile breakpoint.
 */
export const useIsMobile = (breakpoint = 600) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    // Ensures the window object is accessible (e.g., handles SSR/Next.js safely)
    if (typeof window === 'undefined') return;

    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
};