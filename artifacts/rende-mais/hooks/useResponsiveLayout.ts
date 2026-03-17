import { useWindowDimensions } from 'react-native';

const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const;

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    /** Max content width for the centered container */
    contentMaxWidth: isDesktop ? 960 : isTablet ? 720 : undefined,
    /** Number of columns for the home OfferCard grid */
    cardColumns: isDesktop ? 3 : 1,
  } as const;
}
