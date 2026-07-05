import { useEffect, useState } from 'react';

const smQuery = '(max-width: 639.98px)';

const smMatchMedia = window.matchMedia(smQuery);

const checkIsMobile = () => {
  return smMatchMedia.matches;
};

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(() => checkIsMobile());

  const handleChange = () => {
    setIsMobile(checkIsMobile());
  };

  useEffect(() => {
    smMatchMedia.addEventListener('change', handleChange);

    return () => {
      smMatchMedia.removeEventListener('change', handleChange);
    };
  }, []);

  return { isMobile };
};
