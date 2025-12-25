// Home Screen - Redesigned with Quick Access Cards and Category Sections
import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Pressable,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Components
import SafeScreen from "@components/SafeScreen";
import AppHeader from "@components/AppHeader";
import QuickAccessCard from "@components/QuickAccessCard";
import CategorySection from "@components/CategorySection";
import PromoCarousel from "@components/PromoCarousel";

// Hooks
import { useAppDispatch } from "@store/hooks";
import { addToCart } from "@store/slices/cartSlice";
import {
  useLandingProducts,
  useSearchProducts,
  useSearchSuggestions,
} from "@api/hooks";
import type { SearchFilters } from "@api/types";
import { getPriceForQuantity } from "@utils/pricing";

// ===================================
// HOME SCREEN COMPONENT
// ===================================

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  // UI State
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  // ===================================
  // DATA FETCHING
  // ===================================

  // Landing page products (10 from each category)
  const {
    data: landingData,
    isLoading: landingLoading,
    error: landingError,
    refetch: refetchLanding,
  } = useLandingProducts();

  // Search results
  const searchFilters: SearchFilters = useMemo(
    () => ({
      q: activeQuery || undefined,
    }),
    [activeQuery]
  );

  const { data: searchData, isLoading: searchLoading } = useSearchProducts(
    searchFilters,
    {
      enabled: !!activeQuery,
    }
  );

  // Search suggestions
  const { data: suggestionsData, isLoading: suggestionsLoading } =
    useSearchSuggestions(query, {
      enabled: query.length >= 2 && !activeQuery,
    });

  const suggestions = useMemo(() => {
    if (!suggestionsData) return [];
    const { products = [], brands = [] } = suggestionsData.suggestions || {};
    return [...products.map((p) => p.name), ...brands.map((b) => b.name)].slice(
      0,
      5
    );
  }, [suggestionsData]);

  // ===================================
  // SEARCH DATA
  // ===================================

  const searchProducts = useMemo(() => {
    if (!searchData?.products) return [];
    return searchData.products.map((p: any) => {
      const firstVariant = p.variants?.[0];
      const price = firstVariant?.sellingPrices?.[0]?.price || 0;
      const mrp = firstVariant?.mrp || price;

      return {
        id: String(p._id),
        title: String(p.name || ""),
        price: price / 100,
        mrp: mrp / 100,
        image: String(p.thumbnail?.url || ""),
      };
    });
  }, [searchData]);

  // ===================================
  // EVENT HANDLERS
  // ===================================

  const doSearch = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    Keyboard.dismiss();
    navigation.navigate("SearchResults", { query: q });
    setQuery("");
  }, [query, navigation]);

  const onPickSuggestion = useCallback(
    (label: string) => {
      Keyboard.dismiss();
      navigation.navigate("SearchResults", { query: label });
      setQuery("");
    },
    [navigation]
  );

  const clearSearch = useCallback(() => {
    setActiveQuery(null);
    setQuery("");
  }, []);

  const onRefresh = useCallback(async () => {
    await refetchLanding();
  }, [refetchLanding]);

  const handleQuickAccess = useCallback(
    (type: string) => {
      // Map quick access type to filter type
      const filterMap: Record<string, string> = {
        discounts: "isTopDiscount",
        latest: "isLatestProduct",
        cheapest: "isCheap",
        top: "topSeller",
      };

      const filterType = filterMap[type];
      if (filterType) {
        navigation.navigate("QuickAccess", { filterType });
      }
    },
    [navigation]
  );

  const handleMorePress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate("CategoryProducts", { categoryId, categoryName });
    },
    [navigation]
  );

  // ===================================
  // PROMO SLIDES
  // ===================================

  const SLIDES = useMemo(
    () => [
      {
        id: "s1",
        title: "Winter Glow Sale",
        subtitle: "Up to 40% off on skincare & perfumes",
        ctaText: "Shop now",
        imageUrl:
          "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000",
        onPress: () => console.log("Go to Winter Glow"),
      },
      {
        id: "s2",
        title: "New: Luxe Fragrances",
        subtitle: "Handpicked for festive gifting",
        ctaText: "Explore",
        imageUrl:
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000",
        onPress: () => console.log("Go to Fragrances"),
      },
      {
        id: "s3",
        title: "Skincare Starter Kits",
        subtitle: "Derm-approved routines for beginners",
        ctaText: "Build your kit",
        imageUrl:
          "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1000",
        onPress: () => console.log("Go to Kits"),
      },
    ],
    []
  );

  // ===================================
  // ERROR HANDLING
  // ===================================

  if (landingError && !landingData) {
    return (
      <SafeScreen edges={["left", "right"]}>
        <AppHeader
          searchValue={query}
          onSearchChange={setQuery}
          onSearchSubmit={doSearch}
          activeLabel={activeQuery}
          onClearActive={clearSearch}
          suggestions={[]}
          suggestionsLoading={false}
          onSelectSuggestion={onPickSuggestion}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load products</Text>
          <Pressable onPress={refetchLanding} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  // ===================================
  // RENDER SEARCH RESULTS
  // ===================================

  if (activeQuery) {
    return (
      <SafeScreen edges={["left", "right"]}>
        <AppHeader
          searchValue={query}
          onSearchChange={setQuery}
          onSearchSubmit={doSearch}
          activeLabel={activeQuery}
          onClearActive={clearSearch}
          suggestions={suggestions}
          suggestionsLoading={suggestionsLoading}
          onSelectSuggestion={onPickSuggestion}
        />

        <ScrollView contentContainerStyle={styles.searchResults}>
          <View style={styles.searchHeader}>
            <Text style={styles.searchTitle}>Results for "{activeQuery}"</Text>
            <Pressable onPress={clearSearch}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>

          {searchLoading ? (
            <ActivityIndicator
              size="large"
              color="#8366CC"
              style={{ marginTop: 40 }}
            />
          ) : searchProducts.length > 0 ? (
            <View style={styles.searchGrid}>
              {searchProducts.map((product) => (
                <View key={product.id} style={styles.searchProduct}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("ProductDetail", {
                        productId: product.id,
                      })
                    }
                  >
                    <Text>{product.title}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No products found</Text>
          )}
        </ScrollView>
      </SafeScreen>
    );
  }

  // ===================================
  // RENDER NORMAL HOME SCREEN
  // ===================================

  return (
    <SafeScreen edges={["left", "right"]}>
      {/* Header */}
      <AppHeader
        searchValue={query}
        onSearchChange={setQuery}
        onSearchSubmit={doSearch}
        activeLabel={activeQuery}
        onClearActive={clearSearch}
        suggestions={suggestions}
        suggestionsLoading={suggestionsLoading}
        onSelectSuggestion={onPickSuggestion}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={landingLoading} onRefresh={onRefresh} />
        }
      >
        {/* Heading */}
        {/* <Text style={styles.heading}>Discover Amazing Deals</Text> */}

        {/* Promo Banner */}
        <View style={styles.bannerContainer}>
          <PromoCarousel slides={SLIDES} />
        </View>

        {/* Quick Access Cards */}
        <View style={styles.cardsContainer}>
          <QuickAccessCard
            title="Top Discounts"
            icon="pricetag"
            gradient={["#EC4899", "#8B5CF6"]}
            imageUrl="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&q=80"
            onPress={() => handleQuickAccess("discounts")}
          />
          <QuickAccessCard
            title="Latest Products"
            icon="sparkles"
            gradient={["#F59E0B", "#EF4444"]}
            imageUrl="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80"
            onPress={() => handleQuickAccess("latest")}
          />
          <QuickAccessCard
            title="Cheapest Store"
            icon="trending-down"
            gradient={["#10B981", "#059669"]}
            imageUrl="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"
            onPress={() => handleQuickAccess("cheapest")}
          />
          <QuickAccessCard
            title="Top Products"
            icon="trophy"
            gradient={["#F97316", "#DC2626"]}
            imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
            onPress={() => handleQuickAccess("top")}
          />
        </View>

        {/* Loading State */}
        {landingLoading && !landingData && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8366CC" />
          </View>
        )}

        {/* Category Sections */}
        {landingData?.data?.map((category) => (
          // {console.log("category", category)  }er
          <CategorySection
            key={category.categoryId}
            categoryId={category.categoryId}
            categoryName={category.categoryName}
            products={category.products.map((p: any) => {
              const firstVariant = p.variants?.[0];
              // Use quantity 1 for display pricing - prices are in rupees
              const price = getPriceForQuantity(
                firstVariant?.sellingPrices || [],
                1
              );
              const mrp = firstVariant?.mrp || price;

              return {
                id: String(p._id),
                variantId: String(firstVariant?._id || ""), // Include variant ID
                title: String(p.name || ""),
                price: price,
                mrp: mrp,
                image: String(p.thumbnail?.url || ""),
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
        {!landingLoading && !landingData?.data?.length && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products available</Text>
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

// ===================================
// STYLES
// ===================================

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bannerContainer: {
    marginTop: 10,
    marginBottom: 24,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
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
  retryButton: {
    backgroundColor: "#8366CC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
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
  searchResults: {
    padding: 16,
  },
  searchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  clearText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8366CC",
  },
  searchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  searchProduct: {
    width: "48%",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
});
