/**
 * Shared design tokens for SwiftCare.
 *
 * One restrained medical/emergency system: a calm neutral surface ramp, a
 * single clear red reserved for emergency actions, and supporting semantic
 * colours. Everything is a plain `as const` object so it can be spread straight
 * into StyleSheet.create with no runtime dependencies.
 */

export const colors = {
  // Surfaces & lines
  background: "#F4F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF2F7",
  surfaceSunken: "#E4EAF3",
  border: "#E9EDF3",
  borderSoft: "#EEF0F5",
  borderStrong: "#D5DDE9",

  // Neutral text ramp (dark → light)
  ink: "#17243A",
  inkSoft: "#26364E",
  neutral: "#5E6677",
  muted: "#8792A4",
  faint: "#A0A9B7",
  neutralLight: "#C9CED8",

  // Brand / emergency red
  primary: "#D92735",
  primaryDark: "#A71D2A",
  primarySoft: "#FDEBED",
  primaryTint: "#FFF0F0",
  brand: "#D92735",
  brandDark: "#A71D2A",
  emergency: "#D92735",

  // Semantic
  danger: "#C81E2B",
  dangerSoft: "#FDEBED",
  success: "#2D8A68",
  successSoft: "#E7F5EF",
  warning: "#8A5B0F",
  warningSoft: "#FFF4DD",
  info: "#2563A6",
  infoSoft: "#EAF2FB",
  link: "#2563A6",

  // Base
  overlay: "rgba(23, 36, 58, 0.45)",
  white: "#FFFFFF",
  black: "#0B1220",
} as const;

/** A single spacing scale (4pt grid) so padding and gaps stay consistent. */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const radius = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 26,
  pill: 999,
} as const;

/** Type scale: sizes, line heights, weights and tracking. */
export const typography = {
  size: {
    xs: 10.5,
    sm: 12,
    md: 13.5,
    lg: 16,
    xl: 20,
    xxl: 25,
    hero: 34,
  },
  lineHeight: {
    xs: 15,
    sm: 17,
    md: 19,
    lg: 22,
    xl: 26,
    xxl: 31,
  },
  weight: {
    regular: "400",
    medium: "600",
    semibold: "700",
    bold: "800",
    black: "900",
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    wide: 0.3,
    wider: 1.2,
  },
} as const;

/** Elevation levels. `raised` is the original brand-tinted hero shadow. */
export const shadow = {
  card: {
    shadowColor: "#17243A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: "#A71D2A",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sheet: {
    shadowColor: "#17243A",
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
} as const;

/** The elevation set under a friendlier name. */
export const elevation = shadow;
