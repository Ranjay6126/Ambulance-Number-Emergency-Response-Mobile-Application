import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing, typography } from "../theme";
import { Icon, IconTile, LevelBadge, type Tone } from "./ui";
import { listingLevelLabel, listingLocation, listingNote, type AmbLevel, type AmbulanceListing } from "../ambulanceDirectory";

type Props = {
  item: AmbulanceListing;
  onCall: (phone: string) => void;
  onDirections: (item: AmbulanceListing) => void;
  onOpenSource: (url: string) => void;
};

/** Colour of the coverage badge for each administrative level. */
const LEVEL_TONE: Record<AmbLevel, Tone> = {
  national: "danger",
  province: "info",
  district: "info",
  municipality: "success",
  city: "success",
  hospital: "warning",
  community: "neutral",
};

export function AmbulanceCard({ item, onCall, onDirections, onOpenSource }: Props) {
  const level = listingLevelLabel(item);
  const tone: Tone = item.level ? LEVEL_TONE[item.level] : "neutral";

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <IconTile name="ambulance" tone="primary" size={20} />
        <View style={styles.headText}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location} numberOfLines={1}>
            {listingLocation(item)}
          </Text>
        </View>
        {level ? <LevelBadge label={level} tone={tone} /> : null}
      </View>

      <Text style={styles.note} numberOfLines={2}>
        {listingNote(item)}
      </Text>

      <View style={styles.phones}>
        {item.phones.map((phone) => (
          <Pressable
            key={phone}
            onPress={() => onCall(phone)}
            style={styles.phoneRow}
            accessibilityRole="button"
            accessibilityLabel={`Call ${item.name} at ${phone}`}
          >
            <View style={styles.phoneIcon}>
              <Icon name="phone" size={15} color={colors.primary} />
            </View>
            <Text style={styles.phoneNumber}>{phone}</Text>
            <Text style={styles.phoneAction}>Call</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.routeBtn}
          onPress={() => onDirections(item)}
          accessibilityRole="button"
          accessibilityLabel={`Road directions to ${item.name} in ${item.district}`}
        >
          <Icon name="navigate" size={15} color={colors.inkSoft} />
          <Text style={styles.routeText}>Route</Text>
        </Pressable>
        <Pressable
          style={styles.sourceBtn}
          onPress={() => onOpenSource(item.source.url)}
          accessibilityRole="link"
          accessibilityLabel={`Open source page: ${item.source.name}`}
        >
          <Icon name="external" size={14} color={colors.link} />
          <Text style={styles.sourceText} numberOfLines={1}>
            Source: {item.source.name}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg - 2,
    marginBottom: spacing.sm + 2,
    ...shadow.card,
  },
  head: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  headText: { flex: 1 },
  name: { color: colors.ink, fontSize: typography.size.md, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.md },
  location: { color: colors.muted, fontSize: typography.size.sm, marginTop: 3 },
  note: { color: colors.faint, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginTop: spacing.sm + 2 },

  phones: { gap: spacing.sm, marginTop: spacing.md },
  phoneRow: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.md,
  },
  phoneIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  phoneNumber: { flex: 1, color: colors.primaryDark, fontSize: typography.size.lg, fontWeight: typography.weight.black, letterSpacing: 0.4 },
  phoneAction: { color: colors.primary, fontSize: typography.size.sm, fontWeight: typography.weight.bold },

  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  routeBtn: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.lg,
  },
  routeText: { color: colors.inkSoft, fontSize: typography.size.sm, fontWeight: typography.weight.bold },
  sourceBtn: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing.md,
  },
  sourceText: { flex: 1, color: colors.link, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
});
