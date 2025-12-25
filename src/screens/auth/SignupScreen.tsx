// Signup Screen - Complete with API Integration
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
import { useRegister } from "@api/hooks/useAuth";

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { mutate: register, isPending: isLoading } = useRegister();

  const validateForm = () => {
    const newErrors: {
      name?: string;
      mobile?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Mobile number validation (10 digits)
    if (!mobileNumber.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateForm()) {
      return;
    }

    register(
      {
        name: name.trim(),
        mobilenumber: mobileNumber.trim(),
        password: password,
      },
      {
        onSuccess: (response) => {
          Alert.alert(
            "Success!",
            "Account created successfully. Please login to continue.",
            [
              {
                text: "Login",
                onPress: () => navigation.navigate("Login"),
              },
            ]
          );
        },
        onError: (error: any) => {
          Alert.alert(
            "Signup Failed",
            error?.response?.data?.message ||
              "Failed to create account. Please try again."
          );
        },
      }
    );
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
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
          </View>

          {/* Logo/Title */}
          <View style={styles.titleContainer}>
            <Ionicons name="person-add" size={60} color="#8366CC" />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start shopping</Text>
          </View>

          {/* Signup Form */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View
                style={[styles.inputWrapper, errors.name && styles.inputError]}
              >
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Mobile Number Input */}
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
                  onChangeText={(text) => {
                    setMobileNumber(text);
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

            {/* Password Input */}
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
                  onChangeText={(text) => {
                    setPassword(text);
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

            {/* Confirm Password Input */}
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
                  onChangeText={(text) => {
                    setConfirmPassword(text);
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

            {/* Signup Button */}
            <Pressable
              onPress={handleSignup}
              disabled={isLoading}
              style={[
                styles.signupButton,
                isLoading && styles.signupButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
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
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
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
  inputError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: 4,
  },
  signupButton: {
    backgroundColor: "#8366CC",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
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
  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8366CC",
  },
});
