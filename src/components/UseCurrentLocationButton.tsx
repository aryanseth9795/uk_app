// "Use current location" for the address forms. Optional and free: the phone
// supplies the position, Android's geocoder supplies the area and pincode.
// The server decides whether the address is inside the delivery area.
import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@theme/color";
import { getCurrentAddress } from "@utils/currentLocation";
import type { GeocodeFields } from "@utils/geocodeFields";
import type { GeoPoint } from "@api/types";

type Props = {
  location: GeoPoint | null;
  onLocated: (location: GeoPoint, fields: GeocodeFields) => void;
  onClear: () => void;
};

export default function UseCurrentLocationButton({
  location,
  onLocated,
  onClear,
}: Props) {
  const [busy, setBusy] = useState(false);

  const locate = async () => {
    setBusy(true);
    const result = await getCurrentAddress();
    setBusy(false);
    if (!result.ok) {
      Alert.alert("Current location", result.message);
      return;
    }
    onLocated(result.location, result.fields);
  };

  if (location) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: "#F3EEFF",
          borderRadius: 12,
          padding: 12,
          marginBottom: 14,
        }}
      >
        <Ionicons name="location" size={18} color={colors.tint} />
        <Text style={{ flex: 1, color: "#1F2937", fontWeight: "600" }}>
          Location added. Check the fields below and add your house or flat
          number.
        </Text>
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Remove shared location"
          hitSlop={8}
        >
          <Text style={{ color: colors.tint, fontWeight: "700" }}>Remove</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={locate}
      disabled={busy}
      accessibilityRole="button"
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: colors.tint,
        borderRadius: 12,
        paddingVertical: 12,
        marginBottom: 14,
        opacity: busy ? 0.7 : 1,
      }}
    >
      {busy ? (
        <ActivityIndicator color={colors.tint} />
      ) : (
        <Ionicons name="locate" size={18} color={colors.tint} />
      )}
      <Text style={{ color: colors.tint, fontWeight: "800" }}>
        {busy ? "Finding your location..." : "Use current location"}
      </Text>
    </Pressable>
  );
}
