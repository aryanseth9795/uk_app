// Search Results Screen - Vertical Product Grid
import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

// Components
import SafeScreen from "@components/SafeScreen";
import ProductCard from "@components/ProductCard";

// Hooks
import { useAppDispatch } from "@store/hooks";
import { addToCart } from "@store/slices/cartSlice";
import { useSearchProducts } from "@api/hooks";
import { getPriceForQuantity } from "@utils/pricing";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

type RouteParams = {
  SearchResults: {
    query: string;
  };
};

export default function SearchResultsScreen() {
  const route = useRoute<RouteProp<RouteParams, "SearchResults">>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { query } = route.params;

  // Search products
  const { data, isLoading, error } = useSearchProducts({ q: query });

  // Debug logging
  React.useEffect(() => {
    console.log("[SearchResults] Query:", query);
    console.log("[SearchResults] Data exists:", !!data);
    console.log("[SearchResults] Data.products exists:", !!data?.products);
    console.log(
      "[SearchResults] Data.products length:",
      data?.products?.length
    );
    console.log("[SearchResults] Loading:", isLoading);
    console.log("[SearchResults] Error:", error);
  }, [query, data, isLoading, error]);

  const { mainProducts, suggestionProducts } = useMemo(() => {
    console.log("[SearchResults] useMemo - data:", data);
    console.log("[SearchResults] useMemo - data?.products:", data?.products);

    if (!data?.products) {
      console.log("[SearchResults] No products - returning empty arrays");
      return { mainProducts: [], suggestionProducts: [] };
    }

    console.log("[SearchResults] Processing", data.products.length, "products");

    const main: any[] = [];
    const suggestions: any[] = [];

    data.products.forEach((p) => {
      const firstVariant = p.variants?.[0];
      const price = getPriceForQuantity(firstVariant?.sellingPrices || [], 1);
      const mrp = firstVariant?.mrp || price;

      const product = {
        id: String(p._id),
        variantId: String(firstVariant?._id || ""),
        title: String(p.name || ""),
        price: price,
        mrp: mrp,
        image: String(p.thumbnail?.secure_url || p.thumbnail?.url || ""),
        searchScore: p.searchScore || 0,
      };

      // Separate by search score
      if ((p.searchScore ?? 0) > 9) {
        main.push(product);
      } else {
        suggestions.push(product);
      }
    });

    console.log("[SearchResults] Main results:", main.length);
    console.log("[SearchResults] Suggestions:", suggestions.length);

    return { mainProducts: main, suggestionProducts: suggestions };
  }, [data]);

  // Header
  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <View style={styles.titleContainer}>
        <Text style={styles.headerSubtitle}>Search Results</Text>
        <Text style={styles.headerTitle} numberOfLines={1}>
          "{query}"
        </Text>
      </View>
    </View>
  );

  // Loading State
  if (isLoading) {
    return (
      <SafeScreen edges={["top", "left", "right", "bottom"]}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      </SafeScreen>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeScreen edges={["top", "left", "right", "bottom"]}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Search Failed</Text>
          <Text style={styles.errorText}>
            Unable to search products. Please try again.
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  // Results
  const totalResults = mainProducts.length + suggestionProducts.length;

  return (
    <SafeScreen edges={["top", "left", "right", "bottom"]}>
      {renderHeader()}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCount}>
          {totalResults} {totalResults === 1 ? "product" : "products"} found
        </Text>
      </View>
      {totalResults === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>
            Try searching with different keywords
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {/* Main Results (score > 9) */}
          {mainProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Results</Text>
              <View style={styles.gridContainer}>
                {mainProducts.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
                    <ProductCard
                      data={item}
                      onPress={() =>
                        navigation.navigate("ProductDetail", {
                          productId: item.id,
                        })
                      }
                      onAdd={() =>
                        dispatch(
                          addToCart({
                            id: item.id,
                            variantId: item.variantId,
                            qty: 1,
                          })
                        )
                      }
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Suggestions (score ≤ 9) */}
          {suggestionProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                You would like this product also
              </Text>
              <View style={styles.gridContainer}>
                {suggestionProducts.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
                    <ProductCard
                      data={item}
                      onPress={() =>
                        navigation.navigate("ProductDetail", {
                          productId: item.id,
                        })
                      }
                      onAdd={() =>
                        dispatch(
                          addToCart({
                            id: item.id,
                            variantId: item.variantId,
                            qty: 1,
                          })
                        )
                      }
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
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
  titleContainer: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8366CC",
  },
  resultsInfo: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
  },
  gridContent: {
    padding: 16,
  },
  gridItem: {
    width: CARD_WIDTH,
    padding: 8,
  },
});
