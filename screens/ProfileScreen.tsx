import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../theme";
import { Icon, IconTile, InfoRow, NoticeCard, ScreenTitle, StatTile, type IconName } from "../components/ui";
import { openUrl } from "../lib/links";
import { ambulanceDirectory, countByProvince, emergencyNumbers, provincePoliceOffices, provinces } from "../ambulanceDirectory";
import appJson from "../app.json";

const APP_VERSION = appJson.expo.version;

const SECURITY_ITEMS: { icon: IconName; title: string; detail: string }[] = [
  {
    icon: "server",
    title: "Works offline",
    detail: "All directory data ships inside the app. No connection is needed to read it.",
  },
  {
    icon: "lock",
    title: "No account, no sign-in",
    detail: "There is nothing to register and no personal profile to create.",
  },
  {
    icon: "analytics",
    title: "No tracking",
    detail: "No analytics, no advertising and no third-party tracking SDKs.",
  },
  {
    icon: "key",
    title: "No keys or secrets",
    detail: "The app stores no API keys, tokens or server credentials.",
  },
  {
    icon: "external",
    title: "Validated links",
    detail: "Outbound links are checked: only http, https and tel are ever opened.",
  },
  {
    icon: "phone",
    title: "Invalid numbers blocked",
    detail: "A number that does not look valid is never dialled.",
  },
  {
    icon: "location",
    title: "Position stays on device",
    detail: "Your position is rounded before use, kept in memory only, and never stored or uploaded.",
  },
  {
    icon: "globe",
    title: "Public numbers only",
    detail: "SwiftCare only reads the numbers that are already published publicly.",
  },
];

export function ProfileScreen() {
  const districtCount = useMemo(() => new Set(ambulanceDirectory.map((item) => item.district)).size, []);
  const maxProvinceCount = useMemo(
    () => Math.max(...provinces.map((name) => countByProvince(name)), 1),
    [],
  );

  const sources = useMemo(() => {
    const map = new Map<string, { name: string; url: string }>();
    ambulanceDirectory.forEach((item) => map.set(item.source.url, item.source));
    emergencyNumbers.forEach((entry) => map.set(entry.source.url, entry.source));
    provincePoliceOffices.forEach((office) => map.set(office.source.url, office.source));
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <ScreenTitle
        eyebrow="About"
        title="Coverage & trust"
        subtitle="What SwiftCare contains, where the numbers come from and how your privacy is protected."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroMark}>
          <Icon name="ambulance" size={26} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>SwiftCare</Text>
        <Text style={styles.heroSub}>Nepal ambulance & emergency numbers</Text>
        <View style={styles.heroStats}>
          <StatTile value={`${ambulanceDirectory.length}`} label="Listings" icon="list" tone="danger" />
          <StatTile value={`${districtCount}`} label="Districts" icon="pin" tone="info" />
          <StatTile value={`${provinces.length}`} label="Provinces" icon="grid" tone="success" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Listings per province</Text>
      <View style={styles.provinceCard}>
        {provinces.map((name, index) => {
          const count = countByProvince(name);
          const ratio = count / maxProvinceCount;
          return (
            <View key={name} style={[styles.provinceRow, index > 0 && styles.provinceRowBordered]}>
              <Text style={styles.provinceName}>{name}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.round(ratio * 100)}%` }]} />
              </View>
              <Text style={styles.provinceCount}>{count}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Data sources</Text>
      <View style={styles.sourceList}>
        {sources.map((source) => (
          <InfoRow
            key={source.url}
            icon="external"
            title={source.name}
            onPress={() => openUrl(source.url, "Unable to open the source")}
            trailing={<Icon name="external" size={16} color={colors.link} />}
          />
        ))}
      </View>

      <NoticeCard tone="warning" title="Confirm before you rely on it">
        These numbers are transcribed by hand from public web pages and may change without notice. SwiftCare is not an
        official dispatch service and does not confirm that a service is available right now. Always check availability and
        the service area when you call.
      </NoticeCard>

      <View style={styles.securityCard}>
        <View style={styles.securityHead}>
          <IconTile name="shield" tone="success" />
          <View style={styles.securityHeadText}>
            <Text style={styles.securityTitle}>Security & privacy</Text>
            <Text style={styles.securitySubtitle}>How SwiftCare protects your data</Text>
          </View>
        </View>
        {SECURITY_ITEMS.map((item, index) => (
          <View key={item.title} style={[styles.securityItem, index > 0 && styles.securityItemBordered]}>
            <Icon name={item.icon} size={17} color={colors.success} />
            <View style={styles.securityItemBody}>
              <Text style={styles.securityItemTitle}>{item.title}</Text>
              <Text style={styles.securityItemDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.version}>SwiftCare · version {APP_VERSION}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: spacing.xl, paddingTop: spacing.xs, paddingBottom: spacing.xxl },

  heroCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroMark: {
    width: 62,
    height: 62,
    borderRadius: radius.xl - 4,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { color: colors.white, fontSize: typography.size.xl, fontWeight: typography.weight.black, marginTop: spacing.md },
  heroSub: { color: colors.neutralLight, fontSize: typography.size.sm, marginTop: spacing.xs },
  heroStats: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: spacing.xl,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
  },

  sectionTitle: { color: colors.ink, fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing.md, marginBottom: spacing.md },

  provinceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg - 2,
  },
  provinceRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  provinceRowBordered: { borderTopWidth: 1, borderTopColor: colors.borderSoft },
  provinceName: { width: 96, color: colors.inkSoft, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  barTrack: { flex: 1, height: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, overflow: "hidden" },
  barFill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.primary },
  provinceCount: { width: 30, textAlign: "right", color: colors.ink, fontSize: typography.size.sm, fontWeight: typography.weight.bold },

  sourceList: { gap: spacing.sm },

  securityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg - 2,
    paddingBottom: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  securityHead: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.lg - 2 },
  securityHeadText: { flex: 1 },
  securityTitle: { color: colors.ink, fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  securitySubtitle: { color: colors.muted, fontSize: typography.size.sm, marginTop: 2 },
  securityItem: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, paddingVertical: spacing.md },
  securityItemBordered: { borderTopWidth: 1, borderTopColor: colors.borderSoft },
  securityItemBody: { flex: 1 },
  securityItemTitle: { color: colors.inkSoft, fontSize: typography.size.sm + 0.5, fontWeight: typography.weight.bold },
  securityItemDetail: { color: colors.muted, fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, marginTop: 3 },

  version: { color: colors.faint, fontSize: typography.size.sm, textAlign: "center", fontWeight: typography.weight.semibold },
});
