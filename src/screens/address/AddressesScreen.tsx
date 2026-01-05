// AddressesScreen - Address Management with List, Add, Edit, Delete, Primary Selection
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { useUserProfile, useDeleteAddress } from "@api/hooks/useUser";
import { setPrimaryAddressId } from "@store/slices/addressSlice";

// Address Card Component
const AddressCard = ({
  address,
  onEdit,
  onDelete,
  isPrimary,
  onTogglePrimary,
}: {
  address: any;
  onEdit: () => void;
  onDelete: () => void;
  isPrimary: boolean;
  onTogglePrimary: (isPrimary: boolean) => void;
}) => {
  return (
    <Pressable
      onPress={() => onTogglePrimary(!isPrimary)}
      style={[styles.addressCard, isPrimary && styles.addressCardSelected]}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleRow}>
          <Pressable onPress={() => onTogglePrimary(!isPrimary)}>
            <Ionicons
              name={isPrimary ? "radio-button-on" : "radio-button-off"}
              size={22}
              color={isPrimary ? "#8366CC" : "#9CA3AF"}
            />
          </Pressable>
          <Ionicons name="location" size={18} color="#8366CC" />
          <Text style={styles.addressLabel}>{address.label}</Text>
          {isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryText}>Primary</Text>
            </View>
          )}
        </View>
        <View style={styles.actionButtons}>
          <Pressable onPress={onEdit} style={styles.editButton}>
            <Ionicons name="pencil" size={16} color="#8366CC" />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      <View style={styles.addressContent}>
        <Text style={styles.addressName}>{address.Receiver_Name}</Text>
        <Text style={styles.addressPhone}>{address.Receiver_MobileNumber}</Text>
        <Text style={styles.addressText}>
          {address.Address_Line1}
          {address.Address_Line2 && `, ${address.Address_Line2}`}
        </Text>
        <Text style={styles.addressText}>
          {address.City} - {address.pincode}
        </Text>
      </View>
    </Pressable>
  );
};

export default function AddressesScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const primaryAddressId = useAppSelector((s) => s.address.primaryAddressId);

  const { data: profileData, isLoading } = useUserProfile();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const addresses = profileData?.user?.addresses || user?.addresses || [];

  const handleAddNew = () => {
    navigation.navigate("AddAddress");
  };

  const handleEdit = (address: any) => {
    navigation.navigate("EditAddress", {
      address,
      addressId: address._id,
    });
  };

  const handleDelete = (addressId: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteAddress(addressId, {
              onSuccess: () => {
                Alert.alert("Success", "Address deleted successfully!");
                // Clear primary if we deleted the primary address
                if (primaryAddressId === addressId) {
                  dispatch(setPrimaryAddressId(null));
                }
              },
              onError: (error: any) => {
                Alert.alert(
                  "Delete Failed",
                  error?.response?.data?.message || "Failed to delete address"
                );
              },
            });
          },
        },
      ]
    );
  };

  const handleTogglePrimary = (addressId: string, newValue: boolean) => {
    if (newValue) {
      // User wants to set this as primary
      dispatch(setPrimaryAddressId(addressId));
    } else {
      // User wants to unset as primary (optional: allow or disallow)
      // For now, don't allow unsetting - keep at least one primary
      // Uncomment below to allow clearing primary:
      // dispatch(setPrimaryAddressId(null));
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeScreen>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptySubtitle}>
            Please login to manage your addresses
          </Text>
        </View>
      </SafeScreen>
    );
  }

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </Pressable>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <Pressable onPress={handleAddNew} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#8366CC" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Addresses Added</Text>
            <Text style={styles.emptySubtitle}>
              Add a delivery address to continue shopping
            </Text>
            <Pressable onPress={handleAddNew} style={styles.addNewButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addNewButtonText}>Add New Address</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {addresses.map((address: any, index: number) => (
              <AddressCard
                key={address._id || index}
                address={address}
                onEdit={() => handleEdit(address)}
                onDelete={() => handleDelete(address._id)}
                isPrimary={primaryAddressId === address._id}
                onTogglePrimary={(value) =>
                  handleTogglePrimary(address._id, value)
                }
              />
            ))}

            {/* Add New Address Button at Bottom */}
            <Pressable
              onPress={handleAddNew}
              style={styles.addNewButtonOutline}
            >
              <Ionicons name="add-circle-outline" size={24} color="#8366CC" />
              <Text style={styles.addNewButtonOutlineText}>
                Add New Address
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Loading Overlay */}
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8366CC" />
        </View>
      )}
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  addButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  // Address Card Styles
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  addressCardSelected: {
    borderColor: "#8366CC",
    borderWidth: 2,
    backgroundColor: "#F5F3FF",
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  addressTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8366CC",
    textTransform: "uppercase",
  },
  primaryBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  primaryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  addressContent: {
    gap: 4,
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
  primarySwitchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  primarySwitchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
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
  addNewButton: {
    backgroundColor: "#8366CC",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  addNewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  addNewButtonOutline: {
    borderWidth: 2,
    borderColor: "#8366CC",
    borderRadius: 12,
    borderStyle: "dashed",
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  addNewButtonOutlineText: {
    color: "#8366CC",
    fontSize: 15,
    fontWeight: "700",
  },
});
