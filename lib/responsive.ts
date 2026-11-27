import { useWindowDimensions } from "react-native";
import { spacing } from "../theme";

/**
 * One place that decides how the UI adapts to the screen it is drawn on.
 *
 * Phones get a single, comfortable column; tablets and the web get a wider,
 * centred column with bigger gutters, and the lists can split into two
 * columns. Everything is derived from the live window width, so rotating the
 * device or resizing the browser re-lays the app out immediately.
 */

export const BREAKPOINT = {
  /** Below this the layout is treated as a phone. */
  medium: 700,
  /** At or above this the layout can show two columns and a side rail. */
  wide: 1000,
} as const;

export type Layout = {
  width: number;
  height: number;
  /** Phone-sized viewport. */
  isCompact: boolean;
  /** Tablet / small desktop viewport. */
  isMedium: boolean;
  /** Large tablet / desktop viewport. */
  isWide: boolean;
  /** How many card columns the content area can hold. */
  columns: number;
  /** Horizontal page gutter. */
  gutter: number;
  /** Widest the readable content column is allowed to get. */
  contentMaxWidth: number;
};

/** Pure mapping from a viewport size to the layout it should use. */
export function layoutFor(width: number, height = 0): Layout {
  const isWide = width >= BREAKPOINT.wide;
  const isMedium = width >= BREAKPOINT.medium;
  return {
    width,
    height,
    isCompact: !isMedium,
    isMedium,
    isWide,
    columns: isWide ? 2 : 1,
    gutter: isWide ? spacing.xxl + spacing.sm : isMedium ? spacing.xxl : spacing.xl,
    contentMaxWidth: isWide ? 1120 : isMedium ? 840 : 720,
  };
}

/** Live layout for the current window. */
export function useResponsive(): Layout {
  const { width, height } = useWindowDimensions();
  return layoutFor(width, height);
}

/**
 * Centred, width-limited content container. Spread it after a screen's base
 * page style so the gutter and max width win over the defaults.
 */
export function pageContainer(layout: Layout) {
  return {
    width: "100%" as const,
    maxWidth: layout.contentMaxWidth,
    alignSelf: "center" as const,
    paddingHorizontal: layout.gutter,
  };
}
