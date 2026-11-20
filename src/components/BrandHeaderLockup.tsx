// Home header brand lockup: bag logo, gold-foil "UR Shop" and the tagline.
// One motion moment when the screen opens (the foil shines); tapping replays
// it with a small hop of the bag and a light haptic tick.
//
// The lockup is drawn as one fixed piece, like a printed logo: the tagline is
// vector lettering in the wordmark's typeface (Baloo 2), so it looks the same
// on every phone whatever its system font or font size, and it is scaled to
// the wordmark's width so the two lines justify into a single block. The bag
// spans that block, standing a little proud of it top and bottom.
import React, { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
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
import { TAGLINE, WORDMARK } from "./brandWordmarkPath";

// ---- Geometry (dp) ---------------------------------------------------------
const BAG = 62;
const WORD_H = 31;
/** Wordmark baseline to tagline cap top; clears the descender of "p". */
const TAG_GAP = 7;
/** Visible space between the bag's gold edge and the stem of the "U". */
const BAG_TO_TEXT = 11;

// brand/wordmark.mjs sets both lines at 100 units/em on a baseline at y = 100,
// with a 2-unit margin around the letters. Baloo 2's cap height is ~61.5 units.
const BASELINE = 100;
const CAP_HEIGHT = 61.5;
const MARGIN = 2;
const wordScale = WORD_H / WORDMARK.viewBox.height;
const tagScale = (WORDMARK.viewBox.width * wordScale) / TAGLINE.viewBox.width;
const TAG_W = TAGLINE.viewBox.width * tagScale;
const TAG_H = TAGLINE.viewBox.height * tagScale;
const TAG_TOP =
  (BASELINE - WORDMARK.viewBox.y) * wordScale +
  TAG_GAP -
  (BASELINE - CAP_HEIGHT - TAGLINE.viewBox.y) * tagScale;
// BrandMark's viewBox leaves 7 of its 74 units clear on each side of the bag.
// Pull the box in so the gold edge, not the box, sits on the 16dp gutter.
const BAG_AIR = (7 / 74) * BAG;

type Props = { tagline?: string };

function BrandTagline() {
  const { x, y, width, height } = TAGLINE.viewBox;
  return (
    <Svg
      width={TAG_W}
      height={TAG_H}
      viewBox={`${x} ${y} ${width} ${height}`}
      // Line the "A" up with the "U" above it.
      style={{ marginTop: TAG_TOP - WORD_H, marginLeft: MARGIN * (wordScale - tagScale) }}
    >
      <Path d={TAGLINE.d} fill="#FFFFFF" fillOpacity={0.92} />
    </Svg>
  );
}

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
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Animated.View
        style={[
          {
            transformOrigin: "50% 90%",
            marginLeft: -BAG_AIR,
            marginRight: BAG_TO_TEXT - BAG_AIR - MARGIN * wordScale,
          },
          bagStyle,
        ]}
      >
        <BrandMark size={BAG} />
      </Animated.View>
      <View style={{ flexShrink: 1 }}>
        <BrandWordmark ref={wordmark} height={WORD_H} />
        {tagline === TAGLINE.text ? (
          <BrandTagline />
        ) : (
          !!tagline && (
            <Text
              maxFontSizeMultiplier={1.2}
              style={{ color: "rgba(255,255,255,0.9)", fontWeight: "600", marginTop: 2 }}
            >
              {tagline}
            </Text>
          )
        )}
      </View>
    </Pressable>
  );
}
