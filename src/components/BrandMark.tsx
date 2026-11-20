// The UR Shop mark (gold shopping bag, plum "UR", white handle) drawn as
// vectors, so it stays sharp at any size and adds no image file to the app.
// Same shapes as D:\Desktop\UR Shop\brand\mark.mjs — change both together.
import React from "react";
import Svg, { Path } from "react-native-svg";

const HANDLE = "M40 44v-6a14 14 0 0 1 28 0v6";
const BAG = "M24 44h60l-4.5 38a5 5 0 0 1-5 4.5h-41a5 5 0 0 1-5-4.5z";
const U = "M35 53v11a8 8 0 0 0 16 0V53";
const R = "M60 76V53h6a7 7 0 0 1 0 14h-6m6 0l8 9";

const GOLD = "#FBBF24";
const PLUM = "#2E1065";
const WHITE = "#FFFFFF";

type Props = { size?: number };

export default function BrandMark({ size = 48 }: Props) {
  return (
    // Cropped to the bag (with its handle) so it fills the given size.
    <Svg
      width={size}
      height={size}
      viewBox="17 17 74 74"
      accessible
      accessibilityLabel="UR Shop logo"
    >
      <Path d={HANDLE} fill="none" stroke={WHITE} strokeWidth={5} strokeLinecap="round" />
      <Path d={BAG} fill={GOLD} />
      <Path d={U} fill="none" stroke={PLUM} strokeWidth={7} strokeLinecap="round" />
      <Path
        d={R}
        fill="none"
        stroke={PLUM}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
