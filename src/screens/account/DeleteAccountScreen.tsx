// DeleteAccountScreen - permanent account deletion.
// Google Play requires an in-app way to delete an account and its data:
// https://support.google.com/googleplay/android-developer/answer/13327111
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useAppDispatch } from "@store/hooks";
import { clearPrimaryAddressId } from "@store/slices/addressSlice";
import { useDeleteAccount } from "@api/hooks/useUser";
import { getErrorMessage } from "@api/client";
import { performLogout } from "@utils/auth";
import { LEGAL_LINKS, openLegalLink } from "@utils/legalLinks";

const Bullet = ({ children }: { children: string }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletDot}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

export default function DeleteAccountScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const deleteAccount = useDeleteAccount();

  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canSubmit = password.length > 0 && confirmed && !deleteAccount.isPending;

  const onDelete = () => {
    if (!canSubmit) return;
    deleteAccount.mutate(password, {
      onSuccess: async () => {
        // The server already removed this device's push token with the account.
        await performLogout();
        dispatch(clearPrimaryAddressId());
        Alert.alert(
          "Account deleted",
          "Your account and saved addresses have been deleted."
        );
        navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
      },
    });
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
          </View>

          <View style={styles.titleContainer}>
            <Ionicons name="trash-outline" size={56} color="#EF4444" />
            <Text style={styles.title}>Delete account</Text>
            <Text style={styles.subtitle}>
              This permanently deletes your UR Shop account. It cannot be
              undone.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What is deleted</Text>
            <Bullet>Your name, mobile number, email and password</Bullet>
            <Bullet>All saved delivery addresses</Bullet>
            <Bullet>Notification tokens for your devices</Bullet>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What we keep</Text>
            <Text style={styles.cardText}>
              Records of past orders and invoices, because tax and accounting
              laws require sales records.
            </Text>
            <Pressable onPress={() => openLegalLink(LEGAL_LINKS.privacy)}>
              <Text style={styles.link}>Read the Privacy Policy</Text>
            </Pressable>
          </View>

          <Text style={styles.note}>
            If an order is on its way, wait until it is delivered or cancel it
            first.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                editable={!deleteAccount.isPending}
              />
            </View>
          </View>

          <Pressable
            style={styles.checkRow}
            onPress={() => setConfirmed((c) => !c)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: confirmed }}
          >
            <Ionicons
              name={confirmed ? "checkbox" : "square-outline"}
              size={22}
              color={confirmed ? "#EF4444" : "#6B7280"}
            />
            <Text style={styles.checkText}>
              I understand my account and saved addresses will be deleted
              permanently.
            </Text>
          </Pressable>

          {deleteAccount.isError && (
            <Text style={styles.errorText} accessibilityRole="alert">
              {getErrorMessage(deleteAccount.error)}
            </Text>
          )}

          <Pressable
            style={[styles.deleteButton, !canSubmit && styles.buttonDisabled]}
            onPress={onDelete}
            disabled={!canSubmit}
            accessibilityRole="button"
          >
            {deleteAccount.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete my account</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20, gap: 16 },
  header: { marginBottom: 4 },
  backButton: { padding: 4, alignSelf: "flex-start" },
  titleContainer: { alignItems: "center", marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "900", color: "#1F2937", marginTop: 16 },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1F2937" },
  cardText: { fontSize: 14, color: "#4B5563", lineHeight: 20 },
  bulletRow: { flexDirection: "row", gap: 8 },
  bulletDot: { fontSize: 14, color: "#4B5563", lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 14, color: "#4B5563", lineHeight: 20 },
  link: { fontSize: 14, color: "#8366CC", fontWeight: "700" },
  note: { fontSize: 13, color: "#6B7280", lineHeight: 19 },
  inputContainer: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: { flex: 1, fontSize: 15, color: "#1F2937" },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  checkText: { flex: 1, fontSize: 14, color: "#1F2937", lineHeight: 20 },
  errorText: { fontSize: 13, color: "#EF4444", fontWeight: "600" },
  deleteButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { backgroundColor: "#D1D5DB" },
  deleteButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
