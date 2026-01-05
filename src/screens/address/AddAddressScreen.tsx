
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Switch,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import SafeScreen from "@components/SafeScreen";
import AppHeader from "@components/AppHeader";
import { colors } from "@theme/color";
import { useAddAddress } from "@api/hooks/useUser";

type InputRef =
  | React.RefObject<TextInput>
  | React.MutableRefObject<TextInput | null>
  | null;

export default function AddAddressScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { mutate: addAddress, isPending } = useAddAddress();

  // Prefilled dummy address for testing
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [label, setLabel] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Refs for "next" focus
  const phoneRef = useRef<TextInput>(null);
  const labelRef = useRef<TextInput>(null);
  const line1Ref = useRef<TextInput>(null);
  const line2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const pinRef = useRef<TextInput>(null);

  const onSave = () => {
    if (
      !receiverName ||
      !receiverPhone ||
      !label ||
      !line1 ||
      !city ||
      !pincode
    ) {
      Alert.alert("Add Address", "Please fill all required fields.");
      return;
    }
    if (receiverPhone.replace(/\D/g, "").length < 10) {
      Alert.alert("Add Address", "Please enter a valid phone number.");
      return;
    }

    addAddress(
      {
        Receiver_Name: receiverName,
        Receiver_MobileNumber: receiverPhone,
        Address_Line1: line1,
        Address_Line2: line2 || undefined,
        City: city,
        pincode: pincode,
        label: label,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Address added successfully!", [
            { text: "OK", onPress: () => nav.goBack() },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            "Add Address",
            error?.response?.data?.message || "Failed to add address."
          );
        },
      }
    );
  };

  return (
    <SafeScreen edges={["left", "right"]}>
      <AppHeader title="Add Address" showSearch={false} />

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
            {isPending ? "Saving..." : "Save Address"}
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
