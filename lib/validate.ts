import { isSafeUrl, isValidPhone } from "./links";
import type { AmbulanceListing } from "../ambulanceDirectory";

/**
 * Integrity checks for the directory.
 *
 * The numbers are transcribed by hand from public pages, so before the app
 * shows them the whole list is audited once at start-up: malformed numbers are
 * dropped, repeated numbers on the same entry are de-duplicated, entries
 * without a usable number or with a source link that is not a plain web page
 * are removed, and exact duplicates are collapsed. That way a typo in the data
 * can never turn into a call to a wrong or unsafe target.
 */

export type DroppedEntry = {
  name: string;
  district: string;
  reason: string;
};

export type DirectoryAudit = {
  kept: AmbulanceListing[];
  dropped: DroppedEntry[];
};

/** Normalise and de-duplicate the numbers of a single entry. */
export function normalisePhones(phones: string[]): string[] {
  const seen = new Set<string>();
  const normalised: string[] = [];
  phones.forEach((phone) => {
    const candidate = typeof phone === "string" ? phone.trim() : "";
    if (!isValidPhone(candidate) || seen.has(candidate)) {
      return;
    }
    seen.add(candidate);
    normalised.push(candidate);
  });
  return normalised;
}

function entryKey(item: AmbulanceListing): string {
  return [item.district, item.name, item.phones.join(",")]
    .join("|")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function auditDirectory(items: AmbulanceListing[]): DirectoryAudit {
  const seen = new Set<string>();
  const kept: AmbulanceListing[] = [];
  const dropped: DroppedEntry[] = [];

  items.forEach((item) => {
    const phones = normalisePhones(item.phones ?? []);
    if (phones.length === 0) {
      dropped.push({ name: item.name, district: item.district, reason: "no usable phone number" });
      return;
    }
    if (!isSafeUrl(item.source?.url ?? "")) {
      dropped.push({ name: item.name, district: item.district, reason: "source link is not a web page" });
      return;
    }
    const key = entryKey(item);
    if (seen.has(key)) {
      dropped.push({ name: item.name, district: item.district, reason: "duplicate entry" });
      return;
    }
    seen.add(key);
    kept.push({ ...item, phones });
  });

  return { kept, dropped };
}
