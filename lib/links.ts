import { Alert, Linking } from "react-native";

/**
 * Small helpers that open the phone dialer and Google Maps.
 * Google Maps is used for road routing so the user sees real roads and traffic,
 * without shipping map tiles or an API key inside the app.
 */

/** Strip spaces and dashes so `tel:` links behave on every platform. */
export function dialableNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function callPhone(phone: string): void {
  Linking.openURL(`tel:${dialableNumber(phone)}`).catch(() =>
    Alert.alert("Unable to start the call", `Please dial ${phone} directly from your phone.`),
  );
}

export function openUrl(url: string, failureTitle = "Unable to open the link"): void {
  Linking.openURL(url).catch(() =>
    Alert.alert(failureTitle, "Check your internet connection and try again."),
  );
}

export type TravelMode = "driving" | "walking" | "transit" | "bicycling";

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
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
    `&destination=${encodeURIComponent(destination)}` +
    `&travelmode=${travelMode}`;
  if (origin) {
    url += `&origin=${encodeURIComponent(origin)}`;
  }
  return url;
}

export function openMapsSearch(query: string): void {
  openUrl(mapsSearchUrl(query), "Unable to open maps");
}

export function openMapsDirections(args: DirectionsArgs): void {
  openUrl(mapsDirectionsUrl(args), "Unable to open maps");
}

/** Turn device coordinates into the "lat,lng" string Google Maps expects. */
export function coordsToOrigin(coords: { latitude: number; longitude: number } | null): string | undefined {
  if (!coords) {
    return undefined;
  }
  return `${coords.latitude.toFixed(5)},${coords.longitude.toFixed(5)}`;
}
