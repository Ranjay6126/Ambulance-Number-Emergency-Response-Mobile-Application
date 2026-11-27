import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { LocationObjectCoords } from "expo-location";
import { colors, radius, shadow, spacing, typography } from "../theme";
import { ActionButton, Icon, IconTile, NoticeCard, ScreenTitle, Segmented } from "../components/ui";
import type { TravelMode } from "../lib/links";
import { callPhone, cleanText, coordsToOrigin, openMapsDirections, openMapsSearch } from "../lib/links";
import { pageContainer, useResponsive } from "../lib/responsive";
import { ambulanceDirectory, listingLocation, type AmbulanceListing } from "../ambulanceDirectory";

type Props = {
  location: LocationObjectCoords | null;
  isLocating: boolean;
  onFindLocation: () => void;
};

const MODES: { key: TravelMode; label: string; icon: "car" | "walk" | "bus" }[] = [
  { key: "driving", label: "Car", icon: "car" },
  { key: "walking", label: "Walk", icon: "walk" },
  { key: "transit", label: "Transit", icon: "bus" },
];

export function RoutesScreen({ location, isLocating, onFindLocation }: Props) {
  const layout = useResponsive();
  const [mode, setMode] = useState<TravelMode>("driving");
  const [originText, setOriginText] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);

  const detectedOrigin = coordsToOrigin(location);
  const hospitalsQuery = detectedOrigin ? `hospitals near ${detectedOrigin}` : "hospitals near me";

  const suggestions = useMemo(() => {
    const needle = cleanText(destination).toLowerCase();
    const pool = needle
      ? ambulanceDirectory.filter((item) =>
          `${item.name} ${item.district} ${item.province} ${item.area ?? ""}`.toLowerCase().includes(needle),
        )
      : ambulanceDirectory;
    return pool.slice(0, 5);
  }, [destination]);

  const openRoute = () => {
    const cleanDestination = cleanText(destination, 160);
    if (!cleanDestination) {
      setError("Add a destination before planning a route.");
      return;
    }
    setError(null);
    const origin = cleanText(originText, 64) || detectedOrigin;
    openMapsDirections({ destination: cleanDestination, origin, travelMode: mode });
  };

  const useSuggestion = (item: AmbulanceListing) => {
    setDestination(listingLocation(item));
    setError(null);
  };

  return (
    <ScrollView contentContainerStyle={[styles.page, pageContainer(layout)]} showsVerticalScrollIndicator={false}>
      <ScreenTitle
        eyebrow="Plan a route"
        title="Road routes & maps"
        subtitle="Plan a road route to a hospital or ambulance provider. Routes open in Google Maps so you see the real road network and live traffic."
      />

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <View style={styles.dotStart} />
          <Text style={styles.cardLabel}>Starting point</Text>
          <Pressable
            onPress={onFindLocation}
            style={styles.useLocation}
            accessibilityRole="button"
            accessibilityLabel="Use my current location as the starting point"
          >
            <Icon name="location" size={13} color={colors.primary} />
            <Text style={styles.useLocationText}>{isLocating ? "Locating…" : "Use my location"}</Text>
          </Pressable>
        </View>
        <TextInput
          value={originText}
          onChangeText={(text) => setOriginText(cleanText(text, 64))}
          placeholder={detectedOrigin ? "Using your current location" : "Type a starting area (optional)"}
          placeholderTextColor={colors.faint}
          style={styles.input}
          accessibilityLabel="Starting point"
        />
        <Text style={styles.hint}>
          {detectedOrigin ? "Your position is used for this route only." : "No location yet — Google Maps will use your phone's location."}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <View style={styles.dotEnd} />
          <Text style={styles.cardLabel}>Destination</Text>
        </View>
        <TextInput
          value={destination}
          onChangeText={(text) => {
            setDestination(cleanText(text, 160));
            if (error) {
              setError(null);
            }
          }}
          placeholder="Type a hospital, provider or place"
          placeholderTextColor={colors.faint}
          style={styles.input}
          accessibilityLabel="Destination"
        />

        <Text style={styles.suggestLabel}>Or pick a published provider</Text>
        {suggestions.map((item) => (
          <Pressable
            key={item.id}
            style={styles.suggestion}
            onPress={() => useSuggestion(item)}
            accessibilityRole="button"
            accessibilityLabel={`Use ${item.name} as the destination`}
          >
            <IconTile name="location" size={15} tone="primary" round />
            <View style={styles.suggestionBody}>
              <Text style={styles.suggestionName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.suggestionMeta} numberOfLines={1}>
                {item.district} · {item.province}
              </Text>
            </View>
            <Text style={styles.suggestionUse}>Use</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.modeLabel}>Travel mode</Text>
      <Segmented options={MODES} value={mode} onChange={setMode} accessibilityLabel="Choose a travel mode" />

      {error ? (
        <View style={styles.errorRow}>
          <Icon name="alert" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.routeAction}>
        <ActionButton title="Open road route in Google Maps" icon="navigate" fullWidth onPress={openRoute} />
      </View>

      <View style={styles.quickRow}>
        <Pressable
          style={styles.quickCard}
          onPress={() => openMapsSearch(hospitalsQuery)}
          accessibilityRole="button"
          accessibilityLabel="Search for hospitals near me on the map"
        >
          <IconTile name="hospital" tone="primary" />
          <Text style={styles.quickTitle}>Hospitals near me</Text>
          <Text style={styles.quickSub}>Open the map with hospitals around you</Text>
        </Pressable>
        <Pressable
          style={styles.quickCard}
          onPress={() => openMapsSearch("ambulance service near me")}
          accessibilityRole="button"
          accessibilityLabel="Search for ambulance services near me on the map"
        >
          <IconTile name="ambulance" tone="primary" />
          <Text style={styles.quickTitle}>Ambulance near me</Text>
          <Text style={styles.quickSub}>Search providers on the map</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.trafficCard}
        onPress={() => callPhone("103")}
        accessibilityRole="button"
        accessibilityLabel="Call Traffic Police on 103 to ask if the road is open"
      >
        <IconTile name="traffic" tone="dark" />
        <View style={styles.trafficBody}>
          <Text style={styles.trafficTitle}>Is the road open?</Text>
          <Text style={styles.trafficSub}>
            Call Traffic Police on 103 before you travel in the hills or during a disaster.
          </Text>
        </View>
        <Icon name="chevron" size={18} color={colors.primary} />
      </Pressable>

      <NoticeCard tone="info">
        SwiftCare does not draw its own map tiles or estimate travel time. The route button hands off to Google Maps, which
        shows the real road network and live traffic.
      </NoticeCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: spacing.xl, paddingTop: spacing.xs, paddingBottom: spacing.xxl },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg - 2,
    marginBottom: spacing.md,
  },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  dotStart: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  dotEnd: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cardLabel: { flex: 1, color: colors.muted, fontSize: typography.size.xs, fontWeight: typography.weight.bold, letterSpacing: typography.letterSpacing.wider, textTransform: "uppercase" },
  useLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 44,
    paddingLeft: spacing.sm,
  },
  useLocationText: { color: colors.primary, fontSize: typography.size.sm, fontWeight: typography.weight.bold },

  input: {
    minHeight: 46,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    color: colors.inkSoft,
    fontSize: typography.size.md,
  },
  hint: { color: colors.faint, fontSize: typography.size.sm, marginTop: spacing.sm },

  suggestLabel: { color: colors.muted, fontSize: typography.size.xs, fontWeight: typography.weight.bold, letterSpacing: typography.letterSpacing.wide, marginTop: spacing.md, marginBottom: spacing.sm },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
    minHeight: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  suggestionBody: { flex: 1 },
  suggestionName: { color: colors.inkSoft, fontSize: typography.size.sm + 0.5, fontWeight: typography.weight.bold },
  suggestionMeta: { color: colors.muted, fontSize: typography.size.xs, marginTop: 2 },
  suggestionUse: { color: colors.primary, fontSize: typography.size.sm, fontWeight: typography.weight.bold },

  modeLabel: { color: colors.ink, fontSize: typography.size.md, fontWeight: typography.weight.bold, marginBottom: spacing.sm + 2 },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginTop: spacing.md,
  },
  errorText: { flex: 1, color: colors.danger, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },

  routeAction: { marginTop: spacing.lg, ...shadow.raised, borderRadius: radius.md },

  quickRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg, marginBottom: spacing.md },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg - 2,
  },
  quickTitle: { color: colors.ink, fontSize: typography.size.md, fontWeight: typography.weight.bold, marginTop: spacing.sm + 2 },
  quickSub: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.xs, marginTop: spacing.xs },

  trafficCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg - 2,
    marginBottom: spacing.lg,
  },
  trafficBody: { flex: 1 },
  trafficTitle: { color: colors.ink, fontSize: typography.size.md, fontWeight: typography.weight.bold },
  trafficSub: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.xs, marginTop: 3 },
});
