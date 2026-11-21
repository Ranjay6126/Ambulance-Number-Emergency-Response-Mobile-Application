import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../theme";
import { Icon } from "./ui";
import {
  listingLevelLabel,
  listingLocation,
  listingNote,
  primaryPhone,
  type AmbulanceListing,
} from "../ambulanceDirectory";

type Props = {
  item: AmbulanceListing;
  onCall: (phone: string) => void;
  onDirections: (item: AmbulanceListing) => void;
  onOpenSource: (url: string) => void;
};

export function AmbulanceCard({ item, onCall, onDirections, onOpenSource }: Props) {
  const level = listingLevelLabel(item);
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.badge}>
          <Text style={styles.badgeMark}>+</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.area ? `${item.area} · ` : ""}
            {item.district} · {item.province}
          </Text>
          {level ? (
            <View style={styles.levelPill}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.note}>{listingNote(item)}</Text>

      <View style={styles.phones}>
        {item.phones.map((phone) => (
          <Pressable
            key={phone}
            onPress={() => onCall(phone)}
            style={styles.phonePill}
            accessibilityRole="button"
            accessibilityLabel={`Call ${item.name} at ${phone}`}
          >
            <Icon name="phone" size={14} color={colors.primary} />
            <Text style={styles.phoneText}>{phone}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionGhost}
          onPress={() => onDirections(item)}
          accessibilityRole="button"
          accessibilityLabel={`Road directions to ${item.name}`}
        >
          <Icon name="navigate" size={15} color={colors.inkSoft} />
          <Text style={styles.actionGhostText}>Route</Text>
        </Pressable>
        <Pressable
          style={styles.actionPrimary}
          onPress={() => onCall(primaryPhone(item))}
          accessibilityRole="button"
          accessibilityLabel={`Call ${item.name}`}
        >
          <Icon name="phone" size={15} color={colors.white} />
          <Text style={styles.actionPrimaryText}>Call now</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => onOpenSource(item.source.url)} accessibilityRole="link">
        <Text style={styles.source} numberOfLines={1}>
          Source: {item.source.name}
        </Text>
      </Pressable>
      <Text style={styles.verifyHint}>Matches your route: {listingLocation(item)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  top: { flexDirection: "row", alignItems: "flex-start" },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeMark: { color: colors.primary, fontSize: 22, fontWeight: "900", lineHeight: 24 },
  head: { flex: 1 },
  name: { color: colors.inkSoft, fontSize: 14, fontWeight: "800" },
  meta: { color: colors.muted, fontSize: 11, marginTop: 3 },
  levelPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginTop: 6,
  },
  levelText: { color: colors.inkSoft, fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  note: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 10 },

  phones: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  phonePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  phoneText: { color: colors.primary, fontSize: 12.5, fontWeight: "800" },

  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  actionGhost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    minHeight: 38,
  },
  actionGhostText: { color: colors.inkSoft, fontSize: 12.5, fontWeight: "800" },
  actionPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    minHeight: 38,
  },
  actionPrimaryText: { color: colors.white, fontSize: 12.5, fontWeight: "800" },

  source: { color: colors.link, fontSize: 11, fontWeight: "700", marginTop: 10 },
  verifyHint: { color: colors.faint, fontSize: 10, marginTop: 4 },
});
