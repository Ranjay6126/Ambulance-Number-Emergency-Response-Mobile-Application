import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { colors, radius } from "./theme";
import { Icon } from "./components/ui";
import { TABS, type Tab } from "./lib/tabs";
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

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>SWIFTCARE · NEPAL</Text>
          <Text style={styles.title}>Here when it matters.</Text>
        </View>
        <Pressable
          style={styles.avatar}
          onPress={() => goTo("Profile")}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <Icon name="profile" size={20} color={colors.white} />
        </Pressable>
      </View>

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

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {TABS.map((item) => {
          const active = tab === item.key;
          return (
            <Pressable
              key={item.key}
              style={styles.tabItem}
              onPress={() => goTo(item.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Icon name={item.icon} size={21} color={active ? colors.primary : colors.faint} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 23, fontWeight: "800", marginTop: 5, letterSpacing: -0.5 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },

  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabLabel: { color: colors.faint, fontSize: 10.5, marginTop: 4, fontWeight: "600" },
  tabLabelActive: { color: colors.primary, fontWeight: "800" },
});
