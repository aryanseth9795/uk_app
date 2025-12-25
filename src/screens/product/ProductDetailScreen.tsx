// ProductDetailScreen - Complete Product Detail with Variants & Cart Actions
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import ProductCard from "@components/ProductCard";
import { useProductDetail, useSimilarProducts } from "@api/hooks/useProducts";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@store/slices/cartSlice";
import { calculateItemTotal, formatINR } from "@utils/pricing";
import type { ProductVariant } from "@api/types";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 32;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.85; // Reduced from 1.2

type RouteParams = {
  ProductDetail: {
    productId: string;
  };
};

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<RouteParams, "ProductDetail">>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { productId } = route.params;
  const { data, isLoading, isError, error } = useProductDetail(productId);
  const product = data?.product;

  // State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Cart state
  const cartItems = useAppSelector((s) => s.cart.items);

  // Check if selected variant is in cart
  const isInCart = useMemo(() => {
    if (!selectedVariant) return false;
    return cartItems.some(
      (item) => item.id === productId && item.variantId === selectedVariant._id
    );
  }, [cartItems, productId, selectedVariant]);

  // Similar products
  const {
    data: similarData,
    isLoading: similarLoading,
    isError: similarError,
  } = useSimilarProducts(product?.categoryId || "", productId, {
    enabled: !!product?.categoryId,
  });

  // Debug similar products
  React.useEffect(() => {
    console.log("[ProductDetail] Similar products:", {
      categoryId: product?.categoryId,
      productId,
      hasData: !!similarData,
      productsCount: similarData?.products?.length || 0,
      isLoading: similarLoading,
      isError: similarError,
      rawResponse: similarData, // Full API response
    });
  }, [
    similarData,
    product?.categoryId,
    productId,
    similarLoading,
    similarError,
  ]);

  // Auto-select first variant on load
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  // Get unique colors and sizes
  const colors = useMemo(() => {
    if (!product) return [];
    const uniqueColors = [
      ...new Set(product.variants.map((v) => v.color).filter(Boolean)),
    ];
    return uniqueColors;
  }, [product]);

  const sizes = useMemo(() => {
    if (!product) return [];
    const uniqueSizes = [
      ...new Set(product.variants.map((v) => v.size).filter(Boolean)),
    ];
    return uniqueSizes;
  }, [product]);

  // Get variants matching selected color
  const variantsMatchingColor = useMemo(() => {
    if (!product || !selectedVariant?.color) return product?.variants || [];
    return product.variants.filter((v) => v.color === selectedVariant.color);
  }, [product, selectedVariant]);

  // Handlers
  const handleColorSelect = (color: string) => {
    const variant = product?.variants.find((v) => v.color === color);
    if (variant) {
      setSelectedVariant(variant);
      setSelectedImageIndex(0);
    }
  };

  const handleSizeSelect = (size: string) => {
    const variant = variantsMatchingColor.find((v) => v.size === size);
    if (variant) {
      setSelectedVariant(variant);
      setSelectedImageIndex(0);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;

    dispatch(
      addToCart({
        id: productId,
        variantId: selectedVariant._id,
        qty: quantity,
      })
    );
  };

  const handleBuyNow = () => {
    if (!selectedVariant || !product) return;

    // Add to cart first
    dispatch(
      addToCart({
        id: productId,
        variantId: selectedVariant._id,
        qty: quantity,
      })
    );

    // Navigate to checkout
    navigation.navigate("Checkout");
  };

  // Calculate price
  const priceInfo = useMemo(() => {
    if (!selectedVariant) return null;
    return calculateItemTotal(
      selectedVariant.sellingPrices,
      quantity,
      selectedVariant.mrp
    );
  }, [selectedVariant, quantity]);

  // Variant images
  const variantImages = useMemo(() => {
    if (!selectedVariant?.images || selectedVariant.images.length === 0) {
      return [
        { url: "https://via.placeholder.com/400", publicId: "placeholder" },
      ];
    }
    return selectedVariant.images;
  }, [selectedVariant]);

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeScreen>
    );
  }

  if (isError || !product) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
          <Text style={styles.errorTitle}>Failed to load product</Text>
          <Text style={styles.errorMessage}>
            {error?.message || "Something went wrong"}
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={["top", "left", "right", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={variantImages}
              keyExtractor={(item, index) => `${item.publicId}-${index}`}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / IMAGE_WIDTH
                );
                setSelectedImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.url }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              )}
            />

            {/* Image Indicator Dots */}
            {variantImages.length > 1 && (
              <View style={styles.dotsContainer}>
                {variantImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === selectedImageIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Brand */}
          <Text style={styles.brand}>{product.brand}</Text>

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price */}
          {priceInfo && (
            <View style={styles.priceContainer}>
              <Text style={styles.sellingPrice}>
                ₹{priceInfo.pricePerUnit.toFixed(0)}
              </Text>
              {priceInfo.pricePerUnit < selectedVariant!.mrp && (
                <>
                  <Text style={styles.mrp}>
                    ₹{selectedVariant!.mrp.toFixed(0)}
                  </Text>
                  <Text style={styles.discount}>
                    {Math.round(
                      ((selectedVariant!.mrp - priceInfo.pricePerUnit) /
                        selectedVariant!.mrp) *
                        100
                    )}
                    % OFF
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Pricing Tiers Info - Below Price */}
          {selectedVariant && selectedVariant.sellingPrices.length > 1 && (
            <View style={styles.pricingTiersContainer}>
              <Text style={styles.pricingTiersTitle}>📊 Bulk Pricing</Text>
              {selectedVariant.sellingPrices.map((tier, index) => (
                <View key={index} style={styles.pricingTier}>
                  <Text style={styles.pricingTierText}>
                    Buy {tier.minQuantity}+ → ₹{tier.price.toFixed(0)}/piece
                  </Text>
                  {quantity >= tier.minQuantity && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#16A34A"
                    />
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <View style={styles.variantSection}>
              <Text style={styles.variantLabel}>Color</Text>
              <View style={styles.variantOptions}>
                {colors.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => handleColorSelect(color!)}
                    style={[
                      styles.variantPill,
                      selectedVariant?.color === color &&
                        styles.variantPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.variantPillText,
                        selectedVariant?.color === color &&
                          styles.variantPillTextSelected,
                      ]}
                    >
                      {color}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <View style={styles.variantSection}>
              <Text style={styles.variantLabel}>Size</Text>
              <View style={styles.variantOptions}>
                {sizes.map((size) => {
                  const isAvailable = variantsMatchingColor.some(
                    (v) => v.size === size
                  );
                  return (
                    <Pressable
                      key={size}
                      onPress={() => isAvailable && handleSizeSelect(size!)}
                      style={[
                        styles.variantPill,
                        selectedVariant?.size === size &&
                          styles.variantPillSelected,
                        !isAvailable && styles.variantPillDisabled,
                      ]}
                      disabled={!isAvailable}
                    >
                      <Text
                        style={[
                          styles.variantPillText,
                          selectedVariant?.size === size &&
                            styles.variantPillTextSelected,
                          !isAvailable && styles.variantPillTextDisabled,
                        ]}
                      >
                        {size}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Text style={styles.variantLabel}>Quantity</Text>
            <View style={styles.quantityControlsWrapper}>
              <Pressable
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={[
                  styles.quantityBtn,
                  quantity === 1 && styles.quantityBtnDisabled,
                ]}
                disabled={quantity === 1}
              >
                <Ionicons
                  name="remove"
                  size={22}
                  color={quantity === 1 ? "#D1D5DB" : "#6366F1"}
                />
              </Pressable>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Text style={styles.quantityLabel}>items</Text>
              </View>
              <Pressable
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityBtn}
              >
                <Ionicons name="add" size={22} color="#6366F1" />
              </Pressable>
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}
        </View>

        {/* Similar Products */}
        {similarData &&
          similarData.products &&
          similarData.products.length > 0 && (
            <View style={styles.similarSection}>
              <View style={styles.similarHeader}>
                <Text style={styles.sectionTitle}>You May Also Like</Text>
                <Text style={styles.similarCount}>
                  {similarData.products.length} items
                </Text>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={similarData.products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  const firstVariant = item.variants?.[0];
                  const price =
                    firstVariant?.sellingPrices?.[0]?.price ||
                    firstVariant?.mrp ||
                    0;
                  const mrp = firstVariant?.mrp || price;
                  const hasDiscount = mrp > price;

                  return (
                    <View style={styles.similarCard}>
                      <Pressable
                        onPress={() =>
                          navigation.push("ProductDetail", {
                            productId: item._id,
                          })
                        }
                        style={styles.similarImageWrapper}
                      >
                        <Image
                          source={{
                            uri:
                              item.thumbnail.secure_url || item.thumbnail.url,
                          }}
                          style={styles.similarImage}
                          resizeMode="cover"
                        />
                        {hasDiscount && (
                          <View style={styles.similarDiscountBadge}>
                            <Text style={styles.similarDiscountText}>
                              {Math.round(((mrp - price) / mrp) * 100)}% OFF
                            </Text>
                          </View>
                        )}
                      </Pressable>
                      <View style={styles.similarInfo}>
                        <Text style={styles.similarBrand} numberOfLines={1}>
                          {item.brand}
                        </Text>
                        <Text style={styles.similarName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <View style={styles.similarPriceRow}>
                          <Text style={styles.similarPrice}>
                            ₹{price.toFixed(0)}
                          </Text>
                          {hasDiscount && (
                            <Text style={styles.similarMrp}>
                              ₹{mrp.toFixed(0)}
                            </Text>
                          )}
                        </View>
                        <Pressable
                          onPress={() => {
                            dispatch(
                              addToCart({
                                id: item._id,
                                variantId: firstVariant?._id,
                                qty: 1,
                              })
                            );
                          }}
                          style={styles.similarAddBtn}
                        >
                          <Ionicons
                            name="cart-outline"
                            size={16}
                            color="#8366CC"
                          />
                          <Text style={styles.similarAddText}>Add</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                }}
                contentContainerStyle={styles.similarList}
              />
            </View>
          )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={handleAddToCart}
          disabled={!selectedVariant || isInCart}
          style={[
            styles.addToCartBtn,
            (!selectedVariant || isInCart) && styles.buttonDisabled,
          ]}
        >
          <Ionicons
            name={isInCart ? "checkmark-circle" : "cart-outline"}
            size={20}
            color={isInCart ? "#6B7280" : "#8366CC"}
          />
          <Text
            style={[
              styles.addToCartText,
              isInCart && styles.buttonTextDisabled,
            ]}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleBuyNow}
          disabled={!selectedVariant}
          style={[styles.buyNowBtn, !selectedVariant && styles.buttonDisabled]}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#8366CC",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  imageContainer: {
    width: width - 32,
    height: IMAGE_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  productImage: {
    width: width - 32,
    height: IMAGE_HEIGHT,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 20,
  },
  infoSection: {
    padding: 16,
    gap: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  productName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    lineHeight: 24,
  },
  pricingTiersContainer: {
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 8,
  },
  pricingTiersTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 4,
  },
  pricingTier: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  pricingTierText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sellingPrice: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
  },
  mrp: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16A34A",
  },
  variantSection: {
    gap: 10,
  },
  variantLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  variantOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  variantPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  variantPillSelected: {
    borderColor: "#8366CC",
    backgroundColor: "#F5F3FF",
  },
  variantPillDisabled: {
    opacity: 0.4,
  },
  variantPillText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4B5563",
  },
  variantPillTextSelected: {
    color: "#8366CC",
  },
  variantPillTextDisabled: {
    color: "#9CA3AF",
  },
  quantitySection: {
    gap: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
    textAlign: "center",
  },
  quantityControlsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quantityBtnDisabled: {
    opacity: 0.4,
  },
  quantityDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  quantityLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
  },
  descriptionSection: {
    gap: 8,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
  similarSection: {
    paddingVertical: 24,
    gap: 16,
    backgroundColor: "#F9FAFB",
    marginTop: 24,
  },
  similarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  similarCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  similarList: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  similarCard: {
    width: 150,
    marginRight: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  similarImageWrapper: {
    position: "relative",
  },
  similarImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#F9FAFB",
  },
  similarDiscountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#16A34A",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  similarDiscountText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
  },
  similarInfo: {
    padding: 12,
    gap: 6,
  },
  similarBrand: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  similarName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 16,
  },
  similarPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  similarPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
  },
  similarMrp: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  similarAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#8366CC",
    backgroundColor: "#F5F3FF",
  },
  similarAddText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8366CC",
  },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#8366CC",
    backgroundColor: "#fff",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#8366CC",
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#8366CC",
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: "#9CA3AF",
  },
});
