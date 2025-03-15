import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check for touch capability
      const hasTouch = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0;

      // Check for mobile-specific features
      const hasMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Check for screen size as a fallback
      const isMobileWidth = window.innerWidth <= 768;

      setIsMobile(hasTouch && (hasMobileUA || isMobileWidth));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return !isMobile;
};

export default useIsMobile; 