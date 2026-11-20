import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { LocationObjectCoords } from "expo-location";
import { colors, radius } from "../theme";
import { AmbulanceCard } from "../components/AmbulanceCard";
import { Chip, EmptyState, Icon, NoticeCard, ScreenTitle } from "../components/ui";
import { callPhone, coordsToOrigin, openMapsDirections, openUrl } from "../lib/links";
import {
  ambulanceDirectory,
  countByProvince,
  emergencyNumbers,
  listingLocation,
  nationalAmbulanceNumber,
  provincePoliceOffices,
  provinces,
  type AmbulanceListing,
} from "../ambulanceDirectory";

type Segment = "Providers" | "Helplines";

type Props = {
  location: LocationObjectCoords | null;
};

export function DirectoryScreen({ location }: Props) {
  const [segment, setSegment] = useState<Segment>("Providers");
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState<"All" | (typeof provinces)[number]>("All");

  const origin = coordsToOrigin(location);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ambulanceDirectory.filter((item) => {
      const matchesProvince = province === "All" || item.province === province;
      if (!matchesProvince) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const haystack = [item.name, item.area ?? "", item.district, item.province, ...item.phones]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, province]);

  const routeTo = (item: AmbulanceListing) =>
    openMapsDirections({ destination: listingLocation(item), origin });

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <ScreenTitle
        title="Nepal Ambulance Directory"
        subtitle="Real ambulance and emergency numbers published by hospitals, municipalities and the Nepal Red Cross Society. Every district of Nepal is covered. Confirm availability and service area when you call."
      />

      <View style={styles.segment}>
        {(["Providers", "Helplines"] as Segment[]).map((item) => (
          <Pressable
            key={item}
            onPress={() => setSegment(item)}
            style={[styles.segmentItem, segment === item && styles.segmentItemActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: segment === item }}
          >
            <Text style={[styles.segmentText, segment === item && styles.segmentTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {segment === "Providers" ? (
        <>
          <View style={styles.searchBox}>
            <Icon name="search" size={18} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search district, nagarpalika, hospital or number"
              placeholderTextColor={colors.faint}
              style={styles.searchInput}
              accessibilityLabel="Search ambulance providers"
              returnKeyType="search"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery("")} accessibilityRole="button" accessibilityLabel="Clear search">
                <Icon name="close" size={18} color={colors.muted} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip label={`All ${ambulanceDirectory.length}`} active={province === "All"} onPress={() => setProvince("All")} />
            {provinces.map((name) => (
              <Chip
                key={name}
                label={`${name} ${countByProvince(name)}`}
                active={province === name}
                onPress={() => setProvince(name)}
              />
            ))}
          </ScrollView>

          <Text style={styles.resultCount}>
            {results.length} {results.length === 1 ? "contact" : "contacts"}
            {province === "All" ? "" : ` in ${province}`}
          </Text>

          {results.length > 0 ? (
            results.map((item) => (
              <AmbulanceCard
                key={item.id}
                item={item}
                onCall={callPhone}
                onDirections={routeTo}
                onOpenSource={(url) => openUrl(url, "Unable to open the source page")}
              />
            ))
          ) : (
            <EmptyState message="No published contact matches this search. Try another district or the national number 102." />
          )}

          <NoticeCard tone="info">
            Every district has a Nepal Red Cross Society chapter line (tagged "District chapter"), which covers the villages and rural municipalities inside it. Cities and nagarpalika lines are tagged "Municipality" or "Metropolitan city". Where a ward or village publishes no ambulance number of its own, call its district chapter or the national number 102.
          </NoticeCard>
        </>
      ) : (
        <>
          <Text style={styles.groupTitle}>National emergency short codes</Text>
          {emergencyNumbers.map((entry) => (
            <View key={entry.id} style={styles.helpline}>
              <Pressable style={styles.helplineNumber} onPress={() => callPhone(entry.number)} accessibilityRole="button">
                <Text style={styles.helplineNumberText}>{entry.number}</Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={styles.helplineLabel}>{entry.label}</Text>
                <Text style={styles.helplineDescription}>{entry.description}</Text>
                <Pressable onPress={() => openUrl(entry.source.url, "Unable to open the source")}>
                  <Text style={styles.source} numberOfLines={1}>
                    Source: {entry.source.name}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}

          <Text style={[styles.groupTitle, { marginTop: 8 }]}>Province police control rooms</Text>
          <Text style={styles.groupHint}>
            Each province office coordinates the district offices below it. Police control on 100 reaches all of them.
          </Text>
          {provincePoliceOffices.map((office) => (
            <View key={office.province} style={styles.policeCard}>
              <View style={styles.policeHead}>
                <View>
                  <Text style={styles.policeProvince}>{office.province}</Text>
                  <Text style={styles.policeCity}>{office.city}</Text>
                </View>
                <Pressable
                  style={styles.policeCall}
                  onPress={() => callPhone(office.phones[0])}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${office.province} province police`}
                >
                  <Icon name="phone" size={14} color={colors.white} />
                  <Text style={styles.policeCallText}>{office.phones[0]}</Text>
                </Pressable>
              </View>
              <Text style={styles.policeDistricts}>{office.districts}</Text>
              {office.phones.length > 1 ? (
                <View style={styles.policeAlt}>
                  {office.phones.slice(1).map((phone) => (
                    <Chip key={phone} label={phone} onPress={() => callPhone(phone)} />
                  ))}
                </View>
              ) : null}
            </View>
          ))}

          <NoticeCard tone="info">
            {`Short codes such as ${nationalAmbulanceNumber} work only inside Nepal. From abroad, dial the full number with the +977 country code.`}
          </NoticeCard>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 28 },

  segment: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: 14,
  },
  segmentItem: { flex: 1, minHeight: 38, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  segmentItemActive: { backgroundColor: colors.inkSoft },
  segmentText: { color: colors.muted, fontSize: 13, fontWeight: "800" },
  segmentTextActive: { color: colors.white },

  searchBox: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: { flex: 1, height: 48, paddingHorizontal: 8, color: colors.inkSoft },

  chips: { gap: 8, paddingVertical: 2, paddingBottom: 14 },
  resultCount: { color: colors.muted, fontSize: 11.5, fontWeight: "700", marginBottom: 10 },

  groupTitle: { color: colors.ink, fontSize: 16, fontWeight: "800", marginBottom: 10 },
  groupHint: { color: colors.muted, fontSize: 11.5, lineHeight: 17, marginBottom: 12 },

  helpline: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  helplineNumber: {
    minWidth: 62,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  helplineNumberText: { color: colors.primary, fontSize: 18, fontWeight: "900" },
  helplineLabel: { color: colors.inkSoft, fontSize: 13.5, fontWeight: "800" },
  helplineDescription: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  source: { color: colors.link, fontSize: 10.5, fontWeight: "700", marginTop: 5 },

  policeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    marginBottom: 10,
  },
  policeHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  policeProvince: { color: colors.inkSoft, fontSize: 14, fontWeight: "800" },
  policeCity: { color: colors.muted, fontSize: 11, marginTop: 3 },
  policeCall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.inkSoft,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  policeCallText: { color: colors.white, fontSize: 12.5, fontWeight: "800" },
  policeDistricts: { color: colors.muted, fontSize: 10.5, lineHeight: 15, marginTop: 10 },
  policeAlt: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
});
