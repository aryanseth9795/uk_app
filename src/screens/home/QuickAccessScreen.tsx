// Quick Access Screen - Display filtered products by category
import React, { useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

// Components
import SafeScreen from "@components/SafeScreen";
import CategorySection from "@components/CategorySection";

// Hooks
import { useAppDispatch } from "@store/hooks";
import { addToCart } from "@store/slices/cartSlice";
import { useFilteredLandingProducts, FilterType } from "@api/hooks/useProducts";
import { getPriceForQuantity } from "@utils/pricing";

// Filter type mapping
const FILTER_TITLES: Record<FilterType, string> = {
  isTopDiscount: "Top Discounts",
  isLatestProduct: "Latest Products",
  isCheap: "Cheapest Products",
  topSeller: "Top Products",
};

export default function QuickAccessScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Get filter type from route params
  const filterType: FilterType = route.params?.filterType || "isTopDiscount";
  const title = FILTER_TITLES[filterType] || "Filtered Products";

  // Fetch filtered products
  const {
    data: filteredData,
    isLoading,
    error,
    refetch,
  } = useFilteredLandingProducts(filterType);

  // Event handlers
  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleMorePress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate("CategoryProducts", { categoryId, categoryName });
    },
    [navigation]
  );

  // Error handling
  if (error && !filteredData) {
    return (
      <SafeScreen>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load products</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Loading State */}
        {isLoading && !filteredData && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8366CC" />
            <Text style={styles.loadingText}>
              Loading {title.toLowerCase()}...
            </Text>
          </View>
        )}

        {/* Category Sections */}
        {filteredData?.data?.map((category) => (
          <CategorySection
            key={category.categoryId}
            categoryId={category.categoryId}
            categoryName={category.categoryName}
            products={category.products.map((p: any) => {
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
                  p.thumbnail?.secure_url || p.thumbnail?.url || ""
                ),
              };
            })}
            onPressMore={handleMorePress}
            onPressProduct={(id) =>
              navigation.navigate("ProductDetail", { productId: id })
            }
            onAddToCart={(id, variantId) =>
              dispatch(addToCart({ id, variantId }))
            }
          />
        ))}

        {/* Empty State */}
        {!isLoading && !filteredData?.data?.length && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products available</Text>
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
  },
  content: {
    paddingBottom: 24,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    fontSize: 14,
  },
});
