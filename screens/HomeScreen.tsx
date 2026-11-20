import React from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { LocationObjectCoords } from "expo-location";
import { colors, radius, shadow } from "../theme";
import { AmbulanceCard } from "../components/AmbulanceCard";
import { CallButton, Icon, NoticeCard, SectionHeader, type IconName } from "../components/ui";
import type { Tab } from "../lib/tabs";
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

/** The three short codes people reach for most often after the ambulance line. */
const QUICK_CODES = ["100", "101", "103"];

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
  const nearbyPreview = ambulanceDirectory.slice(0, 3);
  const origin = coordsToOrigin(location);
  const nearby = findNearbyArea(location);

  const routeTo = (item: AmbulanceListing) =>
    openMapsDirections({ destination: listingLocation(item), origin });

  const locationText = isLocating
    ? "Finding your location..."
    : nearby
      ? `${nearby.district}, ${nearby.province} · about ${formatDistance(nearby.distanceKm)} away`
      : locationDenied
        ? "Location off — tap to allow"
        : "Tap to share your location";

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Pressable
        style={styles.locationCard}
        onPress={onFindLocation}
        accessibilityRole="button"
        accessibilityLabel="Find my current location"
      >
        <View style={styles.locationIcon}>
          <Icon name="location" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.locationLabel}>{nearby ? "YOUR AREA" : "LOCATION"}</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {locationText}
          </Text>
        </View>
        <Icon name="navigate" size={18} color={location ? colors.success : colors.faint} />
      </Pressable>

      <View style={styles.hero}>
        <View style={styles.heroPulse}>
          <Icon name="ambulance" size={30} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Need an ambulance?</Text>
        <Text style={styles.heroText}>
          Call Nepal's toll-free national ambulance number. It works from any phone with no balance and no area code.
        </Text>
        <CallButton
          label={`Call ${nationalAmbulanceNumber} · Ambulance`}
          onPress={() => callPhone(nationalAmbulanceNumber)}
          tone="light"
          fullWidth
        />
        <View style={styles.quickCodes}>
          {QUICK_CODES.map((code) => (
            <Pressable
              key={code}
              style={styles.quickCode}
              onPress={() => callPhone(code)}
              accessibilityRole="button"
              accessibilityLabel={`Call ${code}`}
            >
              <Text style={styles.quickCodeNumber}>{code}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.quickCodeHint}>Police 100 · Fire 101 · Traffic 103</Text>
      </View>

      <View style={styles.alertRow}>
        <Icon name="alert" size={16} color={colors.primary} />
        <Text style={styles.alertText}>
          Tell them your location first — a call that drops after that still gets help moving.
        </Text>
      </View>

      {isLocating && !nearby ? (
        <View style={styles.stateCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>Checking the ambulance numbers for your area...</Text>
        </View>
      ) : null}

      {locationDenied && !isLocating ? (
        <Pressable
          style={styles.permissionCard}
          onPress={onFindLocation}
          accessibilityRole="button"
          accessibilityLabel="Allow location access"
        >
          <Icon name="location" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.permissionTitle}>Allow location to see numbers near you</Text>
            <Text style={styles.permissionText}>
              SwiftCare only uses your location to work out which district you are in, then shows the ambulance
              numbers published for that area. Tap to allow.
            </Text>
          </View>
        </Pressable>
      ) : null}

      {nearby ? (
        <>
          <SectionHeader
            title={`Ambulance near you · ${nearby.district}`}
            actionLabel="All areas"
            onAction={() => onNavigate("Directory")}
          />
          <Text style={styles.nearbyNote}>
            {nearby.listings.some((item) => item.level !== "district")
              ? "This is the district closest to you. Local lines come first, followed by the district Red Cross chapter that also covers its villages and municipalities."
              : "This is the district closest to you. The Red Cross district chapter is the published line that covers its cities, municipalities and villages."}
          </Text>
          {nearby.listings.map((item) => (
            <AmbulanceCard
              key={item.id}
              item={item}
              onCall={callPhone}
              onDirections={routeTo}
              onOpenSource={(url) => openUrl(url, "Unable to open the source page")}
            />
          ))}
        </>
      ) : (
        <>
          <SectionHeader
            title="Published ambulance contacts"
            actionLabel="See all"
            onAction={() => onNavigate("Directory")}
          />
          {nearbyPreview.map((item) => (
            <AmbulanceCard
              key={item.id}
              item={item}
              onCall={callPhone}
              onDirections={routeTo}
              onOpenSource={(url) => openUrl(url, "Unable to open the source page")}
            />
          ))}
        </>
      )}

      <SectionHeader title="Quick access" />
      <View style={styles.quickGrid}>
        <QuickAction icon="list" title="Directory" onPress={() => onNavigate("Directory")} />
        <QuickAction icon="map" title="Road routes" onPress={() => onNavigate("Routes")} />
        <QuickAction
          icon="globe"
          title="All helplines"
          onPress={() => onNavigate("Directory")}
        />
        <QuickAction
          icon="shield"
          title="Safety tips"
          onPress={() =>
            Alert.alert(
              "Before you call",
              "1. Stay calm and speak slowly.\n2. Give the exact location or nearest landmark.\n3. Describe the patient's condition and age.\n4. Keep the line open until the operator ends the call.",
            )
          }
        />
      </View>

      <NoticeCard>
        {`Every district of Nepal is covered. Your own district's numbers are listed above once location is allowed. Villages and wards rarely publish their own ambulance line, so the district Red Cross chapter and the national code ${nationalAmbulanceNumber} are the numbers that reach them. Numbers can change — confirm availability when you call.`}
      </NoticeCard>

      <Text style={styles.footerNote}>
        Sources: {emergencyNumbers[0].source.name}, {emergencyNumbers[6].source.name} and public provider pages.
      </Text>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  title,
  onPress,
}: {
  icon: IconName;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress} accessibilityRole="button">
      <View style={styles.quickIcon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.quickText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 28 },
  locationCard: {
    minHeight: 68,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationLabel: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  locationText: { color: colors.inkSoft, fontSize: 14, fontWeight: "700", marginTop: 4 },

  hero: {
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 26,
    marginBottom: 14,
    ...shadow.raised,
  },
  heroPulse: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: { color: colors.white, fontSize: 21, fontWeight: "900", letterSpacing: -0.4 },
  heroText: {
    color: "#FFE5E7",
    fontSize: 11.5,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 16,
  },
  quickCodes: { flexDirection: "row", gap: 10, marginTop: 14 },
  quickCode: {
    minWidth: 66,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  quickCodeNumber: { color: colors.white, fontSize: 17, fontWeight: "900", letterSpacing: 0.5 },
  quickCodeHint: { color: "#FFD9DC", fontSize: 10.5, marginTop: 10, fontWeight: "600" },

  alertRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginBottom: 18,
  },
  alertText: { flex: 1, color: colors.inkSoft, fontSize: 11.5, lineHeight: 17 },

  stateCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  stateText: { flex: 1, color: colors.inkSoft, fontSize: 12, fontWeight: "600" },

  permissionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 18,
  },
  permissionTitle: { color: colors.inkSoft, fontSize: 12.5, fontWeight: "800" },
  permissionText: { color: colors.inkSoft, fontSize: 11, lineHeight: 16, marginTop: 4 },

  nearbyNote: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: -6, marginBottom: 12 },

  quickGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  quickAction: {
    width: "23%",
    height: 86,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEF0F5",
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickText: { color: "#5E6677", fontSize: 9.5, fontWeight: "700", textAlign: "center" },

  footerNote: { color: colors.faint, fontSize: 10, lineHeight: 15, marginTop: 4 },
});
