// Home header brand lockup: bag logo, gold-foil "UR Shop" and the tagline.
// One motion moment when the screen opens (the foil shines); tapping replays
// it with a small hop of the bag and a light haptic tick.
import React, { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import BrandMark from "@components/BrandMark";
import BrandWordmark, { type BrandWordmarkHandle } from "@components/BrandWordmark";

type Props = { tagline?: string };

export default function BrandHeaderLockup({ tagline }: Props) {
  const wordmark = useRef<BrandWordmarkHandle>(null);
  const reduceMotion = useReducedMotion();
  const lift = useSharedValue(0);
  const tilt = useSharedValue(0);

  const bagStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }, { rotate: `${tilt.value}deg` }],
  }));

  const celebrate = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    wordmark.current?.shine();
    if (reduceMotion) return;
    lift.value = withSequence(
      withTiming(-7, { duration: 140 }),
      withSpring(0, { damping: 7, stiffness: 240 }),
    );
    tilt.value = withSequence(
      withTiming(-8, { duration: 140 }),
      withTiming(5, { duration: 170 }),
      withSpring(0, { damping: 8, stiffness: 200 }),
    );
  };

  return (
    <Pressable
      onPress={celebrate}
      accessibilityRole="header"
      accessibilityLabel={tagline ? `UR Shop, ${tagline}` : "UR Shop"}
      style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
    >
      <Animated.View style={[{ transformOrigin: "50% 90%" }, bagStyle]}>
        <BrandMark size={52} />
      </Animated.View>
      <View style={{ flexShrink: 1 }}>
        <BrandWordmark ref={wordmark} height={38} />
        {!!tagline && (
          <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>{tagline}</Text>
        )}
      </View>
    </Pressable>
  );
}
