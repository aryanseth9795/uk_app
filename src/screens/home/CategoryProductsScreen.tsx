// Category Products Screen - Level-Aware Rendering
import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

// Components
import SafeScreen from "@components/SafeScreen";
import ProductCard from "@components/ProductCard";
import CategorySection from "@components/CategorySection";

// Hooks
import { useAppDispatch } from "@store/hooks";
import { addToCart } from "@store/slices/cartSlice";
import { useCategoryProducts } from "@api/hooks";
import { getPriceForQuantity } from "@utils/pricing";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

type RouteParams = {
  CategoryProducts: {
    categoryId: string;
    categoryName: string;
  };
};

export default function CategoryProductsScreen() {
  const route = useRoute<RouteProp<RouteParams, "CategoryProducts">>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { categoryId, categoryName } = route.params;

  // Fetch category products
  const { data, isLoading, error, refetch, isRefetching } =
    useCategoryProducts(categoryId);

  // Handlers
  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleMorePress = useCallback(
    (subCategoryId: string, subCategoryName: string) => {
      navigation.push("CategoryProducts", {
        categoryId: subCategoryId,
        categoryName: subCategoryName,
      });
    },
    [navigation]
  );

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate("ProductDetail", { productId });
    },
    [navigation]
  );

  const handleAddToCart = useCallback(
    (productId: string, variantId: string) => {
      dispatch(addToCart({ id: productId, variantId, qty: 1 }));
    },
    [dispatch]
  );

  // Header component
  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {categoryName}
      </Text>
    </View>
  );

  // Loading State
  if (isLoading) {
    return (
      <SafeScreen edges={["top", "left", "right"]}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeScreen>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <SafeScreen edges={["top", "left", "right"]}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {error ? "Failed to load products" : "No data available"}
          </Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  // LEVEL 2: Render Products in Vertical Grid
  if (data.level === 2) {
    const products = data.products.map((p) => {
      const firstVariant = p.variants?.[0];
      const price = getPriceForQuantity(firstVariant?.sellingPrices || [], 1);
      const mrp = firstVariant?.mrp || price;

      return {
        id: String(p._id),
        variantId: String(firstVariant?._id || ""),
        title: String(p.name || ""),
        price: price,
        mrp: mrp,
        image: String(p.thumbnail?.secureUrl || p.thumbnail?.url || ""),
      };
    });

    return (
      <SafeScreen edges={["top", "left", "right"]}>
        {renderHeader()}
        {products.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              No products found in this category
            </Text>
          </View>
        ) : (
          <FlashList
            data={products}
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <ProductCard
                  data={item}
                  onPress={() => handleProductPress(item.id)}
                  onAdd={() => handleAddToCart(item.id, item.variantId)}
                />
              </View>
            )}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.gridContent}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeScreen>
    );
  }

  // LEVEL 0/1: Render Horizontal Carousels
  const subcategories = data.data;

  return (
    <SafeScreen edges={["top", "left", "right"]}>
      {renderHeader()}
      {subcategories.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No subcategories found</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        >
          {subcategories.map((subcategory) => {
            const products = subcategory.products.map((p) => {
              const firstVariant = p.variants?.[0];
              const price = getPriceForQuantity(
                firstVariant?.sellingPrices || [],
                1
              );
              const mrp = firstVariant?.mrp || price;

              return {
                id: String(p._id),
                variantId: String(firstVariant?._id || ""),
                title: String(p.name || ""),
                price: price,
                mrp: mrp,
                image: String(
                  p.thumbnail?.secureUrl || p.thumbnail?.url || ""
                ),
              };
            });

            return (
              <CategorySection
                key={subcategory.subCategoryId}
                categoryId={subcategory.subCategoryId}
                categoryName={subcategory.subCategoryName}
                products={products}
                onPressMore={handleMorePress}
                onPressProduct={handleProductPress}
                onAddToCart={handleAddToCart}
              />
            );
          })}
        </ScrollView>
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8366CC",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#8366CC",
    textAlign: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#EF4444",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#8366CC",
    borderRadius: 8,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  gridContent: {
    padding: 16,
  },
  gridItem: {
    width: CARD_WIDTH,
    padding: 8,
  },
});
