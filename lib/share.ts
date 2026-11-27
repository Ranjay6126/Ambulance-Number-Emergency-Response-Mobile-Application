import { Alert, Platform, Share } from "react-native";
import { listingLocation, nationalAmbulanceNumber, type AmbulanceListing } from "../ambulanceDirectory";
import { coordsToOrigin, mapsSearchUrl } from "./links";

type WebNavigator = Navigator & {
  share?: (data: { title?: string; text?: string }) => Promise<void>;
};

/**
 * Share text through whatever the device offers: the native share sheet on
 * Android and iOS, the browser's Web Share API on the web. Nothing is sent
 * anywhere by SwiftCare itself — the user chooses the destination.
 */
export async function shareMessage(message: string, title: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      const nav = typeof navigator !== "undefined" ? (navigator as WebNavigator) : undefined;
      if (nav?.share) {
        await nav.share({ title, text: message });
        return;
      }
      Alert.alert("Sharing not available here", "Copy the details and send them yourself.");
      return;
    }
    await Share.share({ message, title });
  } catch (error) {
    // Cancelling the share sheet rejects on iOS; that is not a failure.
    if (error instanceof Error && /cancel/i.test(error.message)) {
      return;
    }
    Alert.alert("Unable to share", "Please try again.");
  }
}

/** Share a single provider with its numbers and source, ready to forward. */
export async function shareProvider(item: AmbulanceListing): Promise<void> {
  const lines = [
    `${item.name} — ${listingLocation(item)}`,
    item.phones.map((phone) => `☎ ${phone}`).join("\n"),
    `Source: ${item.source.url}`,
    "Shared from SwiftCare (Nepal ambulance & emergency numbers).",
  ];
  await shareMessage(lines.join("\n\n"), item.name);
}

/**
 * A ready-to-forward emergency message. When the device has a position the
 * message carries a map pin (already coarsened by `coordsToOrigin`), so a
 * family member or dispatcher can open the exact spot; without one it still
 * names the district and the national ambulance line.
 */
export async function shareEmergencyLocation(
  coords: { latitude: number; longitude: number } | null,
  area?: string,
): Promise<void> {
  const origin = coordsToOrigin(coords);
  const lines = [
    "Emergency — I need help. Please send an ambulance.",
    area ? `I am in ${area}.` : undefined,
    origin ? `My location: ${mapsSearchUrl(origin)}` : "I could not include a map pin — call me back to ask for directions.",
    `Nepal ambulance: ${nationalAmbulanceNumber}`,
    "Sent from SwiftCare.",
  ].filter((line): line is string => Boolean(line));
  await shareMessage(lines.join("\n\n"), "Emergency location");
}
