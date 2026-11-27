import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";
import { successFeedback } from "./haptics";

/**
 * Copy a value (usually a phone number) to the clipboard.
 *
 * Copying matters in an emergency: the caller may want to paste the number into
 * a message to a family member instead of dialling it themselves, so every
 * published number is available on the clipboard in one tap.
 */
export async function copyText(value: string, label = "Number"): Promise<void> {
  try {
    await Clipboard.setStringAsync(value);
    successFeedback();
    Alert.alert("Copied", `${label} ${value} is now on your clipboard.`);
  } catch {
    Alert.alert("Unable to copy", `Please copy ${value} manually.`);
  }
}
