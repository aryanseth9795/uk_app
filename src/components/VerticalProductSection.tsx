// VerticalProductSection - Vertical product grid with infinite scroll
import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import ProductCard from "./ProductCard";
import type { Product } from "@api/types";
import { getPriceForQuantity } from "@utils/pricing";

type ProductItem = {
  id: string;
  variantId: string;
  title: string;
  price: number;
  mrp: number;
  image: string;
  variantCount: number;
};

type Props = {
  title: string;
  products: Product[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onProductPress: (productId: string) => void;
  onAddToCart: (
    productId: string,
    variantId: string,
    productName?: string,
  ) => void;
};

// Transform API product to card format
const transformProduct = (product: Product): ProductItem => {
  const firstVariant = product.variants?.[0];
  const price = getPriceForQuantity(firstVariant?.sellingPrices || [], 1);
  const mrp = firstVariant?.mrp || price;

  return {
    id: String(product._id),
    variantId: String(firstVariant?._id || ""),
    title: String(product.name || ""),
    price: price,
    mrp: mrp,
    image: String(product.thumbnail?.secureUrl || product.thumbnail?.url || ""),
    variantCount: product.variants?.length || 0,
  };
};

export default function VerticalProductSection({
  title,
  products,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onProductPress,
  onAddToCart,
}: Props) {
  const transformedProducts = products.map(transformProduct);

  const renderItem = useCallback(
    ({ item, index }: { item: ProductItem; index: number }) => {
      const isLeftColumn = index % 2 === 0;
      return (
        <View
          style={[
            styles.gridItem,
            isLeftColumn ? styles.leftColumn : styles.rightColumn,
          ]}
        >
          <ProductCard
            data={item}
            onPress={() => onProductPress(item.id)}
            onAdd={() => onAddToCart(item.id, item.variantId, item.title)}
          />
        </View>
      );
    },
    [onProductPress, onAddToCart],
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#8366CC" />
          <Text style={styles.loadingText}>Loading more...</Text>
        </View>
      );
    }

    if (hasNextPage && onLoadMore) {
      return (
        <Pressable onPress={onLoadMore} style={styles.loadMoreBtn}>
          <Text style={styles.loadMoreText}>Load More Products</Text>
        </Pressable>
      );
    }

    return null;
  }, [isFetchingNextPage, hasNextPage, onLoadMore]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
        </View>
      </View>
    );
  }

  if (transformedProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.listContainer}>
        <FlashList
          data={transformedProducts}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderFooter}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listContainer: {
    minHeight: 300,
  },
  listContent: {
    paddingHorizontal: 0,
  },
  gridItem: {
    flex: 1,
    paddingVertical: 6,
  },
  leftColumn: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  rightColumn: {
    paddingLeft: 6,
    paddingRight: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  footerLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  loadMoreBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    margin: 16,
    backgroundColor: "#F3F0FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8366CC",
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8366CC",
  },
});
