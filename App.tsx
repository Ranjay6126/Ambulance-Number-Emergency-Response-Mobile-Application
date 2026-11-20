import React, { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { ambulanceDirectory, ambulanceShortCode, type AmbulanceListing } from "./ambulanceDirectory";

type Tab = "Home" | "Ambulances" | "Hospitals" | "Profile";

const iconNames: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  ambulance: "medkit-outline",
  hospital: "business-outline",
  profile: "person-outline",
  location: "location-outline",
  phone: "call-outline",
  bell: "notifications-outline",
  arrow: "chevron-forward",
  shield: "shield-checkmark-outline",
  search: "search-outline",
  clock: "time-outline",
  map: "map-outline",
  directions: "navigate-outline",
};

function Icon({ name, size = 22, color = "#24334B" }: { name: string; size?: number; color?: string }) {
  const iconName = iconNames[name];
  if (!iconName) {
    return null;
  }
  return <Ionicons name={iconName} size={size} color={color} />;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Home");
  const [ambulanceQuery, setAmbulanceQuery] = useState("");
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const filteredAmbulances = ambulanceDirectory.filter((item) =>
    `${item.name} ${item.location} ${item.phone}`.toLowerCase().includes(ambulanceQuery.trim().toLowerCase()),
  );

  const call = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert("Unable to call", "Please call directly from your phone."));
  };

  const openSource = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Unable to open source", "Please check your internet connection and try again."));
  };

  const openMapsSearch = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url).catch(() => Alert.alert("Unable to open maps", "Please check your internet connection and try again."));
  };

  const findMyLocation = async () => {
    setIsFindingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Location permission needed", "Allow location access while using SwiftCare to show your position.");
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentPosition.coords);
    } catch (error) {
      Alert.alert(
        "Unable to get location",
        error instanceof Error ? error.message : "Check that location services are enabled, then try again.",
      );
    } finally {
      setIsFindingLocation(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>SWIFTCARE  ·  NEPAL</Text>
              <Text style={styles.title}>Here when it matters.</Text>
            </View>
            <Pressable style={styles.avatar} onPress={() => setTab("Profile")}>
              <Icon name="profile" size={21} color="#FFFFFF" />
            </Pressable>
          </View>

          {tab === "Home" && (
            <>
              <Pressable style={styles.locationCard} onPress={findMyLocation} accessibilityRole="button" accessibilityLabel="Find my current location">
                <View style={styles.locationIcon}><Icon name="location" size={20} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationLabel}>{location ? "CURRENT LOCATION" : "YOUR AREA"}</Text>
                  <Text style={styles.locationText}>
                    {isFindingLocation
                      ? "Finding your location..."
                      : location
                        ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                        : "Tap to use your current location"}
                  </Text>
                </View>
                <Icon name="location" size={19} color={location ? "#2D8A68" : "#8994A6"} />
              </Pressable>

              <View style={styles.emergencyCard}>
                <View style={styles.pulse}>
                  <Icon name="phone" size={31} color="#FFFFFF" />
                </View>
                <Text style={styles.emergencyTitle}>Need an ambulance?</Text>
                <Text style={styles.emergencyText}>{ambulanceShortCode.coverageNote}</Text>
                <Pressable style={styles.callButton} accessibilityLabel={`Call ambulance short code ${ambulanceShortCode.number}`} onPress={() => call(ambulanceShortCode.number)}>
                  <Icon name="phone" size={17} color="#D92735" />
                  <Text style={styles.callText}>Call {ambulanceShortCode.number}</Text>
                </Pressable>
              </View>

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Verified ambulance contacts</Text>
                <Pressable onPress={() => setTab("Ambulances")}><Text style={styles.seeAll}>See all</Text></Pressable>
              </View>
              {ambulanceDirectory.slice(0, 2).map((item) => (
                <AmbulanceCard key={item.id} item={item} onCall={call} onOpenSource={openSource} onDirections={openMapsSearch} />
              ))}

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Quick access</Text>
              </View>
              <View style={styles.quickGrid}>
                <QuickAction icon="hospital" title="Hospitals" onPress={() => setTab("Hospitals")} />
                <QuickAction icon="phone" title="Ambulance" onPress={() => call(ambulanceShortCode.number)} />
                <QuickAction icon="search" title="Local directory" onPress={() => setTab("Ambulances")} />
                <QuickAction icon="shield" title="Safety tips" onPress={() => Alert.alert("Safety tips", "Stay calm, check breathing, and share your exact location.")} />
              </View>
            </>
          )}

          {tab === "Ambulances" && (
            <>
              <Text style={styles.screenTitle}>Nepal Ambulance Directory</Text>
              <View style={styles.coverageNotice}>
                <Text style={styles.coverageNoticeText}>This is not a complete list of Nepal's villages or municipalities. Only contacts with a public source are shown; confirm availability and coverage by phone.</Text>
              </View>
              <View style={styles.searchBox}><Icon name="search" /><TextInput value={ambulanceQuery} onChangeText={setAmbulanceQuery} placeholder="Search village, municipality, district or provider" style={styles.searchInput} accessibilityLabel="Search village, municipality, district or provider" /></View>
              <Text style={styles.sectionTitle}>Published emergency short code: {ambulanceShortCode.number}</Text>
              <Text style={styles.cardMeta}>{ambulanceShortCode.coverageNote}</Text>
              {ambulanceShortCode.sources.map((source) => (
                <Pressable key={source.url} onPress={() => openSource(source.url)}>
                  <Text style={styles.sourceLink}>Source: {source.name}</Text>
                </Pressable>
              ))}
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Published local provider contacts</Text>
              {filteredAmbulances.length > 0
                ? filteredAmbulances.map((item) => <AmbulanceCard key={item.id} item={item} onCall={call} onOpenSource={openSource} onDirections={openMapsSearch} />)
                : <Text style={styles.emptyMessage}>No verified provider contact matches this search.</Text>}
            </>
          )}

          {tab === "Hospitals" && (
            <>
              <Text style={styles.screenTitle}>Hospital Directory</Text>
              <Text style={styles.directoryIntro}>Find a hospital near you using your map app. SwiftCare does not estimate travel time or verify live hospital availability.</Text>
              <Pressable
                style={styles.mapCard}
                onPress={() => openMapsSearch(`hospitals near ${location ? `${location.latitude},${location.longitude}` : "me"}`)}
                accessibilityRole="button"
              >
                <View style={styles.mapIcon}><Icon name="map" size={22} color="#FFFFFF" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapTitle}>Hospitals near me</Text>
                  <Text style={styles.mapSubtitle}>{location ? "Search using your current location" : "Search around your map app's location"}</Text>
                </View>
                <Icon name="directions" size={20} color="#D92735" />
              </Pressable>
              <View style={styles.coverageNotice}>
                <Text style={styles.coverageNoticeText}>Hospital phone numbers are not yet verified for this directory. For ambulance dispatch, use a published contact and confirm availability when you call.</Text>
              </View>
              <Pressable style={styles.secondaryButton} onPress={() => setTab("Ambulances")}>
                <Text style={styles.secondaryButtonText}>Browse verified ambulance contacts</Text>
              </Pressable>
            </>
          )}

          {tab === "Profile" && (
            <>
              <Text style={styles.screenTitle}>Profile</Text>
              <View style={styles.profileCard}>
                <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>+</Text></View>
                <Text style={styles.profileName}>Your profile</Text>
                <Text style={styles.profilePhone}>Phone number not set</Text>
              </View>
              {["Medical information", "Emergency contacts", "Booking history", "Settings"].map((label) => (
                <Pressable key={label} style={styles.profileRow} onPress={() => Alert.alert(label, "Demo section")}>
                  <Text style={styles.profileLabel}>{label}</Text><Text style={styles.locationArrow}>›</Text>
                </Pressable>
              ))}
            </>
          )}
        </ScrollView>

        <View style={styles.tabBar}>
          {(["Home", "Ambulances", "Hospitals", "Profile"] as Tab[]).map((item) => {
            const icon = item === "Home" ? "home" : item === "Ambulances" ? "ambulance" : item === "Hospitals" ? "hospital" : "profile";
            const active = tab === item;
            return (
              <Pressable key={item} style={styles.tabItem} onPress={() => setTab(item)}>
                <Icon name={icon} size={21} />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AmbulanceCard({ item, onCall, onOpenSource, onDirections }: { item: AmbulanceListing; onCall: (phone: string) => void; onOpenSource: (url: string) => void; onDirections: (query: string) => void }) {
  return (
    <View style={styles.ambulanceCard}>
      <View style={styles.ambulanceIcon}><Text style={{ color: "#FFF", fontSize: 20, fontWeight: "900" }}>+</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMeta}>{item.location}</Text>
        <Text style={styles.cardType}>{item.coverageNote}</Text>
        <Pressable onPress={() => onOpenSource(item.sourceUrl)}>
          <Text style={styles.sourceLink}>Source: {item.sourceName}</Text>
        </Pressable>
      </View>
      <View style={styles.cardActions}>
        <Pressable style={styles.cardDirections} accessibilityLabel={`Find directions to ${item.name}`} onPress={() => onDirections(item.location)}><Icon name="directions" size={17} color="#26364E" /></Pressable>
        <Pressable style={styles.cardCall} accessibilityLabel={`Call ${item.name} at ${item.phone}`} onPress={() => onCall(item.phone)}><Icon name="phone" size={17} /></Pressable>
        <Text style={styles.phoneNumber}>{item.phone}</Text>
      </View>
    </View>
  );
}

function QuickAction({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickIcon}><Icon name={icon} size={20} /></View>
      <Text style={styles.quickText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FA" },
  page: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  kicker: { color: "#D92735", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#17243A", fontSize: 23, fontWeight: "800", marginTop: 5, letterSpacing: -0.5 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#17243A", alignItems: "center", justifyContent: "center" },
  locationCard: { minHeight: 68, borderRadius: 18, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: "#E9EDF3" },
  locationIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#FDEBED", alignItems: "center", justifyContent: "center", marginRight: 12 },
  locationLabel: { color: "#8A95A7", fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  locationText: { color: "#26364E", fontSize: 14, fontWeight: "700", marginTop: 4 },
  locationArrow: { color: "#A2A8B4", fontSize: 27, fontWeight: "700" },
  emergencyCard: { minHeight: 248, borderRadius: 26, backgroundColor: "#D92735", alignItems: "center", justifyContent: "center", paddingHorizontal: 22, marginBottom: 26, shadowColor: "#A71D2A", shadowOpacity: 0.2, shadowRadius: 18, elevation: 6 },
  pulse: { width: 62, height: 62, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emergencyTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", letterSpacing: -0.4 },
  emergencyText: { color: "#FFE5E7", fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: 7 },
  callButton: { minHeight: 48, minWidth: 178, flexDirection: "row", gap: 8, borderRadius: 16, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginTop: 18 },
  callText: { color: "#D92735", fontWeight: "900", letterSpacing: 0.3 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: "#172033", fontSize: 16, fontWeight: "800", marginBottom: 10 },
  seeAll: { color: "#E93437", fontSize: 12, fontWeight: "700" },
  ambulanceCard: { minHeight: 94, borderRadius: 18, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", padding: 13, marginBottom: 10, borderWidth: 1, borderColor: "#E9EDF3" },
  ambulanceIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#FDEBED", alignItems: "center", justifyContent: "center", marginRight: 11 },
  cardName: { color: "#26364E", fontSize: 13, fontWeight: "800" },
  cardMeta: { color: "#8792A4", fontSize: 10, lineHeight: 15, marginTop: 4 },
  cardType: { color: "#D92735", fontSize: 10, fontWeight: "700", lineHeight: 15, marginTop: 4 },
  cardActions: { alignItems: "flex-end", gap: 7 },
  cardDirections: { width: 34, height: 34, borderRadius: 13, backgroundColor: "#EEF2F7", alignItems: "center", justifyContent: "center" },
  cardCall: { width: 38, height: 38, borderRadius: 14, backgroundColor: "#FDEBED", alignItems: "center", justifyContent: "center" },
  quickGrid: { flexDirection: "row", justifyContent: "space-between" },
  quickAction: { width: "23%", height: 82, borderRadius: 16, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#EEF0F5" },
  quickIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center", marginBottom: 6 },
  quickText: { color: "#5E6677", fontSize: 9, fontWeight: "700", textAlign: "center" },
  tabBar: { height: 72, flexDirection: "row", backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E9EDF3", paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabLabel: { color: "#929CAE", fontSize: 10, marginTop: 4 },
  tabLabelActive: { color: "#D92735", fontWeight: "800" },
  screenTitle: { color: "#17243A", fontSize: 23, fontWeight: "800", marginBottom: 14, letterSpacing: -0.4 },
  searchBox: { height: 48, borderRadius: 14, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEF0F5", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, height: 48, paddingHorizontal: 8, color: "#263248" },
  emptyMessage: { color: "#7E8798", fontSize: 13, textAlign: "center", paddingVertical: 20 },
  coverageNotice: { backgroundColor: "#FFF4DD", borderRadius: 14, padding: 12, marginBottom: 12 },
  coverageNoticeText: { color: "#78530D", fontSize: 12, lineHeight: 18 },
  directoryIntro: { color: "#6E7B8F", fontSize: 13, lineHeight: 20, marginBottom: 16 },
  mapCard: { minHeight: 84, borderRadius: 18, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E9EDF3", flexDirection: "row", alignItems: "center", padding: 14, marginBottom: 14 },
  mapIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#26364E", alignItems: "center", justifyContent: "center", marginRight: 12 },
  mapTitle: { color: "#26364E", fontSize: 14, fontWeight: "800" },
  mapSubtitle: { color: "#8792A4", fontSize: 11, marginTop: 4 },
  secondaryButton: { minHeight: 48, borderRadius: 15, backgroundColor: "#FDEBED", alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  secondaryButtonText: { color: "#D92735", fontSize: 13, fontWeight: "800" },
  sourceLink: { color: "#2563A6", fontSize: 11, fontWeight: "700", marginTop: 5 },
  phoneNumber: { color: "#263248", fontSize: 9, fontWeight: "700", marginTop: 2 },
  profileCard: { height: 180, borderRadius: 22, backgroundColor: "#17243A", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  profileAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" },
  profileAvatarText: { color: "#E93437", fontSize: 24, fontWeight: "900" },
  profileName: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginTop: 8 },
  profilePhone: { color: "#C9CED8", fontSize: 12, marginTop: 4 },
  profileRow: { height: 58, borderRadius: 14, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEF0F5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 8 },
  profileLabel: { color: "#263248", fontSize: 14, fontWeight: "700" },
});
