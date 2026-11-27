import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { colors, radius, shadow, spacing, typography } from "./theme";
import { Icon } from "./components/ui";
import { TABS, type Tab } from "./lib/tabs";
import { useResponsive } from "./lib/responsive";
import { callPhone } from "./lib/links";
import { nationalAmbulanceNumber } from "./ambulanceDirectory";
import { HomeScreen } from "./screens/HomeScreen";
import { DirectoryScreen } from "./screens/DirectoryScreen";
import { RoutesScreen } from "./screens/RoutesScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

export default function App() {
  const [tab, setTab] = useState<Tab>("Home");
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const autoAsked = useRef(false);
  const inFlight = useRef(false);

  const findMyLocation = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options;
    if (inFlight.current) {
      return;
    }
    inFlight.current = true;
    setIsLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setLocationDenied(true);
        if (!silent) {
          Alert.alert(
            "Location permission needed",
            "Allow location access so SwiftCare can show the ambulance numbers published for your area.",
          );
        }
        return;
      }
      setLocationDenied(false);
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(position.coords);
    } catch (error) {
      setLocationDenied(true);
      if (!silent) {
        Alert.alert(
          "Unable to get location",
          error instanceof Error ? error.message : "Check that location services are enabled, then try again.",
        );
      }
    } finally {
      inFlight.current = false;
      setIsLocating(false);
    }
  }, []);

  // Ask for location the moment the app opens, so the ambulance numbers for the
  // user's own area are already on screen without any tapping.
  useEffect(() => {
    if (autoAsked.current) {
      return;
    }
    autoAsked.current = true;
    void findMyLocation({ silent: true });
  }, [findMyLocation]);

  const goTo = (next: Tab) => setTab(next);

  return (
    <SafeAreaProvider>
      <Shell
        tab={tab}
        location={location}
        isLocating={isLocating}
        locationDenied={locationDenied}
        findMyLocation={findMyLocation}
        goTo={goTo}
      />
    </SafeAreaProvider>
  );
}

function Shell({
  tab,
  location,
  isLocating,
  locationDenied,
  findMyLocation,
  goTo,
}: {
  tab: Tab;
  location: Location.LocationObjectCoords | null;
  isLocating: boolean;
  locationDenied: boolean;
  findMyLocation: () => void;
  goTo: (tab: Tab) => void;
}) {
  const insets = useSafeAreaInsets();
  const layout = useResponsive();
  const wide = layout.isWide;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <Icon name="ambulance" size={20} color={colors.white} />
          </View>
          <View style={styles.brandText}>
            <Text style={styles.brandName}>SwiftCare</Text>
            <Text style={styles.brandDesc} numberOfLines={1}>
              Nepal ambulance & emergency numbers
            </Text>
          </View>
        </View>
        <Pressable
          style={styles.emergencyPill}
          onPress={() => callPhone(nationalAmbulanceNumber)}
          accessibilityRole="button"
          accessibilityLabel={`Call the national ambulance number ${nationalAmbulanceNumber}`}
        >
          <Icon name="phone" size={13} color={colors.white} />
          <Text style={styles.emergencyPillText}>{nationalAmbulanceNumber}</Text>
        </Pressable>
      </View>

      <View style={styles.shell}>
        {wide ? (
          <View style={styles.rail} accessibilityRole="tablist" accessibilityLabel="Main navigation">
            {TABS.map((item) => {
              const active = tab === item.key;
              return (
                <Pressable
                  key={item.key}
                  style={[styles.railItem, active && styles.railItemActive]}
                  onPress={() => goTo(item.key)}
                  accessibilityRole="tab"
                  accessibilityLabel={`${item.label} tab`}
                  accessibilityState={{ selected: active }}
                >
                  <Icon name={item.icon} size={20} color={active ? colors.white : colors.faint} />
                  <Text style={[styles.railLabel, active && styles.railLabelActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.body}>
          {tab === "Home" && (
            <HomeScreen
              location={location}
              isLocating={isLocating}
              locationDenied={locationDenied}
              onFindLocation={findMyLocation}
              onNavigate={goTo}
            />
          )}
          {tab === "Directory" && <DirectoryScreen location={location} />}
          {tab === "Routes" && (
            <RoutesScreen location={location} isLocating={isLocating} onFindLocation={findMyLocation} />
          )}
          {tab === "Profile" && <ProfileScreen />}
        </View>
      </View>

      {!wide ? (
        <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, spacing.sm + 2) }]}>
          {TABS.map((item) => {
            const active = tab === item.key;
            return (
              <Pressable
                key={item.key}
                style={styles.tabItem}
                onPress={() => goTo(item.key)}
                accessibilityRole="tab"
                accessibilityLabel={`${item.label} tab`}
                accessibilityState={{ selected: active }}
              >
                <View style={[styles.tabIconWrap, active && styles.tabIconWrapActive]}>
                  <Icon name={item.icon} size={20} color={active ? colors.white : colors.faint} />
                </View>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg - 2,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { flex: 1 },
  brandName: { color: colors.ink, fontSize: typography.size.xl, fontWeight: typography.weight.black, letterSpacing: typography.letterSpacing.tight },
  brandDesc: { color: colors.muted, fontSize: typography.size.sm, marginTop: 2 },
  emergencyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
    minHeight: 44,
    paddingHorizontal: spacing.lg - 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    ...shadow.raised,
  },
  emergencyPillText: { color: colors.white, fontSize: typography.size.md, fontWeight: typography.weight.black, letterSpacing: 0.5 },

  shell: { flex: 1, flexDirection: "row" },
  body: { flex: 1 },

  rail: {
    width: 232,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs + 2,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  railItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 54,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  railItemActive: { backgroundColor: colors.primary, ...shadow.raised },
  railLabel: { color: colors.muted, fontSize: typography.size.md, fontWeight: typography.weight.semibold },
  railLabelActive: { color: colors.white, fontWeight: typography.weight.bold },

  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    ...shadow.sheet,
  },
  tabItem: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center", gap: spacing.xxs },
  tabIconWrap: {
    width: 52,
    height: 30,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrapActive: { backgroundColor: colors.primary },
  tabLabel: { color: colors.faint, fontSize: typography.size.xs, fontWeight: typography.weight.semibold },
  tabLabelActive: { color: colors.primary, fontWeight: typography.weight.bold },
});
