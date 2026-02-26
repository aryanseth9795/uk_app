// EmailVerifyModal — shown to existing logged-in users who have no email on file
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useSendEmailOtp, useAddEmail } from "@api/hooks/useAuth";

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

type Step = "email" | "otp";

export default function EmailVerifyModal({ visible, onDismiss }: Props) {
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendEmailOtp();
  const { mutate: addEmail, isPending: isAdding } = useAddEmail();

  const isLoading = isSendingOtp || isAdding;

  const handleSendOtp = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");

    sendOtp(
      { email: trimmed },
      {
        onSuccess: () => setStep("otp"),
        onError: (error: any) => {
          Alert.alert(
            "OTP Failed",
            error?.response?.data?.message || "Failed to send OTP. Try again.",
          );
        },
      },
    );
  };

  const handleVerify = () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }
    setOtpError("");

    addEmail(
      { email: email.trim().toLowerCase(), otp: otp.trim() },
      {
        onSuccess: () => {
          // Invalidate user profile so AccountScreen re-fetches fresh data
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          Alert.alert(
            "Email Verified!",
            "Your email has been saved successfully.",
            [{ text: "OK", onPress: onDismiss }],
          );
        },
        onError: (error: any) => {
          Alert.alert(
            "Verification Failed",
            error?.response?.data?.message ||
              "Invalid or expired OTP. Please try again.",
          );
        },
      },
    );
  };

  const resetAndDismiss = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setEmailError("");
    setOtpError("");
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={resetAndDismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons
                name={step === "otp" ? "mail-open" : "mail"}
                size={28}
                color="#8366CC"
              />
            </View>
            <Pressable onPress={resetAndDismiss} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.title}>
            {step === "otp" ? "Enter Verification Code" : "Add Your Email"}
          </Text>
          <Text style={styles.subtitle}>
            {step === "otp"
              ? `We sent a 6-digit OTP to ${email}`
              : "Your email is needed for password recovery. It takes just a minute to verify."}
          </Text>

          {/* ── Step 1: Email Input ── */}
          {step === "email" && (
            <>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#8366CC" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailError) setEmailError("");
                  }}
                  editable={!isLoading}
                />
              </View>
              {!!emailError && (
                <Text style={styles.errorText}>{emailError}</Text>
              )}

              <Pressable
                onPress={handleSendOtp}
                disabled={isLoading}
                style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
              >
                {isSendingOtp ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Send OTP</Text>
                )}
              </Pressable>

              <Pressable onPress={resetAndDismiss} style={styles.skipBtn}>
                <Text style={styles.skipText}>Remind me later</Text>
              </Pressable>
            </>
          )}

          {/* ── Step 2: OTP Input ── */}
          {step === "otp" && (
            <>
              <View style={styles.inputWrapper}>
                <Ionicons name="keypad-outline" size={20} color="#8366CC" />
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  placeholder="6-digit OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(t) => {
                    setOtp(t);
                    if (otpError) setOtpError("");
                  }}
                  editable={!isLoading}
                  autoFocus
                />
              </View>
              {!!otpError && <Text style={styles.errorText}>{otpError}</Text>}

              <Pressable
                onPress={handleVerify}
                disabled={isLoading}
                style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
              >
                {isAdding ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & Save</Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  setStep("email");
                  setOtp("");
                  setOtpError("");
                }}
                style={styles.skipBtn}
              >
                <Text style={styles.skipText}>← Change email</Text>
              </Pressable>

              <Pressable
                onPress={handleSendOtp}
                disabled={isSendingOtp}
                style={styles.skipBtn}
              >
                <Text style={[styles.skipText, { color: "#8366CC" }]}>
                  {isSendingOtp ? "Sending..." : "Resend OTP"}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(131,102,204,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(131,102,204,0.06)",
    borderWidth: 1.5,
    borderColor: "#8366CC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  otpInput: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: -4,
  },
  primaryBtn: {
    backgroundColor: "#8366CC",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  btnDisabled: { backgroundColor: "#D1D5DB" },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
