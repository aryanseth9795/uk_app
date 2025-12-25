// src/screens/address/EditAddressScreen.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import SafeScreen from "@components/SafeScreen";
import AppHeader from "@components/AppHeader";
import { colors } from "@theme/color";
import { useEditAddress } from "@api/hooks/useUser";
import type { EditAddressRequest } from "@api/types";

type InputRef =
  | React.RefObject<TextInput>
  | React.MutableRefObject<TextInput | null>
  | null;

export default function EditAddressScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { mutate: editAddress, isPending } = useEditAddress();

  // Get address data and ID from route params
  const { address, addressId } = route.params || {};

  // State for form fields - prefilled with existing data
  const [receiverName, setReceiverName] = useState(
    address?.Receiver_Name || ""
  );
  const [receiverPhone, setReceiverPhone] = useState(
    address?.Receiver_MobileNumber || ""
  );
  const [label, setLabel] = useState(address?.label || "");
  const [line1, setLine1] = useState(address?.Address_Line1 || "");
  const [line2, setLine2] = useState(address?.Address_Line2 || "");
  const [city, setCity] = useState(address?.City || "");
  const [pincode, setPincode] = useState(address?.pincode || "");

  // Track initial values to detect changes
  const initialValues = useRef({
    Receiver_Name: address?.Receiver_Name || "",
    Receiver_MobileNumber: address?.Receiver_MobileNumber || "",
    label: address?.label || "",
    Address_Line1: address?.Address_Line1 || "",
    Address_Line2: address?.Address_Line2 || "",
    City: address?.City || "",
    pincode: address?.pincode || "",
  });

  // Refs for "next" focus
  const phoneRef = useRef<TextInput>(null);
  const labelRef = useRef<TextInput>(null);
  const line1Ref = useRef<TextInput>(null);
  const line2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const pinRef = useRef<TextInput>(null);

  // Check if address data exists
  useEffect(() => {
    if (!address || !addressId) {
      Alert.alert("Error", "Address data not found", [
        { text: "OK", onPress: () => nav.goBack() },
      ]);
    }
  }, [address, addressId, nav]);

  const onSave = () => {
    if (
      !receiverName ||
      !receiverPhone ||
      !label ||
      !line1 ||
      !city ||
      !pincode
    ) {
      Alert.alert("Edit Address", "Please fill all required fields.");
      return;
    }
    if (receiverPhone.replace(/\D/g, "").length < 10) {
      Alert.alert("Edit Address", "Please enter a valid phone number.");
      return;
    }

    // Build payload with only changed fields
    const payload: EditAddressRequest = {};

    if (receiverName !== initialValues.current.Receiver_Name) {
      payload.Receiver_Name = receiverName;
    }
    if (receiverPhone !== initialValues.current.Receiver_MobileNumber) {
      payload.Receiver_MobileNumber = receiverPhone;
    }
    if (label !== initialValues.current.label) {
      payload.label = label;
    }
    if (line1 !== initialValues.current.Address_Line1) {
      payload.Address_Line1 = line1;
    }
    if (line2 !== initialValues.current.Address_Line2) {
      payload.Address_Line2 = line2 || undefined;
    }
    if (city !== initialValues.current.City) {
      payload.City = city;
    }
    if (pincode !== initialValues.current.pincode) {
      payload.pincode = pincode;
    }

    // Check if there are any changes
    if (Object.keys(payload).length === 0) {
      Alert.alert("Edit Address", "No changes detected.");
      return;
    }

    editAddress(
      { addressId, addressData: payload },
      {
        onSuccess: () => {
          Alert.alert("Success", "Address updated successfully!", [
            { text: "OK", onPress: () => nav.goBack() },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            "Edit Address",
            error?.response?.data?.message || "Failed to update address."
          );
        },
      }
    );
  };

  return (
    <SafeScreen edges={["left", "right"]}>
      <AppHeader title="Edit Address" showSearch={false} />

      {/* Avoid keyboard overlap on both platforms */}
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={24}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 56,
        }}
      >
        <Field
          label="Receiver Name *"
          value={receiverName}
          onChangeText={setReceiverName}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => phoneRef.current?.focus()}
        />

        <Field
          label="Receiver Phone Number *"
          value={receiverPhone}
          onChangeText={setReceiverPhone}
          keyboardType="phone-pad"
          returnKeyType="next"
          inputRef={phoneRef}
          blurOnSubmit={false}
          onSubmitEditing={() => labelRef.current?.focus()}
        />

        <Field
          label="Address Label * (Home/Work)"
          value={label}
          onChangeText={setLabel}
          returnKeyType="next"
          inputRef={labelRef}
          blurOnSubmit={false}
          onSubmitEditing={() => line1Ref.current?.focus()}
        />

        <Field
          label="Address Line *"
          value={line1}
          onChangeText={setLine1}
          returnKeyType="next"
          inputRef={line1Ref}
          blurOnSubmit={false}
          onSubmitEditing={() => line2Ref.current?.focus()}
        />

        <Field
          label="Address Line 2 (optional)"
          value={line2}
          onChangeText={setLine2}
          returnKeyType="next"
          inputRef={line2Ref}
          blurOnSubmit={false}
          onSubmitEditing={() => cityRef.current?.focus()}
        />

        <Field
          label="City *"
          value={city}
          onChangeText={setCity}
          returnKeyType="next"
          inputRef={cityRef}
          blurOnSubmit={false}
          onSubmitEditing={() => pinRef.current?.focus()}
        />

        <Field
          label="Pincode *"
          value={pincode}
          onChangeText={setPincode}
          keyboardType={Platform.select({
            ios: "number-pad",
            android: "numeric",
          })}
          returnKeyType="done"
          inputRef={pinRef}
        />

        <Pressable
          onPress={onSave}
          disabled={isPending}
          style={{
            marginTop: 18,
            backgroundColor: colors.tint,
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: "center",
            opacity: isPending ? 0.7 : 1,
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            {isPending ? "Updating..." : "Update Address"}
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  returnKeyType,
  inputRef,
  blurOnSubmit,
  onSubmitEditing,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?:
    | "default"
    | "number-pad"
    | "email-address"
    | "numeric"
    | "phone-pad";
  returnKeyType?: "done" | "next" | "go" | "send" | "search";
  inputRef?: InputRef;
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, color: "#6B7280", fontWeight: "700" }}>
        {label}
      </Text>
      <TextInput
        ref={inputRef as any}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        blurOnSubmit={blurOnSubmit}
        onSubmitEditing={onSubmitEditing}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      />
    </View>
  );
}
