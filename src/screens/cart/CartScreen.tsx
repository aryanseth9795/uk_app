// Cart Screen - Fully Functional with Variant Support and Address Selection
import React, { useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { removeFromCart, updateQty, clearCart } from "@store/slices/cartSlice";
import { useProductDetail } from "@api/hooks/useProducts";
import {
  getPriceForQuantity,
  formatINR,
  calculateItemTotal,
} from "@utils/pricing";

// Cart Item Component - Compact Version
const CartItem = ({
  id,
  variantId,
  qty,
  onTotalsCalculated,
}: {
  id: string;
  variantId: string;
  qty: number;
  onTotalsCalculated?: (mrpTotal: number, sellingTotal: number) => void;
}) => {
  const dispatch = useAppDispatch();
  const { data: productData, isLoading } = useProductDetail(id);

  const product = productData?.product;
  const variant = product?.variants?.find((v) => v._id === variantId);

  // Use ref to store callback to avoid infinite loop
  const callbackRef = useRef(onTotalsCalculated);
  // Update totals callback
  callbackRef.current = onTotalsCalculated;

  // Calculate and report totals when data changes
  useEffect(() => {
    if (variant && callbackRef.current) {
      const priceCalc = calculateItemTotal(
        variant.sellingPrices,
        qty,
        variant.mrp
      );
      // Only report selling total, no MRP
      callbackRef.current(priceCalc.total, priceCalc.total);
    }
  }, [variant, qty]); // Only depend on variant and qty, not the callback

  if (isLoading) {
    return (
      <View style={styles.itemContainer}>
        <ActivityIndicator size="small" color="#8366CC" />
      </View>
    );
  }

  if (!product || !variant) {
    return null;
  }

  // Use quantity-based pricing
  const priceCalc = calculateItemTotal(variant.sellingPrices, qty, variant.mrp);
  const pricePerUnit = priceCalc.pricePerUnit;
  const itemTotal = priceCalc.total;

  console.log(`[CartItem] Product: ${product.name}, Qty: ${qty}`);
  console.log(`[CartItem] SellingPrices:`, variant.sellingPrices);
  console.log(
    `[CartItem] Calculated - PricePerUnit: ${pricePerUnit}, ItemTotal: ${itemTotal}`
  );

  return (
    <View style={styles.itemContainer}>
      {/* Product Image - Smaller */}
      <Image
        source={{
          uri:
            product.thumbnail?.secure_url ||
            product.thumbnail?.url ||
            "https://via.placeholder.com/100",
        }}
        style={styles.itemImage}
      />

      {/* Product Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Variant Info - Compact */}
        {(variant.color || variant.size) && (
          <Text style={styles.itemVariant} numberOfLines={1}>
            {variant.color && `${variant.color}`}
            {variant.color && variant.size && " • "}
            {variant.size && `${variant.size}`}
          </Text>
        )}

        {/* Price - Only Selling Price */}
        <Text style={styles.itemPrice}>₹{pricePerUnit.toFixed(0)}</Text>

        {/* Quantity Controls - Compact */}
        <View style={styles.qtyControls}>
          <Pressable
            onPress={() => {
              if (qty > 1) {
                dispatch(updateQty({ id, variantId, qty: qty - 1 }));
              } else {
                dispatch(removeFromCart({ id, variantId }));
              }
            }}
            style={styles.qtyButton}
          >
            <Ionicons
              name={qty === 1 ? "trash-outline" : "remove"}
              size={14}
              color="#6B7280"
            />
          </Pressable>

          <Text style={styles.qtyText}>{qty}</Text>

          <Pressable
            onPress={() => dispatch(updateQty({ id, variantId, qty: qty + 1 }))}
            style={styles.qtyButton}
          >
            <Ionicons name="add" size={14} color="#6B7280" />
          </Pressable>

          <Text style={styles.itemSubtotal}>₹{itemTotal.toFixed(0)}</Text>
        </View>
      </View>

      {/* Remove Button */}
      <Pressable
        onPress={() => dispatch(removeFromCart({ id, variantId }))}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={20} color="#EF4444" />
      </Pressable>
    </View>
  );
};

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const user = useAppSelector((s) => s.auth.user); // Get user from auth state
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated); // Use isAuthenticated flag
  const primaryAddressId = useAppSelector((s) => s.address.primaryAddressId); // Get primary address ID

  // Store item totals in a ref to aggregate
  const itemTotalsRef = useRef<
    Record<string, { mrp: number; selling: number }>
  >({});

  // State for aggregated totals
  const [totals, setTotals] = React.useState({
    sellingTotal: 0,
    itemCount: 0,
  });

  // Get primary address or fallback to first address
  const displayAddress = React.useMemo(() => {
    if (!user?.addresses || user.addresses.length === 0) return null;

    // Find primary address by ID
    if (primaryAddressId) {
      const primary = user.addresses.find(
        (addr) => addr._id === primaryAddressId
      );
      if (primary) return primary;
    }

    // Fallback to first address
    return user.addresses[0];
  }, [user?.addresses, primaryAddressId]);

  // Recalculate totals whenever itemTotalsRef changes
  const recalculateTotals = () => {
    const sellingTotal = Object.values(itemTotalsRef.current).reduce(
      (sum, item) => sum + item.selling,
      0
    );

    const finalTotals = {
      sellingTotal,
      itemCount: cartItems.reduce((sum, item) => sum + item.qty, 0),
    };

    console.log("[Cart] Final Totals:", finalTotals);
    console.log("[Cart] Item Totals Breakdown:", itemTotalsRef.current);

    setTotals(finalTotals);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigation.navigate("Login");
      return;
    }

    // Check if user has any addresses
    if (!user?.addresses || user.addresses.length === 0) {
      Alert.alert(
        "No Delivery Address",
        "Please add a delivery address to proceed with checkout",
        [
          {
            text: "Add Address",
            onPress: () => navigation.navigate("Addresses"),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return;
    }

    navigation.navigate("Checkout");
  };

  const handleChangeAddress = () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to manage addresses");
      return;
    }
    navigation.navigate("Addresses");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  if (cartItems.length === 0) {
    return (
      <SafeScreen>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some products to get started!
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Tabs")}
            style={styles.shopButton}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Pressable
          onPress={() => dispatch(clearCart())}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Address Section - Only if authenticated */}
        {isAuthenticated ? (
          <View style={styles.addressContainer}>
            <View style={styles.addressHeader}>
              <Ionicons name="location" size={20} color="#8366CC" />
              <Text style={styles.addressTitle}>Delivery Address</Text>
            </View>

            <View style={styles.addressContent}>
              {displayAddress ? (
                <>
                  <View style={styles.addressLabelRow}>
                    <Ionicons name="home" size={14} color="#8366CC" />
                    <Text style={styles.addressLabelText}>
                      {displayAddress.label}
                    </Text>
                  </View>
                  <Text style={styles.addressName}>
                    {displayAddress.Receiver_Name}
                  </Text>
                  <Text style={styles.addressPhone}>
                    {displayAddress.Receiver_MobileNumber}
                  </Text>
                  <Text style={styles.addressText} numberOfLines={3}>
                    {displayAddress.Address_Line1}
                    {displayAddress.Address_Line2 &&
                      `, ${displayAddress.Address_Line2}`}
                    {"\n"}
                    {displayAddress.City} - {displayAddress.pincode}
                  </Text>
                </>
              ) : (
                <Text style={styles.addressText}>No address added yet</Text>
              )}
            </View>

            <Pressable
              onPress={handleChangeAddress}
              style={styles.changeAddressButton}
            >
              <Text style={styles.changeAddressText}>Change Address</Text>
              <Ionicons name="chevron-forward" size={16} color="#8366CC" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.addressContainer}>
            <View style={styles.addressHeader}>
              <Ionicons name="location-outline" size={20} color="#9CA3AF" />
              <Text style={styles.addressTitleInactive}>Delivery Address</Text>
            </View>

            <Text style={styles.loginPrompt}>
              Login to add delivery address
            </Text>

            <Pressable onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login / Sign Up</Text>
              <Ionicons name="log-in-outline" size={16} color="white" />
            </Pressable>
          </View>
        )}

        {/* Cart Items */}
        {cartItems.map((item) => {
          const key = `${item.id}-${item.variantId}`;
          return (
            <CartItem
              key={key}
              id={item.id}
              variantId={item.variantId}
              qty={item.qty}
              onTotalsCalculated={(mrp, selling) => {
                itemTotalsRef.current[key] = { mrp, selling };
                recalculateTotals();
              }}
            />
          );
        })}

        {/* Price Breakdown - Scrollable Section */}
        <View style={styles.priceBreakdownContainer}>
          <Text style={styles.priceBreakdownTitle}>Price Details</Text>

          {/* Item Count */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Items ({totals.itemCount}):</Text>
            <Text style={styles.totalValue}>
              ₹{totals.sellingTotal.toFixed(0)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer - Only Grand Total and Checkout */}
      <View style={styles.footer}>
        <View style={styles.divider} />

        {/* Grand Total - Fixed at bottom */}
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>Grand Total:</Text>
          <Text style={styles.grandTotalValue}>
            ₹{totals.sellingTotal.toFixed(0)}
          </Text>
        </View>

        <Pressable onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    gap: 8,
  },
  // Address Section Styles
  addressContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
  },
  addressContent: {
    gap: 4,
    marginBottom: 10,
  },
  addressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  addressLabelText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8366CC",
    textTransform: "uppercase",
  },
  addressName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  addressPhone: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  addressText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  changeAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8366CC",
    backgroundColor: "#F5F3FF",
  },
  changeAddressText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8366CC",
  },
  // Login prompt styles
  addressTitleInactive: {
    fontSize: 14,
    fontWeight: "800",
    color: "#9CA3AF",
  },
  loginPrompt: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#8366CC",
  },
  loginButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
  },
  // Price breakdown container
  priceBreakdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
    gap: 8,
  },
  priceBreakdownTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 6,
  },
  // Cart Item Styles - Compact
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  itemDetails: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  itemVariant: {
    fontSize: 11,
    color: "#6B7280",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
  },
  itemMrp: {
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "700",
  },
  pricingNote: {
    fontSize: 10,
    color: "#8366CC",
    fontWeight: "600",
    fontStyle: "italic",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  qtyButton: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 20,
    textAlign: "center",
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8366CC",
    marginLeft: "auto",
  },
  removeButton: {
    padding: 2,
  },
  footer: {
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1F2937",
  },
  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 8,
    marginVertical: 6,
  },
  savingsText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#16A34A",
    flex: 1,
  },
  savingsPercent: {
    fontSize: 13,
    fontWeight: "700",
    color: "#059669",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#8366CC",
  },
  checkoutButton: {
    backgroundColor: "#8366CC",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: "#8366CC",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
