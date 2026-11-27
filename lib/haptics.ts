import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Small, best-effort haptic helpers.
 *
 * Haptics are a nicety, never a requirement: on the web, and on any device
 * that does not support them, the call is simply a no-op and a rejected
 * promise is swallowed so a tap can never fail because of feedback.
 */

function hasHaptics(): boolean {
  return Platform.OS === "android" || Platform.OS === "ios";
}

/** A light tap, for pressing a button or selecting something. */
export function tapFeedback(): void {
  if (!hasHaptics()) {
    return;
  }
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** A slightly firmer tap, for the actions that dial a number. */
export function callFeedback(): void {
  if (!hasHaptics()) {
    return;
  }
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

/** A success buzz, for things that completed (copied, saved). */
export function successFeedback(): void {
  if (!hasHaptics()) {
    return;
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
