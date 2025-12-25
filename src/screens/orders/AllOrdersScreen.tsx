// AllOrdersScreen - Display all user orders
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useOrders } from "@api/hooks/useOrders";

const { width } = Dimensions.get("window");

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
    month: "short",
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

// Order Card Component
const OrderCard = ({ order, onPress }: any) => {
  const statusColor = getStatusColor(order.status);

  return (
    <Pressable style={styles.orderCard} onPress={onPress}>
      <View style={styles.cardContent}>
        {/* Left: Thumbnail */}
        <Image
          source={{ uri: order.thumbnail }}
          style={styles.orderImage}
          contentFit="cover"
        />

        {/* Center: Items and Date */}
        <View style={styles.centerInfo}>
          {/* Items Count */}
          <View style={styles.itemsRow}>
            <Ionicons name="cube" size={16} color="#8366CC" />
            <Text style={styles.orderProducts}>
              {order.numberOfProducts}{" "}
              {order.numberOfProducts === 1 ? "Item" : "Items"}
            </Text>
          </View>

          {/* Order Date */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar" size={14} color="#9CA3AF" />
            <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
          </View>

          {/* View Details Link */}
          <View style={styles.viewDetailsRow}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="arrow-forward" size={14} color="#8366CC" />
          </View>
        </View>

        {/* Right: Status (Top) and Price (Bottom) */}
        <View style={styles.rightInfo}>
          {/* Status Badge - Top */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Total Price - Bottom */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.orderPrice}>
              {formatPrice(order.totalPrice)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function AllOrdersScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading, error } = useOrders();

  // Loading state
  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeScreen>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
          <Text style={styles.errorTitle}>Failed to load orders</Text>
          <Text style={styles.errorText}>Please try again later</Text>
        </View>
      </SafeScreen>
    );
  }

  const orders = data?.orders || [];

  // Empty state
  if (orders.length === 0) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <Ionicons name="bag-handle-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Your order history will appear here
          </Text>
          <Pressable
            style={styles.shopButton}
            onPress={() => navigation.navigate("Tabs")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  // Orders list
  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item, index) => `order-${index}`}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => {
             
              navigation.navigate("OrderDetail", { order: item });
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </Text>
        }
      />
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
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#EF4444",
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  shopButton: {
    marginTop: 16,
    backgroundColor: "#8366CC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  listHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardContent: {
    flexDirection: "row",
    padding: 14,
    gap: 14,
  },
  orderImage: {
    width: 95,
    height: 95,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  centerInfo: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
  },
  rightInfo: {
    width: 90,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderProducts: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "700",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderDate: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceContainer: {
    alignItems: "flex-end",
    gap: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  viewDetailsText: {
    fontSize: 13,
    color: "#8366CC",
    fontWeight: "700",
  },
});
