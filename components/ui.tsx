import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, radius, spacing, typography } from "../theme";
import { callFeedback } from "../lib/haptics";

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
  refresh: "refresh-outline",
  lock: "lock-closed-outline",
  server: "server-outline",
  analytics: "stats-chart-outline",
  key: "key-outline",
  external: "open-outline",
  copy: "copy-outline",
  walk: "walk-outline",
  bus: "bus-outline",
  warning: "warning-outline",
  pin: "location-sharp",
} as const;

export type IconName = keyof typeof ICON_NAMES;
export type Tone = "primary" | "neutral" | "danger" | "success" | "warning" | "info" | "dark";

const TONE_SURFACE: Record<Tone, string> = {
  primary: colors.primaryTint,
  neutral: colors.surfaceAlt,
  danger: colors.dangerSoft,
  success: colors.successSoft,
  warning: colors.warningSoft,
  info: colors.infoSoft,
  dark: colors.ink,
};

const TONE_INK: Record<Tone, string> = {
  primary: colors.primary,
  neutral: colors.inkSoft,
  danger: colors.danger,
  success: colors.success,
  warning: colors.warning,
  info: colors.info,
  dark: colors.white,
};

export function Icon({ name, size = 22, color = colors.inkSoft }: { name: IconName; size?: number; color?: string }) {
  return <Ionicons name={ICON_NAMES[name]} size={size} color={color} />;
}

/** A rounded, tinted square holding a single icon. */
export function IconTile({
  name,
  size = 20,
  tone = "primary",
  round = false,
}: {
  name: IconName;
  size?: number;
  tone?: Tone;
  round?: boolean;
}) {
  return (
    <View style={[styles.iconTile, round && styles.iconTileRound, { backgroundColor: TONE_SURFACE[tone] }]}>
      <Icon name={name} size={size} color={TONE_INK[tone]} />
    </View>
  );
}

