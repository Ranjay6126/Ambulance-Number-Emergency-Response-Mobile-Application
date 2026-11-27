import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { LocationObjectCoords } from "expo-location";
import { colors, radius, shadow, spacing, typography } from "../theme";
import { AmbulanceCard } from "../components/AmbulanceCard";
import { ActionButton, CallButton, CardGrid, Icon, IconTile, NoticeCard, Pill, SectionHeader } from "../components/ui";
import type { Tab } from "../lib/tabs";
import { pageContainer, useResponsive } from "../lib/responsive";
import { callPhone, coordsToOrigin, openMapsDirections, openUrl } from "../lib/links";
import {
  ambulanceDirectory,
  emergencyNumbers,
  findNearbyArea,
  listingLocation,
  nationalAmbulanceNumber,
  type AmbulanceListing,
} from "../ambulanceDirectory";

type Props = {
  location: LocationObjectCoords | null;
  isLocating: boolean;
  locationDenied: boolean;
  onFindLocation: () => void;
  onNavigate: (tab: Tab) => void;
};

/** Every national short code except the ambulance line, which gets the hero. */
const QUICK_NUMBERS = emergencyNumbers.filter((entry) => entry.number !== nationalAmbulanceNumber);

function formatDistance(km: number): string {
  if (km < 1) {
    return "less than 1 km";
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

export function HomeScreen({ location, isLocating, locationDenied, onFindLocation, onNavigate }: Props) {
  const layout = useResponsive();
  const origin = coordsToOrigin(location);
  const nearby = findNearbyArea(location);
  const preview = ambulanceDirectory.slice(0, 2);

  const routeTo = (item: AmbulanceListing) => openMapsDirections({ destination: listingLocation(item), origin });

  return (
    <ScrollView contentContainerStyle={[styles.page, pageContainer(layout)]} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Icon name="ambulance" size={30} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Need an ambulance?</Text>
        <Text style={styles.heroText}>
          Call Nepal's toll-free national ambulance number. It works from any phone, with no balance and no area code.
        </Text>
        <CallButton
          label={`Call ${nationalAmbulanceNumber} · Ambulance`}
          onPress={() => callPhone(nationalAmbulanceNumber)}
          tone="light"
          size="lg"
          fullWidth
        />
        <Text style={styles.heroHint}>Free · 24 hours · nationwide</Text>
      </View>

      <SectionHeader title="Quick dial" subtitle="Other nationwide emergency lines" />
      <View style={styles.quickGrid}>
        {QUICK_NUMBERS.map((entry) => (
          <Pressable
            key={entry.id}
            style={styles.quickTile}
            onPress={() => callPhone(entry.number)}
            accessibilityRole="button"
            accessibilityLabel={`Call ${entry.label} on ${entry.number}`}
          >
            <Text style={styles.quickNumber}>{entry.number}</Text>
            <Text style={styles.quickLabel} numberOfLines={2}>
              {entry.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.tipRow}>
        <Icon name="alert" size={16} color={colors.primary} />
        <Text style={styles.tipText}>
          Say your location first — a call that drops after that still gets help moving.
        </Text>
      </View>

      <SectionHeader
        title="Ambulance near you"
        actionLabel="All providers"
        onAction={() => onNavigate("Directory")}
      />

      {isLocating && !nearby ? (
        <View style={styles.stateCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>Finding the ambulance numbers for your district…</Text>
        </View>
      ) : null}

      {locationDenied && !nearby && !isLocating ? (
        <Pressable
          style={styles.promptCard}
          onPress={onFindLocation}
          accessibilityRole="button"
          accessibilityLabel="Allow location access to see ambulance numbers near you"
        >
          <IconTile name="location" tone="primary" />
          <View style={styles.promptBody}>
            <Text style={styles.promptTitle}>Allow location to see numbers near you</Text>
            <Text style={styles.promptText}>
              SwiftCare only uses your position to work out which district you are in. Tap to allow access again.
            </Text>
          </View>
          <Pill label="Allow" tone="primary" />
        </Pressable>
      ) : null}

      {!nearby && !isLocating && !locationDenied ? (
        <Pressable
          style={styles.promptCard}
          onPress={onFindLocation}
          accessibilityRole="button"
          accessibilityLabel="Share your location to see ambulance numbers near you"
        >
          <IconTile name="location" tone="primary" />
          <View style={styles.promptBody}>
            <Text style={styles.promptTitle}>Share your location</Text>
            <Text style={styles.promptText}>
              We will show the ambulance numbers published for the district you are in.
            </Text>
          </View>
          <Icon name="chevron" size={18} color={colors.faint} />
        </Pressable>
      ) : null}

      {nearby ? (
        <>
          <View style={styles.districtRow}>
            <Pill label={`${nearby.district} · ${nearby.province}`} tone="info" icon="pin" />
            <Text style={styles.distanceText}>about {formatDistance(nearby.distanceKm)} away</Text>
          </View>
          <Text style={styles.nearbyNote}>
            Local lines come first, followed by the district Red Cross chapter that also covers its villages and
            municipalities.
          </Text>
          <CardGrid columns={layout.columns}>
            {nearby.listings.map((item) => (
              <AmbulanceCard
                key={item.id}
                item={item}
                onCall={callPhone}
                onDirections={routeTo}
                onOpenSource={(url) => openUrl(url, "Unable to open the source page")}
              />
            ))}
          </CardGrid>
        </>
      ) : null}

      {!nearby && isLocating === false && locationDenied === false ? (
        <>
          <SectionHeader title="Published ambulance contacts" actionLabel="See all" onAction={() => onNavigate("Directory")} />
          <CardGrid columns={layout.columns}>
            {preview.map((item) => (
              <AmbulanceCard
                key={item.id}
                item={item}
                onCall={callPhone}
                onDirections={routeTo}
                onOpenSource={(url) => openUrl(url, "Unable to open the source page")}
              />
            ))}
          </CardGrid>
        </>
      ) : null}

      <View style={styles.exploreRow}>
        <ActionButton
          title="Browse providers"
          icon="list"
          variant="secondary"
          onPress={() => onNavigate("Directory")}
        />
        <ActionButton
          title="Plan a route"
          icon="map"
          variant="secondary"
          onPress={() => onNavigate("Routes")}
        />
      </View>

      <NoticeCard tone="info" title={`Every district covered`}>
        {`All 77 districts of Nepal have a published Nepal Red Cross Society chapter line. Where a village or ward publishes no number of its own, its district chapter or the national code ${nationalAmbulanceNumber} reaches it. Numbers can change — confirm availability when you call.`}
      </NoticeCard>

      <View style={styles.privacyRow}>
        <Icon name="lock" size={15} color={colors.faint} />
        <Text style={styles.privacyText}>
          Your position is rounded to the district, stays on this device and is never stored.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: spacing.xl, paddingTop: spacing.xs, paddingBottom: spacing.xxl },

  hero: {
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingHorizontal: spacing.xl + 2,
    paddingVertical: spacing.xxl,
    marginBottom: spacing.sm,
    ...shadow.raised,
  },
  heroBadge: {
    width: 62,
    height: 62,
    borderRadius: radius.xl - 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  heroTitle: { color: colors.white, fontSize: typography.size.xl + 1, fontWeight: typography.weight.black, letterSpacing: typography.letterSpacing.tight },
  heroText: {
    color: "#FFE5E7",
    fontSize: typography.size.sm + 0.5,
    lineHeight: typography.lineHeight.md,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  heroHint: { color: "#FFD9DC", fontSize: typography.size.xs, marginTop: spacing.md, fontWeight: typography.weight.semibold, letterSpacing: typography.letterSpacing.wide },

  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  quickTile: {
    flexGrow: 1,
    flexBasis: "30%",
    minHeight: 68,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  quickNumber: { color: colors.primary, fontSize: typography.size.xl, fontWeight: typography.weight.black, letterSpacing: 0.5 },
  quickLabel: { color: colors.neutral, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, textAlign: "center" },

  tipRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.lg,
  },
  tipText: { flex: 1, color: colors.inkSoft, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm },

  stateCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg - 2,
    paddingVertical: spacing.lg - 2,
    marginBottom: spacing.lg,
  },
  stateText: { flex: 1, color: colors.inkSoft, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },

  promptCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    paddingHorizontal: spacing.lg - 2,
    paddingVertical: spacing.lg - 2,
    marginBottom: spacing.lg,
  },
  promptBody: { flex: 1 },
  promptTitle: { color: colors.inkSoft, fontSize: typography.size.md, fontWeight: typography.weight.bold },
  promptText: { color: colors.inkSoft, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginTop: spacing.xs + 1 },

  districtRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  distanceText: { color: colors.neutral, fontSize: typography.size.sm, fontWeight: typography.weight.bold },
  nearbyNote: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginBottom: spacing.md },

  exploreRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.lg },

  privacyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
  },
  privacyText: { flex: 1, color: colors.faint, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm },
});
