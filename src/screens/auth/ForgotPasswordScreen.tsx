// ForgotPasswordScreen — 3-step flow: Identity → OTP → New Password
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@components/SafeScreen";
import { useForgotPasswordSendOtp, useResetPassword } from "@api/hooks/useAuth";

type Step = "identity" | "otp" | "newPassword";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<Step>("identity");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    mobile?: string;
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { mutate: sendOtp, isPending: isSendingOtp } =
    useForgotPasswordSendOtp();
  const { mutate: resetPwd, isPending: isResetting } = useResetPassword();

  const isLoading = isSendingOtp || isResetting;

  // ─── Step 1: Validate & Send OTP ──────────────────────────────

  const handleSendOtp = () => {
    const newErrors: typeof errors = {};

    if (!mobileNumber.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(mobileNumber.trim()))
      newErrors.mobile = "Enter a valid 10-digit mobile number";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Enter a valid email address";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    sendOtp(
      { mobilenumber: mobileNumber.trim(), email: email.trim().toLowerCase() },
      {
        onSuccess: () => setStep("otp"),
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.message ||
              "No account found with this mobile and email. Please check and try again.",
          );
        },
      },
    );
  };

  // ─── Step 2: Verify OTP ───────────────────────────────────────

  const handleVerifyOtp = () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrors({ otp: "Please enter the 6-digit OTP" });
      return;
    }
    setErrors({});
    setStep("newPassword");
  };

  // ─── Step 3: Set New Password ─────────────────────────────────

  const handleResetPassword = () => {
    const newErrors: typeof errors = {};

    if (!newPassword) newErrors.password = "Password is required";
    else if (newPassword.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    resetPwd(
      {
        mobilenumber: mobileNumber.trim(),
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Password Reset!",
            "Your password has been changed successfully. Please login with your new password.",
            [
              {
                text: "Login",
                onPress: () =>
                  navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
              },
            ],
          );
        },
        onError: (error: any) => {
          Alert.alert(
            "Reset Failed",
            error?.response?.data?.message ||
              "Failed to reset password. Please try again.",
          );
        },
      },
    );
  };

  // ─── Back handler ─────────────────────────────────────────────

  const handleBack = () => {
    if (step === "newPassword") {
      setStep("otp");
    } else if (step === "otp") {
      setStep("identity");
      setOtp("");
    } else {
      navigation.goBack();
    }
  };

  // ─── Step config ──────────────────────────────────────────────

  const stepConfig = {
    identity: {
      icon: "key",
      title: "Forgot Password",
      subtitle:
        "Enter your mobile number and registered email to receive a verification code",
    },
    otp: {
      icon: "mail-open",
      title: "Verify OTP",
      subtitle: `Enter the 6-digit code sent to ${email}`,
    },
    newPassword: {
      icon: "lock-open",
      title: "Set New Password",
      subtitle: "Create a strong new password for your account",
    },
  };

  const current = stepConfig[step];

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
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
          </View>

          {/* Step indicator */}
          <View style={styles.stepIndicator}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.stepDot,
                  s <= (step === "identity" ? 1 : step === "otp" ? 2 : 3) &&
                    styles.stepDotActive,
                ]}
              />
            ))}
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Ionicons name={current.icon as any} size={56} color="#8366CC" />
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.subtitle}>{current.subtitle}</Text>
          </View>

          <View style={styles.formContainer}>
            {/* ── Step 1: Identity ── */}
            {step === "identity" && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.mobile && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="phone-portrait-outline"
                      size={20}
                      color="#6B7280"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 10-digit mobile number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={mobileNumber}
                      onChangeText={(t) => {
                        setMobileNumber(t);
                        if (errors.mobile)
                          setErrors({ ...errors, mobile: undefined });
                      }}
                      editable={!isLoading}
                    />
                  </View>
                  {errors.mobile && (
                    <Text style={styles.errorText}>{errors.mobile}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Registered Email</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.email && styles.inputError,
                    ]}
                  >
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your registered email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        if (errors.email)
                          setErrors({ ...errors, email: undefined });
                      }}
                      editable={!isLoading}
                    />
                  </View>
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <Pressable
                  onPress={handleSendOtp}
                  disabled={isLoading}
                  style={[
                    styles.primaryButton,
                    isLoading && styles.buttonDisabled,
                  ]}
                >
                  {isSendingOtp ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="send" size={18} color="#fff" />
                      <Text style={styles.primaryButtonText}>Send OTP</Text>
                    </>
                  )}
                </Pressable>
              </>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <>
                <View style={styles.otpInfoBanner}>
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#8366CC"
                  />
                  <Text style={styles.otpInfoText}>
                    Check your inbox (and spam) for the OTP from{" "}
                    <Text style={{ fontWeight: "800" }}>
                      noreply@aryantechie.in
                    </Text>
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>6-Digit OTP</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.otp && styles.inputError,
                    ]}
                  >
                    <Ionicons name="keypad-outline" size={20} color="#8366CC" />
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="Enter OTP"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otp}
                      onChangeText={(t) => {
                        setOtp(t);
                        if (errors.otp)
                          setErrors({ ...errors, otp: undefined });
                      }}
                      editable={!isLoading}
                      autoFocus
                    />
                  </View>
                  {errors.otp && (
                    <Text style={styles.errorText}>{errors.otp}</Text>
                  )}
                </View>

                <Pressable
                  onPress={handleVerifyOtp}
                  style={styles.primaryButton}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </Pressable>

                <Pressable
                  onPress={handleSendOtp}
                  disabled={isSendingOtp}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>
                    {isSendingOtp ? "Sending..." : "Resend OTP"}
                  </Text>
                </Pressable>
              </>
            )}

            {/* ── Step 3: New Password ── */}
            {step === "newPassword" && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.password && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#6B7280"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Create a new password (min 6 chars)"
                      secureTextEntry={!showPassword}
                      value={newPassword}
                      onChangeText={(t) => {
                        setNewPassword(t);
                        if (errors.password)
                          setErrors({ ...errors, password: undefined });
                      }}
                      editable={!isLoading}
                      autoFocus
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.confirmPassword && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#6B7280"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter new password"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={(t) => {
                        setConfirmPassword(t);
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      editable={!isLoading}
                    />
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </View>
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  style={[
                    styles.primaryButton,
                    isLoading && styles.buttonDisabled,
                  ]}
                >
                  {isResetting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons
                        name="shield-checkmark"
                        size={18}
                        color="#fff"
                      />
                      <Text style={styles.primaryButtonText}>
                        Reset Password
                      </Text>
                    </>
                  )}
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { marginBottom: 12 },
  backButton: { padding: 4 },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  stepDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
  },
  stepDotActive: { backgroundColor: "#8366CC" },
  titleContainer: { alignItems: "center", marginBottom: 36 },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  formContainer: { gap: 20 },
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
  inputError: { borderColor: "#EF4444" },
  input: { flex: 1, fontSize: 15, color: "#1F2937" },
  otpInput: { fontSize: 22, fontWeight: "800", letterSpacing: 8 },
  errorText: { fontSize: 13, color: "#EF4444", marginTop: 2 },
  primaryButton: {
    backgroundColor: "#8366CC",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#D1D5DB" },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  otpInfoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(131,102,204,0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(131,102,204,0.25)",
  },
  otpInfoText: { flex: 1, fontSize: 13, color: "#4B5563", lineHeight: 20 },
  resendButton: { alignItems: "center", paddingVertical: 12 },
  resendText: { fontSize: 14, color: "#8366CC", fontWeight: "700" },
});
