// Signup Screen - 2-Step: (1) Form + Email, (2) OTP Verification
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
import { useSendEmailOtp, useVerifyAndRegister } from "@api/hooks/useAuth";

type Step = "form" | "otp";

export default function SignupScreen() {
  const navigation = useNavigation<any>();

  // Step state
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP field
  const [otp, setOtp] = useState("");

  // Errors
  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    otp?: string;
  }>({});

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendEmailOtp();
  const { mutate: verifyAndRegister, isPending: isRegistering } =
    useVerifyAndRegister();

  // ─── Validation ───────────────────────────────────────────────

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!mobileNumber.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(mobileNumber.trim()))
      newErrors.mobile = "Please enter a valid 10-digit mobile number";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Please enter a valid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Step 1: Send OTP ─────────────────────────────────────────

  const handleSendOtp = () => {
    if (!validateForm()) return;

    sendOtp(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: () => {
          setStep("otp");
        },
        onError: (error: any) => {
          Alert.alert(
            "OTP Failed",
            error?.response?.data?.message ||
              "Failed to send OTP. Please try again.",
          );
        },
      },
    );
  };

  // ─── Step 2: Verify OTP & Register ────────────────────────────

  const handleVerifyAndRegister = () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrors({ ...errors, otp: "Please enter the 6-digit OTP" });
      return;
    }

    verifyAndRegister(
      {
        name: name.trim(),
        mobilenumber: mobileNumber.trim(),
        password,
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Account Created!",
            "Your account has been created with a verified email. Please login to continue.",
            [{ text: "Login", onPress: () => navigation.navigate("Login") }],
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

  const isLoading = isSendingOtp || isRegistering;

  // ─── Render ───────────────────────────────────────────────────

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
            <Pressable
              onPress={() => {
                if (step === "otp") {
                  setStep("form");
                  setOtp("");
                } else {
                  navigation.goBack();
                }
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
          </View>

          {/* Logo/Title */}
          <View style={styles.titleContainer}>
            <Ionicons
              name={step === "otp" ? "mail-open" : "person-add"}
              size={60}
              color="#8366CC"
            />
            <Text style={styles.title}>
              {step === "otp" ? "Verify Email" : "Create Account"}
            </Text>
            <Text style={styles.subtitle}>
              {step === "otp"
                ? `Enter the 6-digit OTP sent to ${email}`
                : "Sign up to start shopping"}
            </Text>
          </View>

          {/* ────── STEP 1: FORM ────── */}
          {step === "form" && (
            <View style={styles.formContainer}>
              {/* Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.name && styles.inputError,
                  ]}
                >
                  <Ionicons name="person-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={(t) => {
                      setName(t);
                      if (errors.name)
                        setErrors({ ...errors, name: undefined });
                    }}
                    editable={!isLoading}
                  />
                </View>
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Mobile */}
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

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
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
                    placeholder="Create a password (min 6 characters)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (errors.password)
                        setErrors({ ...errors, password: undefined });
                    }}
                    editable={!isLoading}
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

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
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
                    placeholder="Re-enter your password"
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
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              {/* Email — highlighted as mandatory for password recovery */}
              <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.requiredBadge}>
                    <Ionicons
                      name="shield-checkmark"
                      size={12}
                      color="#8366CC"
                    />
                    <Text style={styles.requiredText}>
                      Required for password recovery
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.inputWrapper,
                    styles.emailHighlight,
                    errors.email && styles.inputError,
                  ]}
                >
                  <Ionicons name="mail-outline" size={20} color="#8366CC" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
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
                {!errors.email && (
                  <Text style={styles.hintText}>
                    📧 A 6-digit OTP will be sent to verify your email
                  </Text>
                )}
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Send OTP Button */}
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
                    <Text style={styles.primaryButtonText}>
                      Send OTP to Email
                    </Text>
                  </>
                )}
              </Pressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Pressable onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Login</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ────── STEP 2: OTP ────── */}
          {step === "otp" && (
            <View style={styles.formContainer}>
              {/* OTP Info Banner */}
              <View style={styles.otpInfoBanner}>
                <Ionicons name="information-circle" size={20} color="#8366CC" />
                <Text style={styles.otpInfoText}>
                  Check your inbox (and spam folder) for the OTP from{" "}
                  <Text style={{ fontWeight: "800" }}>
                    noreply@aryantechie.in
                  </Text>
                </Text>
              </View>

              {/* OTP Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>6-Digit OTP</Text>
                <View
                  style={[styles.inputWrapper, errors.otp && styles.inputError]}
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
                      if (errors.otp) setErrors({ ...errors, otp: undefined });
                    }}
                    editable={!isLoading}
                    autoFocus
                  />
                </View>
                {errors.otp && (
                  <Text style={styles.errorText}>{errors.otp}</Text>
                )}
              </View>

              {/* Verify & Create Account */}
              <Pressable
                onPress={handleVerifyAndRegister}
                disabled={isLoading}
                style={[
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
              >
                {isRegistering ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.primaryButtonText}>
                      Verify & Create Account
                    </Text>
                  </>
                )}
              </Pressable>

              {/* Resend */}
              <Pressable
                onPress={() => handleSendOtp()}
                disabled={isSendingOtp}
                style={styles.resendButton}
              >
                <Text style={styles.resendText}>
                  {isSendingOtp ? "Sending..." : "Resend OTP"}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { marginBottom: 20 },
  backButton: { padding: 4 },
  titleContainer: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  formContainer: { gap: 20 },
  inputContainer: { gap: 8 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 4,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  requiredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(131,102,204,0.10)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  requiredText: { fontSize: 11, color: "#8366CC", fontWeight: "600" },
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
  emailHighlight: {
    borderColor: "#8366CC",
    borderWidth: 1.5,
    backgroundColor: "rgba(131,102,204,0.04)",
  },
  inputError: { borderColor: "#EF4444" },
  input: { flex: 1, fontSize: 15, color: "#1F2937" },
  otpInput: { fontSize: 22, fontWeight: "800", letterSpacing: 8 },
  errorText: { fontSize: 13, color: "#EF4444", marginTop: 2 },
  hintText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { fontSize: 14, color: "#6B7280" },
  loginLink: { fontSize: 14, fontWeight: "700", color: "#8366CC" },
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
  resendButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  resendText: { fontSize: 14, color: "#8366CC", fontWeight: "700" },
});
