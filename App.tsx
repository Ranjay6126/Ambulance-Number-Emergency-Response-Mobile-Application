import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Tab = "Home" | "Ambulances" | "Hospitals" | "Profile";

const ambulances = [
  { id: 1, name: "CityLife Ambulance", distance: "1.2 km", eta: "4 min", phone: "+919876543210", type: "Advanced" },
  { id: 2, name: "MedSwift Response", distance: "2.4 km", eta: "7 min", phone: "+919876543211", type: "Basic" },
  { id: 3, name: "SafeRide Emergency", distance: "3.1 km", eta: "9 min", phone: "+919876543212", type: "Advanced" },
];

const hospitals = [
  { id: 1, name: "Central Care Hospital", distance: "1.8 km", status: "Open 24/7", phone: "+911122334455" },
  { id: 2, name: "Apollo Emergency Centre", distance: "3.4 km", status: "Open 24/7", phone: "+911122334466" },
];

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const labels: Record<string, string> = {
    home: "⌂", ambulance: "✚", hospital: "H", profile: "●", location: "⌖",
    phone: "☎", bell: "♢", arrow: "›", shield: "◆", search: "⌕", clock: "◷",
  };
  return <Text style={{ fontSize: size, fontWeight: "800", color: "#263248" }}>{labels[name] ?? name}</Text>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Home");
  const [booking, setBooking] = useState<(typeof ambulances)[0] | null>(null);
  const [pickup, setPickup] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [ambulanceQuery, setAmbulanceQuery] = useState("");
  const [hospitalQuery, setHospitalQuery] = useState("");

  const filteredAmbulances = ambulances.filter((item) =>
    `${item.name} ${item.type}`.toLowerCase().includes(ambulanceQuery.trim().toLowerCase()),
  );
  const filteredHospitals = hospitals.filter((item) =>
    `${item.name} ${item.status}`.toLowerCase().includes(hospitalQuery.trim().toLowerCase()),
  );

  const call = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => Alert.alert("Unable to call", "Please call directly from your phone."));
  };

  const openBooking = (item: (typeof ambulances)[0]) => {
    setConfirmed(false);
    setPickup("");
    setBooking(item);
  };

  const confirmBooking = () => {
    if (!pickup.trim()) {
      Alert.alert("Pickup location needed", "Enter a pickup address or use your current location.");
      return;
    }
    setConfirmed(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>GOOD MORNING</Text>
              <Text style={styles.title}>Stay safe, Aarav</Text>
            </View>
            <Pressable style={styles.avatar} onPress={() => setTab("Profile")}>
              <Text style={styles.avatarText}>A</Text>
            </Pressable>
          </View>

          {tab === "Home" && (
            <>
              <Pressable style={styles.locationCard} onPress={() => Alert.alert("Location", "Using your current location.")}>
                <View style={styles.locationIcon}><Icon name="location" size={20} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationLabel}>Your location</Text>
                  <Text style={styles.locationText}>Indira Nagar, Lucknow</Text>
                </View>
                <Text style={styles.locationArrow}>›</Text>
              </Pressable>

              <View style={styles.emergencyCard}>
                <View style={styles.pulse}>
                  <Text style={styles.phoneGlyph}>☎</Text>
                </View>
                <Text style={styles.emergencyTitle}>Emergency Help</Text>
                <Text style={styles.emergencyText}>Connect with the nearest ambulance immediately</Text>
                <Pressable style={styles.callButton} onPress={() => call("108")}>
                  <Text style={styles.callText}>CALL 108</Text>
                </Pressable>
              </View>

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Nearby ambulances</Text>
                <Pressable onPress={() => setTab("Ambulances")}><Text style={styles.seeAll}>See all</Text></Pressable>
              </View>
              {ambulances.slice(0, 2).map((item) => (
                <AmbulanceCard key={item.id} item={item} onCall={call} onBook={() => openBooking(item)} />
              ))}

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Quick access</Text>
              </View>
              <View style={styles.quickGrid}>
                <QuickAction icon="hospital" title="Hospitals" onPress={() => setTab("Hospitals")} />
                <QuickAction icon="phone" title="Emergency" onPress={() => call("112")} />
                <QuickAction icon="clock" title="My bookings" onPress={() => setTab("Ambulances")} />
                <QuickAction icon="shield" title="Safety tips" onPress={() => Alert.alert("Safety tips", "Stay calm, check breathing, and share your exact location.")} />
              </View>
            </>
          )}

          {tab === "Ambulances" && (
            <>
              <Text style={styles.screenTitle}>Find Ambulance</Text>
              <View style={styles.searchBox}><Icon name="search" /><TextInput value={ambulanceQuery} onChangeText={setAmbulanceQuery} placeholder="Search ambulances or service type" style={styles.searchInput} accessibilityLabel="Search ambulances or service type" /></View>
              <View style={styles.mapPreview}>
                <View style={[styles.mapRoad, styles.mapRoadOne]} /><View style={[styles.mapRoad, styles.mapRoadTwo]} />
                <View style={[styles.mapPin, { left: "28%", top: "42%" }]}><Text style={styles.mapPinText}>+</Text></View>
                <View style={[styles.mapPin, { left: "66%", top: "26%" }]}><Text style={styles.mapPinText}>+</Text></View>
                <View style={styles.userPin}><View style={styles.userDot} /></View>
              </View>
              <Text style={styles.sectionTitle}>Available nearby</Text>
              {filteredAmbulances.length > 0
                ? filteredAmbulances.map((item) => <AmbulanceCard key={item.id} item={item} onCall={call} onBook={() => openBooking(item)} />)
                : <Text style={styles.emptyMessage}>No ambulances match your search.</Text>}
            </>
          )}

          {tab === "Hospitals" && (
            <>
              <Text style={styles.screenTitle}>Nearby Hospitals</Text>
              <View style={styles.searchBox}><Icon name="search" /><TextInput value={hospitalQuery} onChangeText={setHospitalQuery} placeholder="Search hospitals" style={styles.searchInput} accessibilityLabel="Search hospitals" /></View>
              {filteredHospitals.length > 0 ? filteredHospitals.map((item) => (
                <View key={item.id} style={styles.hospitalCard}>
                  <View style={styles.hospitalIcon}><Text style={{ color: "#FFF", fontWeight: "900" }}>H</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardMeta}>{item.distance} away  •  {item.status}</Text>
                  </View>
                  <Pressable style={styles.smallCall} onPress={() => call(item.phone)}><Icon name="phone" size={18} /></Pressable>
                </View>
              )) : <Text style={styles.emptyMessage}>No hospitals match your search.</Text>}
            </>
          )}

          {tab === "Profile" && (
            <>
              <Text style={styles.screenTitle}>Profile</Text>
              <View style={styles.profileCard}>
                <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>A</Text></View>
                <Text style={styles.profileName}>Aarav Sharma</Text>
                <Text style={styles.profilePhone}>+91 98765 43210</Text>
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

        <Modal visible={!!booking} transparent animationType="slide" onRequestClose={() => setBooking(null)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              {confirmed ? (
                <>
                  <View style={styles.confirmIcon}><Text style={{ color: "#FFF", fontSize: 30 }}>✓</Text></View>
                  <Text style={styles.modalTitle}>Ambulance requested</Text>
                  <Text style={styles.modalText}>{booking?.name} will reach you in approximately {booking?.eta}.</Text>
                  <Pressable style={styles.modalPrimary} onPress={() => setBooking(null)}><Text style={styles.modalPrimaryText}>Track ambulance</Text></Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.modalTitle}>Book {booking?.name}</Text>
                  <Text style={styles.modalText}>Estimated arrival: {booking?.eta}</Text>
                  <TextInput value={pickup} onChangeText={setPickup} placeholder="Pickup address" style={styles.modalInput} />
                  <Pressable style={styles.locationButton} onPress={() => setPickup("Indira Nagar, Lucknow")}><Icon name="location" size={18} /><Text style={styles.locationButtonText}>Use current location</Text></Pressable>
                  <Pressable style={styles.modalPrimary} onPress={confirmBooking}><Text style={styles.modalPrimaryText}>Confirm request</Text></Pressable>
                  <Pressable style={styles.modalCancel} onPress={() => setBooking(null)}><Text style={styles.modalCancelText}>Cancel</Text></Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AmbulanceCard({ item, onCall, onBook }: { item: (typeof ambulances)[0]; onCall: (phone: string) => void; onBook: () => void }) {
  return (
    <View style={styles.ambulanceCard}>
      <View style={styles.ambulanceIcon}><Text style={{ color: "#FFF", fontSize: 20, fontWeight: "900" }}>+</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMeta}>{item.distance} away • {item.eta} ETA</Text>
        <Text style={styles.cardType}>{item.type} service</Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable style={styles.cardCall} onPress={() => onCall(item.phone)}><Icon name="phone" size={17} /></Pressable>
        <Pressable style={styles.cardBook} onPress={onBook}><Text style={styles.cardBookText}>Book</Text></Pressable>
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
  cardBook: { height: 28, paddingHorizontal: 12, borderRadius: 14, backgroundColor: "#263248", alignItems: "center", justifyContent: "center" },
  cardBookText: { color: "#FFF", fontSize: 11, fontWeight: "800" },
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
  mapPreview: { height: 210, borderRadius: 20, backgroundColor: "#E9EDF3", overflow: "hidden", marginBottom: 18 },
  mapRoad: { position: "absolute", width: "130%", height: 18, backgroundColor: "#FFF", transform: [{ rotate: "-20deg" }] },
  mapRoadOne: { left: -40, top: 76 },
  mapRoadTwo: { left: -10, top: 145, transform: [{ rotate: "24deg" }] },
  mapPin: { position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: "#E93437", alignItems: "center", justifyContent: "center" },
  mapPinText: { color: "#FFF", fontSize: 20, fontWeight: "900" },
  userPin: { position: "absolute", left: "48%", top: "58%", width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(55,132,255,0.25)", alignItems: "center", justifyContent: "center" },
  userDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#3784FF", borderWidth: 3, borderColor: "#FFF" },
  hospitalCard: { minHeight: 82, borderRadius: 16, backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#EEF0F5" },
  hospitalIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#263248", alignItems: "center", justifyContent: "center", marginRight: 10 },
  smallCall: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center" },
  profileCard: { height: 180, borderRadius: 20, backgroundColor: "#263248", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  profileAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" },
  profileAvatarText: { color: "#E93437", fontSize: 24, fontWeight: "900" },
  profileName: { color: "#FFF", fontSize: 18, fontWeight: "800", marginTop: 8 },
  profilePhone: { color: "#C9CED8", fontSize: 12, marginTop: 4 },
  profileRow: { height: 58, borderRadius: 14, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEF0F5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 8 },
  profileLabel: { color: "#263248", fontSize: 14, fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(23,32,51,0.48)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#FFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, alignItems: "center" },
  modalTitle: { color: "#172033", fontSize: 20, fontWeight: "900", textAlign: "center" },
  modalText: { color: "#7E8798", fontSize: 13, textAlign: "center", marginTop: 6, marginBottom: 16 },
  modalInput: { width: "100%", height: 50, borderRadius: 12, borderWidth: 1, borderColor: "#E4E7ED", paddingHorizontal: 14, marginBottom: 10 },
  locationButton: { height: 44, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  locationButtonText: { color: "#263248", fontSize: 13, fontWeight: "700", marginLeft: 6 },
  modalPrimary: { height: 52, width: "100%", borderRadius: 26, backgroundColor: "#E93437", alignItems: "center", justifyContent: "center" },
  modalPrimaryText: { color: "#FFF", fontSize: 15, fontWeight: "900" },
  modalCancel: { height: 44, alignItems: "center", justifyContent: "center" },
  modalCancelText: { color: "#7E8798", fontWeight: "700" },
  confirmIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: "#39A96B", alignItems: "center", justifyContent: "center", marginBottom: 14 },
});
