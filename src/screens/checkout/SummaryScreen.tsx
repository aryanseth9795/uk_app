// SummaryScreen - Temporary Placeholder
// TODO: Refactor with TanStack Query hooks (useCreateOrder)
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";

export default function SummaryScreen() {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <Ionicons name="receipt-outline" size={80} color="#8366CC" />
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Text style={styles.message}>
          This screen will be refactored with TanStack Query
        </Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8366CC",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
