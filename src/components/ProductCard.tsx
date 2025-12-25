import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@theme/color";

type Props = {
  title: string;
  price: number; // selling price (rupees)
  mrp: number; // mrp (rupees)
  image: string;
  variantCount?: number; // total number of variants (optional)
};

const asINR = (v: number) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function ProductCard({
  data,
  onAdd,
  onPress,
}: {
  data: Props;
  onAdd: () => void;
  onPress?: () => void;
}) {
  const hasDiscount = data.mrp > data.price && data.mrp > 0;
  const discountPct = hasDiscount
    ? Math.max(0, Math.round(((data.mrp - data.price) / data.mrp) * 100))
    : 0;

  const showVariantBadge = data.variantCount && data.variantCount > 1;

  const Card = (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 12,
        gap: 6,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
        height: 250,
        alignContent: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Variant Count Badge */}
      {showVariantBadge && (
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "rgba(131, 102, 204, 0.9)",
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
            zIndex: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            {data.variantCount} Variants
          </Text>
        </View>
      )}

      <Image
        source={data?.image}
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 12,
          backgroundColor: "#FAFAFA",
        }}
        contentFit="cover"
        transition={120}
      />

      <Text numberOfLines={2} style={{ fontSize: 13 }}>
        {data.title}
      </Text>

      {/* Price row like Flipkart: Selling • MRP (struck) • % off */}
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "900" }}>
          {asINR(data.price)}
        </Text>

        {hasDiscount && (
          <>
            <Text
              style={{ color: "#6B7280", textDecorationLine: "line-through" }}
            >
              {asINR(data.mrp)}
            </Text>
            <Text style={{ color: "#16a34a", fontWeight: "800" }}>
              {discountPct}% off
            </Text>
          </>
        )}
      </View>

      <View style={{ display: "flex", flexDirection: "row" }}>
        <Pressable
          onPress={onAdd}
          style={{
            width: "95%",
            height: 32,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#eee",

            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingHorizontal: 4,
            maxWidth: "95%",
          }}
        >
          <Text>Add To Cart</Text>

          <Ionicons name="cart-outline" size={18} color={colors.tint} />
        </Pressable>
      </View>
    </View>
  );

  return onPress ? (
    <Pressable onPress={onPress} android_ripple={{ color: "#E5E7EB" }}>
      {Card}
    </Pressable>
  ) : (
    Card
  );
}
