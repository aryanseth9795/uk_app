import React from "react";
import PromoCarousel from "./PromoCarousel";
import type { Banner } from "@api/types";

type Props = {
  banners: Banner[];
  height?: number;
};

/**
 * BannerSection Component
 *
 * Transforms banner data from API into carousel slides format
 * and renders them using PromoCarousel component.
 *
 * Supports both single and multiple banners:
 * - Single banner with single image: Static display
 * - Single banner with multiple images: Carousel of those images
 * - Multiple banners: Each banner's images in carousel
 */
export default function BannerSection({ banners, height }: Props) {
  // Transform banners into slides format expected by PromoCarousel
  const slides = banners.flatMap((banner) =>
    banner.images.map((img, idx) => ({
      id: `${banner._id}-${idx}`,
      imageUrl: img.secureUrl,
      onPress: undefined, // No action for now
    }))
  );

  // Don't render if no slides
  if (slides.length === 0) return null;

  return <PromoCarousel slides={slides} height={height} />;
}
