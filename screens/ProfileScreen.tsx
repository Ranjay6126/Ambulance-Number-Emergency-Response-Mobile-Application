import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../theme";
import { Icon, ScreenTitle, type IconName } from "../components/ui";
import { ambulanceDirectory, emergencyNumbers, provincePoliceOffices } from "../ambulanceDirectory";

const ROWS: { label: string; detail: string; icon: IconName }[] = [
  { label: "My emergency contacts", detail: "Save family and neighbour numbers", icon: "heart" },
  { label: "Medical information", detail: "Blood group and allergies", icon: "shield" },
  { label: "Saved providers", detail: "Your shortlisted ambulance services", icon: "list" },
  { label: "Offline directory", detail: "Works without mobile data", icon: "globe" },
  { label: "Settings", detail: "Language, units and permissions", icon: "grid" },
];

export function ProfileScreen() {
  const stats = [
    { value: `${ambulanceDirectory.length}`, label: "Ambulance lines" },
    { value: `${provincePoliceOffices.length}`, label: "Provinces" },
    { value: `${emergencyNumbers.length}`, label: "Helplines" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <ScreenTitle title="Profile" subtitle="SwiftCare keeps your saved contacts and the public directory on your device." />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Icon name="profile" size={30} color={colors.primary} />
        </View>
        <Text style={styles.name}>Your profile</Text>
        <Text style={styles.phone}>Phone number not set</Text>
        <View style={styles.statRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {ROWS.map((row) => (
        <Pressable
          key={row.label}
          style={styles.row}
          onPress={() => Alert.alert(row.label, row.detail)}
          accessibilityRole="button"
        >
          <View style={styles.rowIcon}>
            <Icon name={row.icon} size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowDetail}>{row.detail}</Text>
          </View>
          <Icon name="chevron" size={18} color={colors.faint} />
        </Pressable>
      ))}

      <Text style={styles.footnote}>
        SwiftCare is an offline directory of publicly published ambulance numbers. It is not an official dispatch service and
        does not verify live availability.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 28 },

  profileCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { color: colors.white, fontSize: 18, fontWeight: "800", marginTop: 10 },
  phone: { color: "#C9CED8", fontSize: 12, marginTop: 4 },
  statRow: {
    flexDirection: "row",
    marginTop: 18,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { color: colors.white, fontSize: 17, fontWeight: "900" },
  statLabel: { color: "#B9C0CC", fontSize: 10.5, marginTop: 3 },

  row: {
    minHeight: 62,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { color: colors.inkSoft, fontSize: 13.5, fontWeight: "700" },
  rowDetail: { color: colors.muted, fontSize: 10.5, marginTop: 2 },

  footnote: { color: colors.faint, fontSize: 10.5, lineHeight: 16, marginTop: 8 },
});
