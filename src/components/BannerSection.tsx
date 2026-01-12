import React from "react";
import { View } from "react-native";
import PromoCarousel from "./PromoCarousel";
import type { Banner } from "@api/types";

type Props = {
  banners: Banner[];
  height?: number;
};

/**
 * BannerSection Component
 *
 * Displays banners stacked vertically. Each banner with its images
 * is rendered as a separate carousel.
 *
 * Banners with the same title but different child values will be
 * displayed one below the other (child 1 on top, child 2 below it, etc.)
 */
export default function BannerSection({ banners, height }: Props) {
  // Don't render if no banners
  if (banners.length === 0) return null;

  return (
    <View>
      {banners.map((banner) => {
        // Transform banner images into slides
        const slides = banner.images.map((img, idx) => ({
          id: `${banner._id}-${idx}`,
          imageUrl: img.secureUrl,
          onPress: undefined, // No action for now
        }));

        // Render each banner as its own carousel
        return (
          <View key={banner._id} style={{ marginBottom: 12 }}>
            <PromoCarousel slides={slides} height={height} />
          </View>
        );
      })}
    </View>
  );
}
