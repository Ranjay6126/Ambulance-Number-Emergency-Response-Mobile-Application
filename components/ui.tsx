import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, radius } from "../theme";

/** Semantic icon names mapped onto the Ionicons set so screens stay readable. */
const ICON_NAMES = {
  home: "home-outline",
  ambulance: "medkit-outline",
  map: "map-outline",
  profile: "person-outline",
  phone: "call-outline",
  location: "location-outline",
  search: "search-outline",
  close: "close",
  clock: "time-outline",
  shield: "shield-checkmark-outline",
  chevron: "chevron-forward",
  navigate: "navigate-outline",
  hospital: "business-outline",
  alert: "alert-circle-outline",
  info: "information-circle-outline",
  list: "list-outline",
  grid: "grid-outline",
  globe: "globe-outline",
  check: "checkmark-circle-outline",
  heart: "heart-outline",
  car: "car-outline",
  traffic: "trail-sign-outline",
} as const;

export type IconName = keyof typeof ICON_NAMES;

export function Icon({ name, size = 22, color = colors.inkSoft }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={ICON_NAMES[name]} size={size} color={color} />;
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button">
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function CallButton({
  label,
  onPress,
  fullWidth,
  tone = "primary",
}: {
  label: string;
  onPress: () => void;
  fullWidth?: boolean;
  tone?: "primary" | "light";
}) {
  const isLight = tone === "light";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.callButton, isLight && styles.callButtonLight, fullWidth && styles.callButtonFull]}
    >
      <Icon name="phone" size={17} color={isLight ? colors.primary : colors.white} />
      <Text style={[styles.callButtonText, isLight && styles.callButtonTextLight]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function NoticeCard({ children, tone = "warning" }: { children: React.ReactNode; tone?: "warning" | "info" }) {
  const isInfo = tone === "info";
  return (
    <View style={[styles.notice, isInfo ? styles.noticeInfo : styles.noticeWarning]}>
      <Icon name="info" size={16} color={isInfo ? colors.link : colors.warning} />
      <Text style={[styles.noticeText, isInfo ? styles.noticeTextInfo : styles.noticeTextWarning]}>{children}</Text>
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Icon name="search" size={26} color={colors.faint} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.screenTitle}>{title}</Text>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#E5EAF1",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.inkSoft, borderColor: colors.inkSoft },
  chipText: { color: "#657287", fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: colors.white },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  sectionAction: { color: colors.primary, fontSize: 12, fontWeight: "700" },

  callButton: {
    minHeight: 46,
    flexDirection: "row",
    gap: 8,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  callButtonLight: { backgroundColor: colors.white },
  callButtonFull: { width: "100%" },
  callButtonText: { color: colors.white, fontSize: 14, fontWeight: "800" },
  callButtonTextLight: { color: colors.primary },

  notice: {
    flexDirection: "row",
    gap: 8,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  noticeWarning: { backgroundColor: colors.warningSoft },
  noticeInfo: { backgroundColor: "#EAF2FB" },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18 },
  noticeTextWarning: { color: colors.warning },
  noticeTextInfo: { color: "#1E4E7F" },

  empty: { alignItems: "center", paddingVertical: 26, gap: 8 },
  emptyText: { color: colors.muted, fontSize: 13, textAlign: "center" },

  screenTitle: { color: colors.ink, fontSize: 23, fontWeight: "800", letterSpacing: -0.4 },
  screenSubtitle: { color: colors.muted, fontSize: 12.5, lineHeight: 19, marginTop: 6 },
});
