/**
 * Shared design tokens for SwiftCare.
 * Keeping colours, radii and spacing in one place keeps every screen consistent.
 */

export const colors = {
  background: "#F4F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF2F7",
  border: "#E9EDF3",
  borderSoft: "#EEF0F5",

  ink: "#17243A",
  inkSoft: "#26364E",
  muted: "#8792A4",
  faint: "#A0A9B7",

  primary: "#D92735",
  primaryDark: "#A71D2A",
  primarySoft: "#FDEBED",
  primaryTint: "#FFF0F0",

  success: "#2D8A68",
  successSoft: "#E7F5EF",

  warning: "#8A5B0F",
  warningSoft: "#FFF4DD",

  link: "#2563A6",
  white: "#FFFFFF",
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 18,
  xl: 26,
  pill: 999,
} as const;

export const shadow = {
  raised: {
    shadowColor: "#A71D2A",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;
