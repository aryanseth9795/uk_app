// "UR Shop" in gold foil: Baloo 2 ExtraBold lettering (pre-converted to a
// vector path by brand/wordmark.mjs) with a gold gradient, and a light streak
// that sweeps across once, like foil packaging catching the light.
import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { WORDMARK } from "./brandWordmarkPath";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export type BrandWordmarkHandle = { shine: () => void };

type Props = {
  /** Rendered height in dp; width follows the lettering's proportions. */
  height?: number;
  /** Play the shine once when the wordmark first appears. */
  shineOnMount?: boolean;
};

const { x, y, width, height: vbHeight } = WORDMARK.viewBox;
// The streak is skewed, which shifts it sideways by up to ~0.4 x its height,
// so it starts and ends well outside the letters.
const SHEEN_START = x - 140;
const SHEEN_END = x + width + 90;

const BrandWordmark = forwardRef<BrandWordmarkHandle, Props>(function BrandWordmark(
  { height = 38, shineOnMount = true },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const sheenX = useSharedValue(SHEEN_START);

  const shine = useCallback(
    (delay = 0) => {
      if (reduceMotion) return; // respect "Remove animations"
      sheenX.value = SHEEN_START;
      sheenX.value = withDelay(
        delay,
        withTiming(SHEEN_END, { duration: 1100, easing: Easing.out(Easing.cubic) }),
      );
    },
    [reduceMotion, sheenX],
  );

  useImperativeHandle(ref, () => ({ shine: () => shine(0) }), [shine]);

  useEffect(() => {
    if (shineOnMount) shine(400);
  }, [shineOnMount, shine]);

  const sheenProps = useAnimatedProps(() => ({ x: sheenX.value }));

  return (
    <Svg
      width={(height * width) / vbHeight}
      height={height}
      viewBox={`${x} ${y} ${width} ${vbHeight}`}
      accessible
      accessibilityLabel="UR Shop"
    >
      <Defs>
        <LinearGradient id="urShopFoil" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FDE68A" />
          <Stop offset="0.55" stopColor="#FBBF24" />
          <Stop offset="1" stopColor="#F59E0B" />
        </LinearGradient>
        <ClipPath id="urShopLetters">
          <Path d={WORDMARK.d} />
        </ClipPath>
      </Defs>
      <Path d={WORDMARK.d} fill="url(#urShopFoil)" />
      <G clipPath="url(#urShopLetters)">
        <G transform="skewX(-22)">
          <AnimatedRect
            animatedProps={sheenProps}
            y={y - 20}
            width={38}
            height={vbHeight + 40}
            fill="#FFFFFF"
            opacity={0.7}
          />
        </G>
      </G>
    </Svg>
  );
});

export default BrandWordmark;
