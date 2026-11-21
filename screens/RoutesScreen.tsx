import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { LocationObjectCoords } from "expo-location";
import { colors, radius, shadow } from "../theme";
import { Icon, NoticeCard, ScreenTitle } from "../components/ui";
import type { TravelMode } from "../lib/links";
import { callPhone, coordsToOrigin, mapsDirectionsUrl, openMapsSearch, openUrl } from "../lib/links";
import { ambulanceDirectory, listingLocation, type AmbulanceListing } from "../ambulanceDirectory";

type Props = {
  location: LocationObjectCoords | null;
  isLocating: boolean;
  onFindLocation: () => void;
};

const MODES: { key: TravelMode; label: string; icon: "car" | "navigate" | "clock" }[] = [
  { key: "driving", label: "Ambulance / car", icon: "car" },
  { key: "walking", label: "Walking", icon: "navigate" },
  { key: "transit", label: "Public transport", icon: "clock" },
];

export function RoutesScreen({ location, isLocating, onFindLocation }: Props) {
  const [mode, setMode] = useState<TravelMode>("driving");
  const [originText, setOriginText] = useState("");
  const [destination, setDestination] = useState("");

  const detectedOrigin = coordsToOrigin(location);
  const effectiveOrigin = originText.trim() || detectedOrigin;

  const suggestions = useMemo(() => {
    const needle = destination.trim().toLowerCase();
    const pool = needle
      ? ambulanceDirectory.filter((item) =>
          `${item.name} ${item.district} ${item.province} ${item.area ?? ""}`.toLowerCase().includes(needle),
        )
      : ambulanceDirectory;
    return pool.slice(0, 6);
  }, [destination]);

  const openRoute = () => {
    if (!destination.trim()) {
      Alert.alert("Add a destination", "Type or pick a hospital, provider or place first.");
      return;
    }
    openUrl(
      mapsDirectionsUrl({ destination: destination.trim(), origin: effectiveOrigin, travelMode: mode }),
      "Unable to open maps",
    );
  };

  const useSuggestion = (item: AmbulanceListing) => setDestination(listingLocation(item));

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <ScreenTitle
        title="Road routes & maps"
        subtitle="Plan a road route to a hospital or ambulance provider. Routes open in Google Maps so you see live roads, one-way streets and traffic."
      />

      <View style={styles.originCard}>
        <View style={styles.originHead}>
          <View style={styles.dot} />
          <Text style={styles.originLabel}>STARTING POINT</Text>
          <Pressable onPress={onFindLocation} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.originAction}>{isLocating ? "Locating..." : "Use my location"}</Text>
          </Pressable>
        </View>
        <TextInput
          value={originText}
          onChangeText={setOriginText}
          placeholder={detectedOrigin ? "Using your current location" : "Type a starting area (optional)"}
          placeholderTextColor={colors.faint}
          style={styles.input}
          accessibilityLabel="Starting point"
        />
        {detectedOrigin ? (
          <Text style={styles.detected}>Detected: {detectedOrigin}</Text>
        ) : (
          <Text style={styles.detected}>No GPS yet — Google Maps will use your phone's location.</Text>
        )}
      </View>

      <View style={styles.destinationCard}>
        <View style={styles.originHead}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={styles.originLabel}>DESTINATION</Text>
        </View>
        <TextInput
          value={destination}
          onChangeText={setDestination}
          placeholder="Hospital, provider or place"
          placeholderTextColor={colors.faint}
          style={styles.input}
          accessibilityLabel="Destination"
        />
      </View>

      <Text style={styles.modeLabel}>Travel mode</Text>
      <View style={styles.modeRow}>
        {MODES.map((item) => {
          const active = mode === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setMode(item.key)}
              style={[styles.mode, active && styles.modeActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Icon name={item.icon} size={16} color={active ? colors.white : colors.inkSoft} />
              <Text style={[styles.modeText, active && styles.modeTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.routeButton} onPress={openRoute} accessibilityRole="button">
        <Icon name="navigate" size={18} color={colors.white} />
        <Text style={styles.routeButtonText}>Open road route in Google Maps</Text>
      </Pressable>

      <View style={styles.quickRow}>
        <Pressable
          style={styles.quickCard}
          onPress={() =>
            openMapsSearch(location ? `hospitals near ${location.latitude},${location.longitude}` : "hospitals near me")
          }
          accessibilityRole="button"
        >
          <View style={styles.quickIcon}>
            <Icon name="hospital" size={20} color={colors.primary} />
          </View>
          <Text style={styles.quickTitle}>Hospitals near me</Text>
          <Text style={styles.quickSub}>Open the map with hospitals around you</Text>
        </Pressable>
        <Pressable
          style={styles.quickCard}
          onPress={() => openMapsSearch("ambulance service near me")}
          accessibilityRole="button"
        >
          <View style={styles.quickIcon}>
            <Icon name="ambulance" size={20} color={colors.primary} />
          </View>
          <Text style={styles.quickTitle}>Ambulance near me</Text>
          <Text style={styles.quickSub}>Search providers on the map</Text>
        </Pressable>
      </View>

      <Pressable style={styles.trafficCard} onPress={() => callPhone("103")} accessibilityRole="button">
        <View style={styles.trafficIcon}>
          <Icon name="traffic" size={20} color={colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.trafficTitle}>Is the road open?</Text>
          <Text style={styles.trafficSub}>Call Traffic Police on 103 before you travel in the hills or during a disaster.</Text>
        </View>
        <Icon name="chevron" size={18} color={colors.primary} />
      </Pressable>

      <Text style={styles.suggestLabel}>Jump to a published provider</Text>
      {suggestions.map((item) => (
        <Pressable
          key={item.id}
          style={styles.suggestion}
          onPress={() => useSuggestion(item)}
          accessibilityRole="button"
        >
          <View style={styles.suggestionDot}>
            <Icon name="location" size={15} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.suggestionName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.suggestionMeta} numberOfLines={1}>
              {item.district} · {item.province}
            </Text>
          </View>
          <Text style={styles.suggestionUse}>Use</Text>
        </Pressable>
      ))}

      <NoticeCard tone="info">
        SwiftCare does not draw its own map tiles or estimate travel time. The route button hands off to Google Maps, which
        shows the real road network and live traffic.
      </NoticeCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 28 },

  originCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  destinationCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 16,
  },
  originHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  originLabel: { flex: 1, color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  originAction: { color: colors.primary, fontSize: 11.5, fontWeight: "800" },
  input: {
    minHeight: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    color: colors.inkSoft,
    fontSize: 13.5,
  },
  detected: { color: colors.faint, fontSize: 10.5, marginTop: 8 },

  modeLabel: { color: colors.ink, fontSize: 13.5, fontWeight: "800", marginBottom: 8 },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  mode: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 42,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
  },
  modeActive: { backgroundColor: colors.inkSoft, borderColor: colors.inkSoft },
  modeText: { color: colors.inkSoft, fontSize: 10.5, fontWeight: "700" },
  modeTextActive: { color: colors.white },

  routeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    marginBottom: 16,
    ...shadow.raised,
  },
  routeButtonText: { color: colors.white, fontSize: 14.5, fontWeight: "900" },

  quickRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickTitle: { color: colors.inkSoft, fontSize: 13, fontWeight: "800" },
  quickSub: { color: colors.muted, fontSize: 10.5, lineHeight: 14, marginTop: 4 },

  trafficCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 18,
  },
  trafficIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.inkSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  trafficTitle: { color: colors.inkSoft, fontSize: 13.5, fontWeight: "800" },
  trafficSub: { color: colors.muted, fontSize: 10.5, lineHeight: 15, marginTop: 3 },

  suggestLabel: { color: colors.ink, fontSize: 13.5, fontWeight: "800", marginBottom: 8 },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  suggestionDot: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionName: { color: colors.inkSoft, fontSize: 12.5, fontWeight: "800" },
  suggestionMeta: { color: colors.muted, fontSize: 10.5, marginTop: 2 },
  suggestionUse: { color: colors.primary, fontSize: 12, fontWeight: "800" },
});
