// OrderDetailScreen - Display detailed order information with cancel option
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useCancelOrder, useOrderDetail } from "@api/hooks/useOrders";

// Format price in INR
const formatPrice = (price: number | undefined) => {
  if (price === undefined || price === null) return "₹0";
  return `₹${price.toLocaleString("en-IN")}`;
};

// Format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "placed":
      return "#3B82F6";
    case "shipped":
      return "#F59E0B";
    case "delivered":
      return "#10B981";
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export default function OrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mutate: cancelOrder, isPending: isCanceling } = useCancelOrder();

  // Get order ID from route params
  console.log("[OrderDetailScreen] route.params:", route.params);
  console.log(
    "[OrderDetailScreen] Full order object:",
    JSON.stringify(route.params?.order, null, 2)
  );
  const orderId = route.params?.order?._id || route.params?.order?.orderId;
  console.log("[OrderDetailScreen] orderId:", orderId);

  // Fetch order details from API
  const { data: orderData, isLoading, error } = useOrderDetail(orderId);
  console.log("[OrderDetailScreen] Query state:", {
    isLoading,
    hasError: !!error,
    hasData: !!orderData,
  });

  // Use fetched order data
  const order = orderData?.order;

  // Loading state
  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeScreen>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <SafeScreen>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
          <Text style={styles.errorTitle}>
            {error ? "Failed to load order" : "Order not found"}
          </Text>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  const statusColor = getStatusColor(order.status);
  const canCancel = order.status.toLowerCase() === "placed";

  const handleCancelOrder = () => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: () => {
          cancelOrder(order._id, {
            onSuccess: () => {
              Alert.alert("Success", "Order cancelled successfully!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            },
            onError: (error: any) => {
              Alert.alert(
                "Cancel Failed",
                error?.response?.data?.message || "Failed to cancel order"
              );
            },
          });
        },
      },
    ]);
  };

  return (
    <SafeScreen edges={["bottom","top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Date and Status Row */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.dateLabel}>Order Date</Text>
              <Text style={styles.orderDate}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>

          {/* Order ID */}
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdLabel}>Order ID:</Text>
            <Text style={styles.orderIdValue}>#{orderId || "N/A"}</Text>
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceSummaryCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Amount</Text>
              <Text style={styles.priceValue}>
                {formatPrice(order.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.products?.map((product: any, index: number) => (
            <View key={index} style={styles.productCard}>
              <Image
                source={{ uri: product.productId?.thumbnail?.url }}
                style={styles.productImage}
                contentFit="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.productId?.name || "Product"}
                </Text>
                <Text style={styles.productBrand}>
                  {product.productId?.brand}
                </Text>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productQty}>Qty: {product.quantity}</Text>
                  <Text style={styles.productPrice}>
                    {formatPrice(product.price)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressLabelRow}>
              <Ionicons name="location" size={16} color="#8366CC" />
              <Text style={styles.addressLabel}>{order.address?.label}</Text>
            </View>
            <Text style={styles.addressName}>
              {order.address?.Receiver_Name}
            </Text>
            <Text style={styles.addressPhone}>
              {order.address?.Receiver_MobileNumber}
            </Text>
            <Text style={styles.addressText}>
              {order.address?.Address_Line1}
              {order.address?.Address_Line2 &&
                `, ${order.address.Address_Line2}`}
              {"\n"}
              {order.address?.City} - {order.address?.pincode}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Cancel Button - Fixed at bottom */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.cancelButton,
            (!canCancel || isCanceling) && styles.cancelButtonDisabled,
          ]}
          onPress={handleCancelOrder}
          disabled={!canCancel || isCanceling}
        >
          {isCanceling ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.cancelButtonText}>
                {canCancel ? "Cancel Order" : "Cannot Cancel"}
              </Text>
            </>
          )}
        </Pressable>
        {!canCancel && (
          <Text style={styles.cancelHint}>
            Orders can only be cancelled when status is "Placed"
          </Text>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#EF4444",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 8,
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#8366CC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  orderIdRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderIdLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  orderIdValue: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  productBrand: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  productPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  productQty: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1F2937",
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8366CC",
    textTransform: "uppercase",
  },
  addressName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  addressPhone: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  addressText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  priceSummaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#8366CC",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelButtonDisabled: {
    backgroundColor: "#D1D5DB",
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  cancelHint: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
  },
});
