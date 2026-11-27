import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { LocationObjectCoords } from "expo-location";
import { colors, radius, spacing, typography } from "../theme";
import { AmbulanceCard } from "../components/AmbulanceCard";
import { Chip, EmptyState, Icon, NoticeCard, ScreenTitle, SearchField, Segmented } from "../components/ui";
import { callPhone, cleanText, coordsToOrigin, openMapsDirections, openUrl } from "../lib/links";
import { pageContainer, useResponsive } from "../lib/responsive";
import {
  ambulanceDirectory,
  countByProvince,
  emergencyNumbers,
  listingLocation,
  nationalAmbulanceNumber,
  provincePoliceOffices,
  provinces,
  type AmbulanceListing,
  type Province,
} from "../ambulanceDirectory";

type Segment = "Providers" | "Helplines";

type Props = {
  location: LocationObjectCoords | null;
};

const SEGMENTS: { key: Segment; label: string; icon: "list" | "phone" }[] = [
  { key: "Providers", label: "Providers", icon: "list" },
  { key: "Helplines", label: "Helplines", icon: "phone" },
];

export function DirectoryScreen({ location }: Props) {
  const layout = useResponsive();
  const [segment, setSegment] = useState<Segment>("Providers");
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState<"All" | Province>("All");

  const origin = coordsToOrigin(location);

  const results = useMemo(() => {
    const needle = query.toLowerCase();
    return ambulanceDirectory.filter((item) => {
      if (province !== "All" && item.province !== province) {
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

  const routeTo = useCallback(
    (item: AmbulanceListing) => openMapsDirections({ destination: listingLocation(item), origin }),
    [origin],
  );
  const openSource = useCallback((url: string) => openUrl(url, "Unable to open the source page"), []);

  const hasColumns = layout.columns > 1;

  const renderCard = (item: AmbulanceListing) => (
    <AmbulanceCard
      item={item}
      onCall={callPhone}
      onDirections={routeTo}
      onOpenSource={openSource}
    />
  );

  const heading = (
    <>
      <ScreenTitle
        eyebrow="Nepal directory"
        title="Ambulance & emergency numbers"
        subtitle="Numbers published by hospitals, municipalities and the Nepal Red Cross Society. Confirm availability and service area when you call."
      />
      <Segmented
        options={SEGMENTS}
        value={segment}
        onChange={setSegment}
        accessibilityLabel="Choose providers or helplines"
      />
    </>
  );

  if (segment === "Helplines") {
    return (
      <ScrollView contentContainerStyle={[styles.page, pageContainer(layout)]} showsVerticalScrollIndicator={false}>
        {heading}

        <Text style={styles.groupTitle}>National emergency short codes</Text>
        {emergencyNumbers.map((entry) => (
          <View key={entry.id} style={styles.helpline}>
            <Pressable
              style={styles.helplineNumber}
              onPress={() => callPhone(entry.number)}
              accessibilityRole="button"
              accessibilityLabel={`Call ${entry.label} on ${entry.number}`}
            >
              <Text style={styles.helplineNumberText}>{entry.number}</Text>
            </Pressable>
            <View style={styles.helplineBody}>
              <Text style={styles.helplineLabel}>{entry.label}</Text>
              <Text style={styles.helplineDescription}>{entry.description}</Text>
              <Pressable
                onPress={() => openUrl(entry.source.url, "Unable to open the source")}
                accessibilityRole="link"
                accessibilityLabel={`Open source: ${entry.source.name}`}
              >
                <Text style={styles.source} numberOfLines={1}>
                  Source: {entry.source.name}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={[styles.groupTitle, styles.groupTitleSpaced]}>Province police control rooms</Text>
        <Text style={styles.groupHint}>
          Each province office coordinates the district offices below it. Police control on 100 reaches all of them.
        </Text>
        {provincePoliceOffices.map((office) => (
          <View key={office.province} style={styles.policeCard}>
            <View style={styles.policeHead}>
              <View style={styles.policeBody}>
                <Text style={styles.policeProvince}>{office.province}</Text>
                <Text style={styles.policeCity}>{office.city}</Text>
              </View>
              <Pressable
                style={styles.policeCall}
                onPress={() => callPhone(office.phones[0])}
                accessibilityRole="button"
                accessibilityLabel={`Call ${office.province} province police on ${office.phones[0]}`}
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
      </ScrollView>
    );
  }

  return (
    <FlatList
      key={hasColumns ? "grid" : "list"}
      data={results}
      keyExtractor={(item) => item.id}
      numColumns={layout.columns}
      columnWrapperStyle={hasColumns ? styles.column : undefined}
      contentContainerStyle={[styles.page, pageContainer(layout)]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
      renderItem={({ item }) => (hasColumns ? <View style={styles.cell}>{renderCard(item)}</View> : renderCard(item))}
      ListHeaderComponent={
        <>
          {heading}
          <View style={styles.searchWrap}>
            <SearchField
              value={query}
              onChangeText={(text) => setQuery(cleanText(text))}
              placeholder="Search district, city, hospital or number"
              accessibilityLabel="Search ambulance providers"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip
              label={`All ${ambulanceDirectory.length}`}
              active={province === "All"}
              onPress={() => setProvince("All")}
            />
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
        </>
      }
      ListEmptyComponent={
        <EmptyState
          title="No match"
          message={`No published contact matches “${query}”. Try another district or call the national number ${nationalAmbulanceNumber}.`}
        />
      }
      ListFooterComponent={
        <NoticeCard tone="info" title="How coverage works">
          {`Every district has a Nepal Red Cross Society chapter line (tagged "District chapter"), which covers the villages and rural municipalities inside it. Cities and nagarpalika lines are tagged "Municipality" or "Metropolitan city". Where a ward or village publishes no number of its own, call its district chapter or the national number ${nationalAmbulanceNumber}.`}
        </NoticeCard>
      }
    />
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.xs, paddingBottom: spacing.xxl },

  searchWrap: { marginTop: spacing.lg },

  chips: { gap: spacing.sm, paddingVertical: spacing.sm + 2, paddingBottom: spacing.md },
  resultCount: { color: colors.neutral, fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: spacing.md },

  column: { gap: spacing.md },
  cell: { flex: 1 },

  groupTitle: { color: colors.ink, fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing.lg, marginBottom: spacing.md },
  groupTitleSpaced: { marginTop: spacing.md },
  groupHint: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginBottom: spacing.md, marginTop: -spacing.xs },

  helpline: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  helplineNumber: {
    minWidth: 64,
    minHeight: 54,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm + 2,
  },
  helplineNumberText: { color: colors.primary, fontSize: typography.size.xl, fontWeight: typography.weight.black },
  helplineBody: { flex: 1 },
  helplineLabel: { color: colors.ink, fontSize: typography.size.md, fontWeight: typography.weight.bold },
  helplineDescription: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginTop: 3 },
  source: { color: colors.link, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, marginTop: spacing.md - 2 },

  policeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg - 2,
    marginBottom: spacing.sm + 2,
  },
  policeHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  policeBody: { flex: 1 },
  policeProvince: { color: colors.ink, fontSize: typography.size.md, fontWeight: typography.weight.bold },
  policeCity: { color: colors.muted, fontSize: typography.size.sm, marginTop: 3 },
  policeCall: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm - 2,
    backgroundColor: colors.inkSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  policeCallText: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.bold },
  policeDistricts: { color: colors.muted, fontSize: typography.size.xs + 0.5, lineHeight: typography.lineHeight.xs, marginTop: spacing.sm + 2 },
  policeAlt: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm + 2, flexWrap: "wrap" },
});
