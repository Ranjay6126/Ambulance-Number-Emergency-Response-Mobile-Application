import { ambulanceDirectory, type AmbulanceListing, type Province } from "../ambulanceDirectory";

/**
 * A prebuilt search index.
 *
 * Building a lower-cased haystack for every listing once, at module load, keeps
 * filtering cheap: typing in the search box only walks a list of plain strings
 * instead of re-joining and re-lowering hundreds of objects on every keystroke.
 */

type IndexedListing = {
  item: AmbulanceListing;
  haystack: string;
};

const INDEX: IndexedListing[] = ambulanceDirectory.map((item) => ({
  item,
  haystack: [item.name, item.area ?? "", item.district, item.province, ...item.phones].join(" ").toLowerCase(),
}));

export type SearchOptions = {
  province?: Province | "All";
  /** Stop after this many matches — handy for type-ahead suggestions. */
  limit?: number;
};

/** Filter the directory by free text and/or province, fastest case first. */
export function searchDirectory(query: string, options: SearchOptions = {}): AmbulanceListing[] {
  const { province = "All", limit } = options;
  const needle = query.trim().toLowerCase();
  const matches: AmbulanceListing[] = [];

  for (const entry of INDEX) {
    if (province !== "All" && entry.item.province !== province) {
      continue;
    }
    if (needle && !entry.haystack.includes(needle)) {
      continue;
    }
    matches.push(entry.item);
    if (limit !== undefined && matches.length >= limit) {
      break;
    }
  }

  return matches;
}

/** Number of listings in the index (used in tests and diagnostics). */
export function searchIndexSize(): number {
  return INDEX.length;
}
