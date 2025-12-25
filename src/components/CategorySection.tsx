// Category Section with Horizontal Carousel
import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "./ProductCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.4; // Smaller to show more of next card
const CARD_SPACING = 16;

type Product = {
  id: string;
  variantId: string;
  title: string;
  price: number;
  mrp: number;
  image: string;
};

type CategorySectionProps = {
  categoryName: string;
  categoryId: string;
  products: Product[];
  onPressMore: (categoryId: string, categoryName: string) => void;
  onPressProduct: (id: string) => void;
  onAddToCart: (id: string, variantId: string) => void;
};

function CategorySection({
  categoryName,
  categoryId,
  products,
  onPressMore,
  onPressProduct,
  onAddToCart,
}: CategorySectionProps) {
  if (!products || products.length === 0) return null;
  // console.log(categoryName, categoryId, products);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{categoryName}</Text>
        <Pressable
          onPress={() => onPressMore(categoryId, categoryName)}
          style={styles.moreButton}
        >
          <Text style={styles.moreText}>More</Text>
          <Ionicons name="chevron-forward" size={16} color="#8366CC" />
        </Pressable>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
      >
        {products.map((product, index) => (
          <View
            key={product.id}
            style={{
              width: CARD_WIDTH,
              marginRight: index === products.length - 1 ? 16 : CARD_SPACING,
              height: 260,
              padding: 3,
            }}
          >
            <ProductCard
              data={product}
              onPress={() => onPressProduct(product.id)}
              onAdd={() => onAddToCart(product.id, product.variantId)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8366CC",
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 80, // Extra padding to show partial cards on right
    marginTop: 4,
  },
});

export default React.memo(CategorySection);
