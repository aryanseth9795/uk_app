// Checkout/Summary Screen - Complete Order Review and Placement
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { clearCart } from "@store/slices/cartSlice";
import { useProductDetail } from "@api/hooks/useProducts";
import { useCreateOrder } from "@api/hooks/useOrders";
import { calculateItemTotal } from "@utils/pricing";

// Order Item Component
const OrderItem = ({
  id,
  variantId,
  qty,
  onItemCalculated,
}: {
  id: string;
  variantId: string;
  qty: number;
  onItemCalculated?: (data: any) => void;
}) => {
  const { data: productData, isLoading } = useProductDetail(id);

  const product = productData?.product;
  const variant = product?.variants?.find((v) => v._id === variantId);

  useEffect(() => {
    if (variant && product && onItemCalculated) {
      const priceCalc = calculateItemTotal(
        variant.sellingPrices,
        qty,
        variant.mrp
      );
      onItemCalculated({
        productId: id,
        variantId,
        quantity: qty,
        price: priceCalc.pricePerUnit,
        productName: product.name,
        variantInfo: variant,
      });
    }
  }, [variant, product, qty, id, variantId, onItemCalculated]);

  if (isLoading) {
    return (
      <View style={styles.orderItem}>
        <ActivityIndicator size="small" color="#8366CC" />
      </View>
    );
  }

  if (!product || !variant) return null;

  const priceCalc = calculateItemTotal(variant.sellingPrices, qty, variant.mrp);
  const itemTotal = priceCalc.total;

  return (
    <View style={styles.orderItem}>
      <Image
        source={{
          uri:
            product.thumbnail?.secureUrl ||
            product.thumbnail?.url ||
            "https://via.placeholder.com/60",
        }}
        style={styles.orderItemImage}
      />
      <View style={styles.orderItemDetails}>
        <Text style={styles.orderItemName} numberOfLines={1}>
          {product.name}
        </Text>
        {(variant.color || variant.size) && (
          <Text style={styles.orderItemVariant}>
            {variant.color && `${variant.color}`}
            {variant.color && variant.size && " • "}
            {variant.size && `${variant.size}`}
          </Text>
        )}
        <Text style={styles.orderItemQty}>Qty: {qty}</Text>
      </View>
      <Text style={styles.orderItemTotal}>₹{itemTotal.toFixed(0)}</Text>
    </View>
  );
};

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = !!user;

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const itemsProcessed = useRef(0);

  const { mutate: createOrder, isPending: isPlacingOrder } = useCreateOrder();

  // Calculate totals from order items
  const totals = React.useMemo(() => {
    const mrpTotal = orderItems.reduce((sum, item) => {
      return sum + (item.variantInfo?.mrp || 0) * item.quantity;
    }, 0);

    const sellingTotal = orderItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return {
      mrpTotal,
      sellingTotal,
      totalSavings: mrpTotal - sellingTotal,
      itemCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [orderItems]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to place an order", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Tabs"),
        },
      ]);
    }
  }, [isAuthenticated, navigation]);

  // Handle item calculation callback
  const handleItemCalculated = (itemData: any) => {
    setOrderItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === itemData.productId &&
          i.variantId === itemData.variantId
      );
      if (existing) {
        return prev;
      }
      return [...prev, itemData];
    });
    itemsProcessed.current += 1;
  };

  const handlePlaceOrder = () => {
    if (!user?.addresses || user.addresses.length === 0) {
      Alert.alert("No Address", "Please add a delivery address first");
      return;
    }

    if (orderItems.length === 0) {
      Alert.alert("Error", "No items in order");
      return;
    }

    // Prepare order data matching API structure
    const orderData = {
      products: orderItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      address: {
        Receiver_Name: user.addresses[0].Receiver_Name,
        Receiver_MobileNumber: user.addresses[0].Receiver_MobileNumber,
        Address_Line1: user.addresses[0].Address_Line1,
        Address_Line2: user.addresses[0].Address_Line2 || "",
        City: user.addresses[0].City,
        pincode: user.addresses[0].pincode,
        label: user.addresses[0].label,
      },
    };

    createOrder(orderData, {
      onSuccess: (response) => {
        dispatch(clearCart());
        Alert.alert(
          "Order Placed Successfully!",
          `Order ID: ${response.order._id}`,
          [
            {
              text: "View Orders",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Tabs" }],
                });
                navigation.navigate("AllOrders");
              },
            },
            {
              text: "Continue Shopping",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Tabs" }],
                });
              },
            },
          ]
        );
      },
      onError: (error: any) => {
        Alert.alert(
          "Order Failed",
          error?.response?.data?.message ||
            "Failed to place order. Please try again."
        );
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <SafeScreen>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#8366CC" />
        </View>
      </SafeScreen>
    );
  }

  const primaryAddress = user?.addresses?.[0];

  return (
    <SafeScreen edges={["bottom", "left", "right", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#8366CC" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>

          {primaryAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressName}>
                {primaryAddress.Receiver_Name}
              </Text>
              <Text style={styles.addressPhone}>
                {primaryAddress.Receiver_MobileNumber}
              </Text>
              <Text style={styles.addressText}>
                {primaryAddress.Address_Line1}
                {primaryAddress.Address_Line2 &&
                  `, ${primaryAddress.Address_Line2}`}
              </Text>
              <Text style={styles.addressText}>
                {primaryAddress.City} - {primaryAddress.pincode}
              </Text>
              <View style={styles.addressLabel}>
                <Text style={styles.addressLabelText}>
                  {primaryAddress.label}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noAddress}>No address available</Text>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube-outline" size={20} color="#8366CC" />
            <Text style={styles.sectionTitle}>
              Order Items ({cartItems.length})
            </Text>
          </View>

          {cartItems.map((item) => (
            <OrderItem
              key={`${item.id}-${item.variantId}`}
              id={item.id}
              variantId={item.variantId}
              qty={item.qty}
              onItemCalculated={handleItemCalculated}
            />
          ))}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calculator-outline" size={20} color="#8366CC" />
            <Text style={styles.sectionTitle}>Price Details</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>MRP Total</Text>
            <Text style={styles.priceValue}>₹{totals.mrpTotal.toFixed(0)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Selling Price</Text>
            <Text style={styles.priceValue}>
              ₹{totals.sellingTotal.toFixed(0)}
            </Text>
          </View>

          {totals.totalSavings > 0 && (
            <View style={styles.savingsRow}>
              <Text style={styles.savingsLabel}>Total Savings</Text>
              <Text style={styles.savingsValue}>
                -₹{totals.totalSavings.toFixed(0)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ₹{totals.sellingTotal.toFixed(0)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer with Place Order Button */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>Total Amount</Text>
            <Text style={styles.footerTotal}>
              ₹{totals.sellingTotal.toFixed(0)}
            </Text>
          </View>
          <Pressable
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder || orderItems.length === 0}
            style={[
              styles.placeOrderButton,
              (isPlacingOrder || orderItems.length === 0) &&
                styles.placeOrderButtonDisabled,
            ]}
          >
            {isPlacingOrder ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.placeOrderText}>Place Order</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  // Address styles
  addressCard: {
    gap: 6,
  },
  addressName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  addressPhone: {
    fontSize: 14,
    color: "#6B7280",
  },
  addressText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  addressLabel: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  addressLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  noAddress: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  // Order item styles
  orderItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  orderItemDetails: {
    flex: 1,
    gap: 3,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  orderItemVariant: {
    fontSize: 12,
    color: "#6B7280",
  },
  orderItemQty: {
    fontSize: 12,
    color: "#6B7280",
  },
  orderItemTotal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#8366CC",
  },
  // Price styles
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  savingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  savingsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
  },
  savingsValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#16A34A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#8366CC",
  },
  // Footer styles
  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  footerLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  placeOrderButton: {
    backgroundColor: "#8366CC",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  placeOrderButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
