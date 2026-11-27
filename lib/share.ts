import { Alert, Platform, Share } from "react-native";
import { listingLocation, type AmbulanceListing } from "../ambulanceDirectory";

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
