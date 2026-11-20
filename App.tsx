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
import { ambulanceDirectory, ambulanceShortCode, type AmbulanceListing } from "./ambulanceDirectory";

type Tab = "Home" | "Ambulances" | "Hospitals" | "Profile";

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const labels: Record<string, string> = {
    home: "⌂", ambulance: "✚", hospital: "H", profile: "●", location: "⌖",
    phone: "☎", bell: "♢", arrow: "›", shield: "◆", search: "⌕", clock: "◷",
  };
  return <Text style={{ fontSize: size, fontWeight: "800", color: "#263248" }}>{labels[name] ?? name}</Text>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Home");
  const [ambulanceQuery, setAmbulanceQuery] = useState("");

  const filteredAmbulances = ambulanceDirectory.filter((item) =>
    `${item.name} ${item.location} ${item.phone}`.toLowerCase().includes(ambulanceQuery.trim().toLowerCase()),
  );

  const call = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert("Unable to call", "Please call directly from your phone."));
  };

  const openSource = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Unable to open source", "Please check your internet connection and try again."));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>GOOD MORNING</Text>
              <Text style={styles.title}>Find help in Nepal</Text>
            </View>
            <Pressable style={styles.avatar} onPress={() => setTab("Profile")}>
              <Text style={styles.avatarText}>+</Text>
            </Pressable>
          </View>

          {tab === "Home" && (
            <>
              <Pressable style={styles.locationCard} onPress={() => setTab("Ambulances")}>
                <View style={styles.locationIcon}><Icon name="location" size={20} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationLabel}>Find services in your area</Text>
                  <Text style={styles.locationText}>Search by village or municipality</Text>
                </View>
                <Text style={styles.locationArrow}>›</Text>
              </Pressable>

              <View style={styles.emergencyCard}>
                <View style={styles.pulse}>
                  <Text style={styles.phoneGlyph}>☎</Text>
                </View>
                <Text style={styles.emergencyTitle}>Emergency Help</Text>
                <Text style={styles.emergencyText}>{ambulanceShortCode.coverageNote}</Text>
                <Pressable style={styles.callButton} accessibilityLabel={`Call ambulance short code ${ambulanceShortCode.number}`} onPress={() => call(ambulanceShortCode.number)}>
                  <Text style={styles.callText}>CALL {ambulanceShortCode.number}</Text>
                </Pressable>
              </View>

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Verified ambulance contacts</Text>
                <Pressable onPress={() => setTab("Ambulances")}><Text style={styles.seeAll}>See all</Text></Pressable>
              </View>
              {ambulanceDirectory.slice(0, 2).map((item) => (
                <AmbulanceCard key={item.id} item={item} onCall={call} onOpenSource={openSource} />
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
                ? filteredAmbulances.map((item) => <AmbulanceCard key={item.id} item={item} onCall={call} onOpenSource={openSource} />)
                : <Text style={styles.emptyMessage}>No verified provider contact matches this search.</Text>}
            </>
          )}

          {tab === "Hospitals" && (
            <>
              <Text style={styles.screenTitle}>Hospital Directory</Text>
              <Text style={styles.emptyMessage}>Verified hospital contacts have not been added to this directory yet.</Text>
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

function AmbulanceCard({ item, onCall, onOpenSource }: { item: AmbulanceListing; onCall: (phone: string) => void; onOpenSource: (url: string) => void }) {
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
  safe: { flex: 1, backgroundColor: "#F7F8FC" },
  page: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  kicker: { color: "#EF2B2D", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: "#172033", fontSize: 23, fontWeight: "800", marginTop: 3 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFD9DA", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#E83235", fontWeight: "900", fontSize: 16 },
  locationCard: { height: 62, borderRadius: 16, backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", paddingHorizontal: 13, marginBottom: 14, borderWidth: 1, borderColor: "#EEF0F5" },
  locationIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center", marginRight: 10 },
  locationLabel: { color: "#929BAD", fontSize: 11 },
  locationText: { color: "#263248", fontSize: 14, fontWeight: "700", marginTop: 2 },
  locationArrow: { color: "#A2A8B4", fontSize: 27, fontWeight: "700" },
  emergencyCard: { height: 232, borderRadius: 24, backgroundColor: "#E93437", alignItems: "center", justifyContent: "center", marginBottom: 20, shadowColor: "#D82225", shadowOpacity: 0.18, shadowRadius: 16, elevation: 5 },
  pulse: { width: 74, height: 74, borderRadius: 37, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  phoneGlyph: { color: "#FFF", fontSize: 34, fontWeight: "900" },
  emergencyTitle: { color: "#FFF", fontSize: 20, fontWeight: "900" },
  emergencyText: { color: "#FFE2E2", fontSize: 12, marginTop: 5 },
  callButton: { height: 48, width: 190, borderRadius: 24, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", marginTop: 16 },
  callText: { color: "#E93437", fontWeight: "900", letterSpacing: 0.6 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: "#172033", fontSize: 16, fontWeight: "800", marginBottom: 10 },
  seeAll: { color: "#E93437", fontSize: 12, fontWeight: "700" },
  ambulanceCard: { minHeight: 94, borderRadius: 16, backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#EEF0F5" },
  ambulanceIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#E93437", alignItems: "center", justifyContent: "center", marginRight: 10 },
  cardName: { color: "#263248", fontSize: 14, fontWeight: "800" },
  cardMeta: { color: "#8A93A5", fontSize: 11, marginTop: 4 },
  cardType: { color: "#E93437", fontSize: 10, fontWeight: "700", marginTop: 4 },
  cardActions: { alignItems: "flex-end", gap: 7 },
  cardCall: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center" },
  quickGrid: { flexDirection: "row", justifyContent: "space-between" },
  quickAction: { width: "23%", height: 82, borderRadius: 16, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#EEF0F5" },
  quickIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center", marginBottom: 6 },
  quickText: { color: "#5E6677", fontSize: 9, fontWeight: "700", textAlign: "center" },
  tabBar: { height: 74, flexDirection: "row", backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EEF0F5", paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabLabel: { color: "#9AA1AF", fontSize: 10, marginTop: 3 },
  tabLabelActive: { color: "#E93437", fontWeight: "800" },
  screenTitle: { color: "#172033", fontSize: 23, fontWeight: "800", marginBottom: 14 },
  searchBox: { height: 48, borderRadius: 14, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEF0F5", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, height: 48, paddingHorizontal: 8, color: "#263248" },
  emptyMessage: { color: "#7E8798", fontSize: 13, textAlign: "center", paddingVertical: 20 },
  coverageNotice: { backgroundColor: "#FFF4DD", borderRadius: 14, padding: 12, marginBottom: 12 },
  coverageNoticeText: { color: "#78530D", fontSize: 12, lineHeight: 18 },
  sourceLink: { color: "#2563A6", fontSize: 11, fontWeight: "700", marginTop: 5 },
  phoneNumber: { color: "#263248", fontSize: 9, fontWeight: "700", marginTop: 2 },
  profileCard: { height: 180, borderRadius: 20, backgroundColor: "#263248", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  profileAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" },
  profileAvatarText: { color: "#E93437", fontSize: 24, fontWeight: "900" },
  profileName: { color: "#FFF", fontSize: 18, fontWeight: "800", marginTop: 8 },
  profilePhone: { color: "#C9CED8", fontSize: 12, marginTop: 4 },
  profileRow: { height: 58, borderRadius: 14, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEF0F5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 8 },
  profileLabel: { color: "#263248", fontSize: 14, fontWeight: "700" },
});
