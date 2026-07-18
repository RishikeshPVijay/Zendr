import { useEffect, useState } from 'react';

type BreakPoints = {
  minSm: boolean;
  minMd: boolean;
  minLg: boolean;
};

const smQuery = '(min-width: 640px)';
const mdQuery = '(min-width: 768px)';
const lgQuery = '(min-width: 1024px)';

const mediaQueries = {
  minSm: window.matchMedia(smQuery),
  minMd: window.matchMedia(mdQuery),
  minLg: window.matchMedia(lgQuery),
};

const getBreakpoints = (): BreakPoints => {
  return {
    minSm: mediaQueries.minSm.matches,
    minMd: mediaQueries.minMd.matches,
    minLg: mediaQueries.minLg.matches,
  };
};

export const useResponsive = () => {
  const [breakpoints, setBreakpoints] = useState(() => getBreakpoints());

  useEffect(() => {
    const handleChange = () => {
      setBreakpoints(getBreakpoints());
    };

    Object.values(mediaQueries).forEach((mediaQuery) =>
      mediaQuery.addEventListener('change', handleChange),
    );

    return () => {
      Object.values(mediaQueries).forEach((mediaQuery) =>
        mediaQuery.removeEventListener('change', handleChange),
      );
    };
  }, []);

  return breakpoints;
};
