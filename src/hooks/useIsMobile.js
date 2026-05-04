import { useState, useEffect } from 'react';

/**
 * Повертає true, коли ширина вікна менша за breakpoint (default 600px).
 * Автоматично оновлюється при зміні розміру вікна.
 *
 * @param {number} breakpoint
 * @returns {boolean}
 */
export const useIsMobile = (breakpoint = 600) => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
};