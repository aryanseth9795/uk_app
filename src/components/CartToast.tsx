// CartToast.tsx - Animated "Added to Cart" toast notification
import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface CartToastProps {
  visible: boolean;
  productName: string;
  onHide: () => void;
}

export default function CartToast({
  visible,
  productName,
  onHide,
}: CartToastProps) {
  const translateY = useSharedValue(-120);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  const hideToast = useCallback(() => {
    onHide();
  }, [onHide]);

  useEffect(() => {
    if (visible) {
      // Animate in
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(20, {
        damping: 15,
        stiffness: 150,
      });
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 200,
      });
      // Animate the check icon with a bounce
      checkScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.3, { duration: 300, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 150 }),
      );

      // Auto hide after 2 seconds
      const timeout = setTimeout(() => {
        // Animate out
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(-120, { duration: 300 });
        scale.value = withTiming(0.8, { duration: 200 }, () => {
          runOnJS(hideToast)();
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [visible, translateY, scale, opacity, checkScale, hideToast]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={["#10B981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.iconContainer, checkIconStyle]}>
          <View style={styles.iconBg}>
            <Ionicons name="checkmark" size={20} color="#10B981" />
          </View>
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Added to Cart!</Text>
          <Text style={styles.productName} numberOfLines={1}>
            {productName}
          </Text>
        </View>
        <View style={styles.cartIconContainer}>
          <Ionicons name="cart" size={24} color="rgba(255,255,255,0.8)" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  cartIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