/** A small static label in a tinted capsule. */
export function Pill({ label, tone = "neutral", icon }: { label: string; tone?: Tone; icon?: IconName }) {
  return (
    <View style={[styles.pill, { backgroundColor: TONE_SURFACE[tone] }]}>
      {icon ? <Icon name={icon} size={12} color={TONE_INK[tone]} /> : null}
      <Text style={[styles.pillText, { color: TONE_INK[tone] }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Administrative coverage label ("District chapter", "Municipality", …). */
export function LevelBadge({ label, tone = "info" }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.levelBadge, { backgroundColor: TONE_SURFACE[tone] }]}>
      <View style={[styles.levelDot, { backgroundColor: TONE_INK[tone] }]} />
      <Text style={[styles.levelText, { color: TONE_INK[tone] }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: !!active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={styles.sectionActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
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
  size = "md",
  disabled,
}: {
  label: string;
  onPress: () => void;
  fullWidth?: boolean;
  tone?: "primary" | "light";
  size?: "md" | "lg";
  disabled?: boolean;
}) {
  const isLight = tone === "light";
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => callFeedback()}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={[
        styles.callButton,
        size === "lg" && styles.callButtonLg,
        isLight && styles.callButtonLight,
        fullWidth && styles.callButtonFull,
        disabled && styles.disabled,
      ]}
    >
      <Icon name="phone" size={size === "lg" ? 20 : 17} color={isLight ? colors.primary : colors.white} />
      <Text
        style={[styles.callButtonText, size === "lg" && styles.callButtonTextLg, isLight && styles.callButtonTextLight]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function NoticeCard({
  children,
  tone = "warning",
  title,
}: {
  children: React.ReactNode;
  tone?: "warning" | "info" | "danger" | "success";
  title?: string;
}) {
  const palette = {
    warning: { bg: colors.warningSoft, ink: colors.warning, icon: "warning" as IconName },
    info: { bg: colors.infoSoft, ink: colors.info, icon: "info" as IconName },
    danger: { bg: colors.dangerSoft, ink: colors.danger, icon: "alert" as IconName },
    success: { bg: colors.successSoft, ink: colors.success, icon: "check" as IconName },
  }[tone];
  return (
    <View style={[styles.notice, { backgroundColor: palette.bg }]}>
      <Icon name={palette.icon} size={16} color={palette.ink} />
      <View style={styles.noticeBody}>
        {title ? <Text style={[styles.noticeTitle, { color: palette.ink }]}>{title}</Text> : null}
        <Text style={[styles.noticeText, { color: palette.ink }]}>{children}</Text>
      </View>
    </View>
  );
}

export function EmptyState({ message, title, icon = "search" }: { message: string; title?: string; icon?: IconName }) {
  return (
    <View style={styles.empty}>
      <IconTile name={icon} tone="neutral" size={22} round />
      {title ? <Text style={styles.emptyTitle}>{title}</Text> : null}
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export function ScreenTitle({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  return (
    <View style={styles.screenTitleWrap}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.screenTitle}>{title}</Text>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

/** Sanitised text input with a search icon and a one-tap clear button. */
export function SearchField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  onSubmitEditing,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  onSubmitEditing?: () => void;
}) {
  return (
    <View style={styles.searchField}>
      <Icon name="search" size={18} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        style={styles.searchInput}
        accessibilityLabel={accessibilityLabel}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          style={styles.searchClear}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Icon name="close" size={16} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Accessible two/three-way selector. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: { key: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (key: T) => void;
  accessibilityLabel?: string;
}) {
  return (
    <View style={styles.segmented} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[styles.segmentItem, active && styles.segmentItemActive]}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active }}
          >
            {option.icon ? <Icon name={option.icon} size={15} color={active ? colors.white : colors.muted} /> : null}
            <Text style={[styles.segmentText, active && styles.segmentTextActive]} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function StatTile({
  value,
  label,
  icon,
  tone = "primary",
}: {
  value: string;
  label: string;
  icon?: IconName;
  tone?: Tone;
}) {
  return (
    <View style={styles.statTile}>
      {icon ? <IconTile name={icon} size={16} tone={tone} round /> : null}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function InfoRow({
  icon,
  title,
  detail,
  onPress,
  trailing,
}: {
  icon?: IconName;
  title: string;
  detail?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}) {
  const inner = (
    <>
      {icon ? <IconTile name={icon} size={18} /> : null}
      <View style={styles.infoRowBody}>
        <Text style={styles.infoRowTitle}>{title}</Text>
        {detail ? <Text style={styles.infoRowDetail}>{detail}</Text> : null}
      </View>
      {trailing}
    </>
  );
  if (onPress) {
    return (
      <Pressable
        style={styles.infoRow}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {inner}
      </Pressable>
    );
  }
  return <View style={styles.infoRow}>{inner}</View>;
}

export function ActionButton({
  title,
  onPress,
  variant = "primary",
  icon,
  fullWidth,
  disabled,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: IconName;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const ink = variant === "primary" ? colors.white : variant === "ghost" ? colors.primary : colors.inkSoft;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      style={[
        styles.actionButton,
        variant === "primary" && styles.actionButtonPrimary,
        variant === "secondary" && styles.actionButtonSecondary,
        variant === "ghost" && styles.actionButtonGhost,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={ink} /> : null}
      <Text style={[styles.actionButtonText, { color: ink }]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

/**
 * Lays its children out in columns on wide screens and a single stack on
 * phones. Used so card lists fill the extra width of a tablet or the web
 * instead of stretching one card across the whole page.
 */
export function CardGrid({ columns, children }: { columns: number; children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  if (columns <= 1) {
    return <View>{items}</View>;
  }
  return (
    <View style={styles.gridRow}>
      {items.map((child, index) => (
        <View key={index} style={styles.gridCell}>
          {child}
        </View>
      ))}
    </View>
  );
}

export function Divider({ label }: { label?: string }) {
  if (!label) {
    return <View style={styles.divider} />;
  }
  return (
    <View style={styles.dividerLabelRow}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconTile: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTileRound: { borderRadius: radius.pill },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
  },
  pillText: { fontSize: typography.size.xs, fontWeight: typography.weight.bold, letterSpacing: typography.letterSpacing.wide },

  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 1,
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  levelDot: { width: 6, height: 6, borderRadius: 3 },
  levelText: { fontSize: typography.size.xs - 0.5, fontWeight: typography.weight.bold, letterSpacing: typography.letterSpacing.wide },

  chip: {
    minHeight: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing.lg - 2,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.inkSoft, borderColor: colors.inkSoft },
  chipText: { color: colors.neutral, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  chipTextActive: { color: colors.white },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: spacing.md - 2,
    marginTop: spacing.xs,
  },
  sectionHeading: { flex: 1 },
  sectionTitle: { color: colors.ink, fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  sectionSubtitle: { color: colors.muted, fontSize: typography.size.sm, marginTop: spacing.xs, lineHeight: typography.lineHeight.sm },
  sectionActionPress: { minHeight: 44, justifyContent: "center", paddingLeft: spacing.md },
  sectionAction: { color: colors.primary, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },

  callButton: {
    minHeight: 48,
    flexDirection: "row",
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  callButtonLg: { minHeight: 64, borderRadius: radius.lg, gap: spacing.md },
  callButtonLight: { backgroundColor: colors.white },
  callButtonFull: { width: "100%" },
  callButtonText: { color: colors.white, fontSize: typography.size.md, fontWeight: typography.weight.bold },
  callButtonTextLg: { fontSize: typography.size.lg + 1, fontWeight: typography.weight.black, letterSpacing: typography.letterSpacing.tight },
  callButtonTextLight: { color: colors.primary },

  notice: {
    flexDirection: "row",
    gap: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: "flex-start",
  },
  noticeBody: { flex: 1 },
  noticeTitle: { fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: spacing.xxs },
  noticeText: { fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm },

  empty: { alignItems: "center", paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyTitle: { color: colors.inkSoft, fontSize: typography.size.md, fontWeight: typography.weight.bold },
  emptyText: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, textAlign: "center", maxWidth: 280 },

  screenTitleWrap: { marginBottom: spacing.lg - 2 },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
    marginBottom: spacing.xs + 2,
  },
  screenTitle: { color: colors.ink, fontSize: typography.size.xxl, fontWeight: typography.weight.black, letterSpacing: typography.letterSpacing.tight },
  screenSubtitle: { color: colors.muted, fontSize: typography.size.sm + 0.5, lineHeight: typography.lineHeight.md, marginTop: spacing.sm },

  searchField: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  searchInput: { flex: 1, minHeight: 50, paddingHorizontal: spacing.sm, color: colors.inkSoft, fontSize: typography.size.md },
  searchClear: { width: 32, height: 32, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },

  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  segmentItem: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    gap: spacing.xs + 2,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemActive: { backgroundColor: colors.inkSoft },
  segmentText: { color: colors.muted, fontSize: typography.size.sm + 0.5, fontWeight: typography.weight.bold },
  segmentTextActive: { color: colors.white },

  statTile: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  statValue: { color: colors.ink, fontSize: typography.size.xl, fontWeight: typography.weight.black },
  statLabel: { color: colors.muted, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, textAlign: "center" },

  infoRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm,
  },
  infoRowBody: { flex: 1 },
  infoRowTitle: { color: colors.inkSoft, fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  infoRowDetail: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginTop: spacing.xxs },

  actionButton: {
    minHeight: 46,
    flexDirection: "row",
    gap: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  actionButtonPrimary: { backgroundColor: colors.primary },
  actionButtonSecondary: { backgroundColor: colors.surfaceAlt },
  actionButtonGhost: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong },
  actionButtonText: { fontSize: typography.size.md, fontWeight: typography.weight.bold },
  fullWidth: { width: "100%" },
  disabled: { opacity: 0.5 },

  gridRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  gridCell: { flexGrow: 1, flexBasis: "44%", minWidth: 300 },

  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerLabelRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  dividerText: { color: colors.faint, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, letterSpacing: typography.letterSpacing.wide },
});
