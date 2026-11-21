import { Alert, Linking } from "react-native";

/**
 * Small helpers that open the phone dialer and Google Maps.
 * Google Maps is used for road routing so the user sees real roads and traffic,
 * without shipping map tiles or an API key inside the app.
 *
 * Everything that reaches Linking.openURL first goes through the guards below:
 * only http, https and tel are allowed, a web address must have a real host and
 * must not carry embedded credentials, and a number is only dialled when it
 * looks like a phone number. A wrong or tampered directory entry therefore
 * cannot hand an unexpected scheme (javascript:, data:, intent:, file: …) to
 * the operating system.
 */

const ALLOWED_PROTOCOLS: ReadonlySet<string> = new Set(["http:", "https:", "tel:"]);
const MAX_URL_LENGTH = 2048;
const MAX_QUERY_LENGTH = 120;
/** Kept without the `g` flag so `.test()` stays stateless. */
const CONTROL_CHARACTER = /[\u0000-\u001F\u007F]/;
const CONTROL_CHARACTERS_ALL = /[\u0000-\u001F\u007F]/g;

/** Strip spaces, dashes and brackets so `tel:` links behave on every platform. */
export function dialableNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * True for the numbers this app publishes: Nepal's three and four digit short
 * codes (100, 101, 102, 103, 1130, 1234), national numbers and international
 * numbers written with a leading "+".
 */
export function isValidPhone(phone: string): boolean {
  const number = dialableNumber(phone);
  if (number.startsWith("+")) {
    return /^\+[1-9]\d{6,14}$/.test(number);
  }
  return /^\d{3,12}$/.test(number);
}

/** Trim a free-text value and drop control characters before it is used. */
export function cleanText(value: string, maxLength = MAX_QUERY_LENGTH): string {
  return value.replace(CONTROL_CHARACTERS_ALL, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

/**
 * Only http, https and tel links are considered safe. Web links need a host
 * with a dot in it and must not embed credentials (the classic
 * `https://trusted-looking.com@evil.example` trick).
 */
export function isSafeUrl(url: string): boolean {
  if (typeof url !== "string") {
    return false;
  }
  const value = url.trim();
  if (!value || value.length > MAX_URL_LENGTH) {
    return false;
  }
  if (CONTROL_CHARACTER.test(value)) {
    return false;
  }
  const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):(.+)$/.exec(value);
  if (!match) {
    return false;
  }
  const protocol = `${match[1].toLowerCase()}:`;
  if (!ALLOWED_PROTOCOLS.has(protocol)) {
    return false;
  }
  const rest = match[2];
  if (protocol === "tel:") {
    return isValidPhone(rest);
  }
  const authority = /^\/\/([^/?#]*)/.exec(rest)?.[1];
  if (!authority || !authority.includes(".") || authority.includes("@")) {
    return false;
  }
  return true;
}

export function callPhone(phone: string): void {
  const number = dialableNumber(phone);
  if (!isValidPhone(number)) {
    Alert.alert("Number looks invalid", `SwiftCare cannot dial “${phone}”. Please check the number and try again.`);
    return;
  }
  Linking.openURL(`tel:${number}`).catch(() =>
    Alert.alert("Unable to start the call", `Please dial ${phone} directly from your phone.`),
  );
}

export function openUrl(url: string, failureTitle = "Unable to open the link"): void {
  if (!isSafeUrl(url)) {
    Alert.alert(failureTitle, "SwiftCare blocked this link because it is not a safe web or phone address.");
    return;
  }
  Linking.openURL(url).catch(() =>
    Alert.alert(failureTitle, "Check your internet connection and try again."),
  );
}

export type TravelMode = "driving" | "walking" | "transit" | "bicycling";

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanText(query, 160))}`;
}

export type DirectionsArgs = {
  destination: string;
  /** "lat,lng" or a place name. When omitted Google Maps uses the device location. */
  origin?: string;
  travelMode?: TravelMode;
};

/** Google Maps directions URL — always renders the actual road route. */
export function mapsDirectionsUrl({ destination, origin, travelMode = "driving" }: DirectionsArgs): string {
  let url =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${encodeURIComponent(cleanText(destination, 160))}` +
    `&travelmode=${travelMode}`;
  if (origin) {
    url += `&origin=${encodeURIComponent(cleanText(origin, 64))}`;
  }
  return url;
}

export function openMapsSearch(query: string): void {
  openUrl(mapsSearchUrl(query), "Unable to open maps");
}

export function openMapsDirections(args: DirectionsArgs): void {
  openUrl(mapsDirectionsUrl(args), "Unable to open maps");
}

/** Metres of precision are dropped before a position ever leaves the module. */
const COORDINATE_PRECISION = 4;

/** True when a position is a real, usable latitude/longitude pair. */
export function isValidPosition(coords: { latitude: number; longitude: number } | null): boolean {
  if (!coords || !Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) {
    return false;
  }
  return Math.abs(coords.latitude) <= 90 && Math.abs(coords.longitude) <= 180;
}

/** Round a position to roughly 11 m, which is all routing and matching need. */
export function coarsenPosition(coords: { latitude: number; longitude: number }): {
  latitude: number;
  longitude: number;
} {
  return {
    latitude: Number(coords.latitude.toFixed(COORDINATE_PRECISION)),
    longitude: Number(coords.longitude.toFixed(COORDINATE_PRECISION)),
  };
}

/**
 * Turn device coordinates into the "lat,lng" string Google Maps expects.
 * Invalid positions are ignored rather than passed on, and the value is
 * coarsened first so a precise fix is never handed to a third party.
 */
export function coordsToOrigin(coords: { latitude: number; longitude: number } | null): string | undefined {
  if (!isValidPosition(coords) || !coords) {
    return undefined;
  }
  const { latitude, longitude } = coarsenPosition(coords);
  return `${latitude},${longitude}`;
}
