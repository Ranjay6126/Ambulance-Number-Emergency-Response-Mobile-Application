import React, { useRef } from "react";
import { Animated, Pressable, type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { callFeedback, tapFeedback } from "../lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  /** Fire a haptic tap when the finger goes down. */
  haptic?: "none" | "light" | "call";
  /** How far the content shrinks while pressed. */
  scaleTo?: number;
};

/**
 * A pressable that springs slightly inwards while held, with optional haptic
 * feedback. It keeps all of the caller's layout styles on the pressable itself,
 * so it can be dropped in wherever a Pressable already was — giving cards and
 * tiles the tactile "native" feel of a mobile app instead of a flat click.
 */
export function PressScale({
  style,
  children,
  haptic = "none",
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const spring = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 5,
    }).start();
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    spring(scaleTo);
    if (haptic === "call") {
      callFeedback();
    } else if (haptic === "light") {
      tapFeedback();
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    spring(1);
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable {...rest} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[style, { transform: [{ scale }] }]}>
      {children}
    </AnimatedPressable>
  );
}
