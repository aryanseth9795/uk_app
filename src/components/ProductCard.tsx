import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@theme/color";

type Props = {
  title: string;
  price: number;
  mrp: number;
  image: string;
  variantCount?: number;
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

  const CardContent = (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        <Image
          source={data?.image}
          style={styles.image}
          contentFit="cover"
          transition={100}
        />

        {/* Badges Row */}
        <View style={styles.badgeRow}>
          {showVariantBadge && (
            <View style={styles.variantBadge}>
              <Text style={styles.badgeText}>{data.variantCount} Options</Text>
            </View>
          )}
          {/* {hasDiscount && discountPct >= 5 && (
            <View style={styles.discountBadge}>
              <Text style={styles.badgeText}>{discountPct}% OFF</Text>
            </View>
          )} */}
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Brand/Title */}
        <Text numberOfLines={2} style={styles.title}>
          {data.title}
        </Text>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>{asINR(data.price)}</Text>
          {hasDiscount && (
            <>
              <Text style={styles.mrp}>{asINR(data.mrp)}</Text>
              <View style={styles.pctBadge}>
                <Text style={styles.pctText}>{discountPct}%</Text>
              </View>
            </>
          )}
        </View>

        {/* Add Button */}
        <Pressable
          onPress={onAdd}
          style={({ pressed }) => [
            styles.addBtn,
            pressed && styles.addBtnPressed,
          ]}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addBtnText}>ADD TO CART</Text>
        </Pressable>
      </View>
    </View>
  );

  return onPress ? (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {CardContent}
    </Pressable>
  ) : (
    CardContent
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    // height: 200,
  },
  card: {
    // height: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageWrapper: {
    width: "100%",
    height: 145,
    backgroundColor: "#F8F8F8",
    objectFit: "contain",
    padding: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeRow: {
    position: "absolute",
    top: 6,
    left: 6,
    right: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  variantBadge: {
    backgroundColor: "rgba(131, 102, 204, 0.9)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  content: {
    padding: 8,
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 20,
    height: 20,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1F2937",
  },
  mrp: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  pctBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  pctText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#fff",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    backgroundColor: "#8366CC",
    borderRadius: 6,
    paddingVertical: 6,
    marginTop: 2,
  },
  addBtnPressed: {
    backgroundColor: "#6B4FAD",
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
  },
});
