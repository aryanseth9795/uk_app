// AccountScreen - User Profile and Quick Actions
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { logout } from "@store/slices/authSlice";
import { clearPrimaryAddressId } from "@store/slices/addressSlice";
import { useUserProfile } from "@api/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Format joined date
const formatJoinedDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `Joined ${date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  })}`;
};

// Menu Item Component
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  iconColor = "#8366CC",
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  iconColor?: string;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.menuItem}>
      <View
        style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}
      >
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
};

export default function AccountScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);

  // Only fetch profile if authenticated
  const { data: profileData, isLoading } = useUserProfile({
    enabled: isAuthenticated,
  });

  const userData = profileData?.user || user;

  // Debug logging
  console.log("[AccountScreen] isAuthenticated:", isAuthenticated);
  console.log("[AccountScreen] isLoading:", isLoading);
  console.log("[AccountScreen] user:", !!user);
  console.log("[AccountScreen] userData:", !!userData);

  // Unauthenticated state (check this FIRST for instant response)
  if (!isAuthenticated) {
    return (
      <SafeScreen>
        <View style={styles.unauthContainer}>
          <Ionicons name="person-circle-outline" size={120} color="#D1D5DB" />
          <Text style={styles.unauthTitle}>Login/Signup to access this</Text>
          <Text style={styles.unauthSubtitle}>
            Sign in to view your profile, orders, and manage your account
          </Text>
          <Pressable
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  // Loading state (only when authenticated and fetching profile)
  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8366CC" />
        </View>
      </SafeScreen>
    );
  }

  // Authenticated state
  const initials = getInitials(userData?.name || "");
  const joinedDate = formatJoinedDate(userData?.createdAt || "");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearPrimaryAddressId()); // Clear primary address on logout
    navigation.navigate("Tabs");
  };

  return (
    <SafeScreen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{userData?.name || "User"}</Text>
          <Text style={styles.userPhone}>
            {userData?.mobilenumber || "N/A"}
          </Text>
          {joinedDate && <Text style={styles.joinedDate}>{joinedDate}</Text>}
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="receipt"
            title="Orders"
            subtitle="View order history"
            onPress={() => navigation.navigate("AllOrders")}
          />

          <MenuItem
            icon="location"
            title="My Address"
            subtitle={`${userData?.addresses?.length || 0} saved addresses`}
            onPress={() => navigation.navigate("Addresses")}
          />
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <View style={styles.aboutHeader}>
            <Ionicons name="sparkles" size={20} color="#8366CC" />
            <Text style={styles.aboutTitle}>About UR Shop</Text>
          </View>

          <Text style={styles.aboutText}>
            We're a modern neighborhood store in Jaunpur offering cosmetics,
            skincare, fragrances, stationery and gift items. Our focus is a
            delightful selection, fair pricing, and fast service.
          </Text>

          <View style={styles.aboutDetails}>
            <View style={styles.aboutRow}>
              <Ionicons name="person-circle" size={16} color="#6B7280" />
              <Text style={styles.aboutLabel}>Owner:</Text>
              <Text style={styles.aboutValue}>Ujjwal Seth</Text>
            </View>

            <View style={styles.aboutRow}>
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text style={styles.aboutLabel}>Location:</Text>
              <Text style={styles.aboutValue}>Jaunpur, UP</Text>
            </View>

            <View style={styles.aboutRow}>
              <Ionicons name="call" size={16} color="#6B7280" />
              <Text style={styles.aboutLabel}>Phone:</Text>
              <Text style={styles.aboutValue}>+91 9696174586</Text>
            </View>

            <View style={styles.aboutRow}>
              <Ionicons name="code-slash" size={16} color="#6B7280" />
              <Text style={styles.aboutLabel}>Developer:</Text>
              <Text style={styles.aboutValue}>Aryan Seth</Text>
            </View>
          </View>

          <View style={styles.valuesContainer}>
            <Text style={styles.valuesTitle}>What we value</Text>
            <View style={styles.valuesPills}>
              {[
                "Genuine Products",
                "Fair Prices",
                "Local Service",
                "Fast Ordering",
              ].map((value) => (
                <View key={value} style={styles.valuePill}>
                  <Text style={styles.valuePillText}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Unauthenticated State
  unauthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  unauthTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F2937",
    textAlign: "center",
  },
  unauthSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: "#8366CC",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  // Profile Header
  profileHeader: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8366CC",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 4,
  },
  userPhone: {
    fontSize: 15,
    color: "#6B7280",
  },
  joinedDate: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  // Menu Section
  menuSection: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  // About Section
  aboutSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 14,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  aboutDetails: {
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aboutLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  aboutValue: {
    fontSize: 13,
    color: "#1F2937",
    flex: 1,
  },
  valuesContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 8,
  },
  valuesTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
  },
  valuesPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  valuePill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(131,102,204,0.10)",
    borderWidth: 1,
    borderColor: "#8366CC",
  },
  valuePillText: {
    color: "#8366CC",
    fontWeight: "800",
    fontSize: 12,
  },
  // Logout Button
  logoutButton: {
    marginTop: 12,
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
