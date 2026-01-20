// OrderSuccessAnimation.tsx - Cart flies to delivery truck animation
import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface OrderSuccessAnimationProps {
  visible: boolean;
  orderId: string;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export default function OrderSuccessAnimation({
  visible,
  orderId,
  onViewOrders,
  onContinueShopping,
}: OrderSuccessAnimationProps) {
  // Animation values
  const backdropOpacity = useSharedValue(0);
  const cartScale = useSharedValue(0);
  const cartTranslateY = useSharedValue(0);
  const cartTranslateX = useSharedValue(0);
  const cartOpacity = useSharedValue(1);
  const cartRotate = useSharedValue(0);

  // Trail elements
  const trail1Opacity = useSharedValue(0);
  const trail2Opacity = useSharedValue(0);
  const trail3Opacity = useSharedValue(0);
  const trail1Y = useSharedValue(0);
  const trail2Y = useSharedValue(0);
  const trail3Y = useSharedValue(0);

  // Truck animation
  const truckScale = useSharedValue(1);
  const truckGlow = useSharedValue(0);
  const truckBounce = useSharedValue(0);

  // Success popup
  const popupScale = useSharedValue(0);
  const popupOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);

  const [showButtons, setShowButtons] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setShowButtons(false);

      // Reset all values
      backdropOpacity.value = 0;
      cartScale.value = 0;
      cartTranslateY.value = 0;
      cartTranslateX.value = 0;
      cartOpacity.value = 1;
      cartRotate.value = 0;
      trail1Opacity.value = 0;
      trail2Opacity.value = 0;
      trail3Opacity.value = 0;
      trail1Y.value = 0;
      trail2Y.value = 0;
      trail3Y.value = 0;
      truckScale.value = 1;
      truckGlow.value = 0;
      truckBounce.value = 0;
      popupScale.value = 0;
      popupOpacity.value = 0;
      checkScale.value = 0;
      textOpacity.value = 0;
      buttonsOpacity.value = 0;

      // Phase 1: Backdrop + Cart appears (0-600ms)
      backdropOpacity.value = withTiming(1, { duration: 400 });
      cartScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.3, { damping: 8, stiffness: 100 }),
        withSpring(1.1, { damping: 10, stiffness: 150 }),
      );
      // Cart wobble
      cartRotate.value = withSequence(
        withDelay(400, withTiming(-8, { duration: 100 })),
        withTiming(8, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      );

      // Phase 2: Cart flies to truck (700-1500ms)
      const flightDelay = 700;
      const flightDuration = 800;

      // Cart moves up and slightly right toward truck
      cartTranslateY.value = withDelay(
        flightDelay,
        withTiming(-height * 0.35, {
          duration: flightDuration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );
      cartTranslateX.value = withDelay(
        flightDelay,
        withTiming(0, {
          duration: flightDuration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );
      cartScale.value = withDelay(
        flightDelay,
        withTiming(0.2, {
          duration: flightDuration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );
      cartRotate.value = withDelay(
        flightDelay,
        withTiming(-20, {
          duration: flightDuration,
          easing: Easing.out(Easing.quad),
        }),
      );

      // Trail elements
      trail1Opacity.value = withDelay(
        flightDelay + 100,
        withSequence(
          withTiming(0.8, { duration: 150 }),
          withTiming(0, { duration: 450 }),
        ),
      );
      trail1Y.value = withDelay(
        flightDelay + 100,
        withTiming(-height * 0.15, { duration: 550 }),
      );

      trail2Opacity.value = withDelay(
        flightDelay + 200,
        withSequence(
          withTiming(0.6, { duration: 150 }),
          withTiming(0, { duration: 400 }),
        ),
      );
      trail2Y.value = withDelay(
        flightDelay + 200,
        withTiming(-height * 0.1, { duration: 500 }),
      );

      trail3Opacity.value = withDelay(
        flightDelay + 300,
        withSequence(
          withTiming(0.4, { duration: 150 }),
          withTiming(0, { duration: 350 }),
        ),
      );
      trail3Y.value = withDelay(
        flightDelay + 300,
        withTiming(-height * 0.05, { duration: 450 }),
      );

      // Cart fades near truck
      cartOpacity.value = withDelay(
        flightDelay + flightDuration - 150,
        withTiming(0, { duration: 150 }),
      );

      // Phase 3: Truck receives cart with bounce + glow (1500-2000ms)
      const receiveDelay = flightDelay + flightDuration;
      truckScale.value = withDelay(
        receiveDelay - 100,
        withSequence(
          withSpring(1.5, { damping: 6, stiffness: 180 }),
          withSpring(1.15, { damping: 10, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 180 }),
        ),
      );
      truckGlow.value = withDelay(
        receiveDelay - 100,
        withSequence(
          withTiming(1, { duration: 250 }),
          withTiming(0.4, { duration: 400 }),
        ),
      );
      // Truck wobbles like it received something
      truckBounce.value = withDelay(
        receiveDelay,
        withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 100 }),
          withTiming(-3, { duration: 80 }),
          withTiming(0, { duration: 80 }),
        ),
      );

      // Phase 4: Success popup appears (2000-2500ms)
      const popupDelay = receiveDelay + 400;
      popupScale.value = withDelay(
        popupDelay,
        withSpring(1, { damping: 10, stiffness: 100 }),
      );
      popupOpacity.value = withDelay(
        popupDelay,
        withTiming(1, { duration: 300 }),
      );
      checkScale.value = withDelay(
        popupDelay + 200,
        withSequence(
          withTiming(1.3, {
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
          }),
          withTiming(1, { duration: 150 }),
        ),
      );
      textOpacity.value = withDelay(
        popupDelay + 300,
        withTiming(1, { duration: 300 }),
      );
      buttonsOpacity.value = withDelay(
        popupDelay + 500,
        withTiming(1, { duration: 300 }),
      );

      // Enable buttons after animation
      setTimeout(() => {
        setShowButtons(true);
      }, popupDelay + 900);
    }
  }, [visible]);

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.75,
  }));

  const cartStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: cartTranslateY.value },
      { translateX: cartTranslateX.value },
      { scale: cartScale.value },
      { rotate: `${cartRotate.value}deg` },
    ],
    opacity: cartOpacity.value,
  }));

  const trail1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: trail1Y.value }, { scale: 0.7 }],
    opacity: trail1Opacity.value,
  }));

  const trail2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: trail2Y.value }, { scale: 0.5 }],
    opacity: trail2Opacity.value,
  }));

  const trail3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: trail3Y.value }, { scale: 0.35 }],
    opacity: trail3Opacity.value,
  }));

  const truckStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: truckScale.value },
      { rotate: `${truckBounce.value}deg` },
    ],
  }));

  const truckGlowStyle = useAnimatedStyle(() => ({
    opacity: truckGlow.value,
    transform: [{ scale: 1 + truckGlow.value * 0.5 }],
  }));

  const popupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popupScale.value }],
    opacity: popupOpacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Semi-transparent backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      {/* Truck icon at top */}
      <Animated.View style={[styles.truckTarget, truckStyle]}>
        <Animated.View style={[styles.truckGlow, truckGlowStyle]} />
        <LinearGradient
          colors={["#F59E0B", "#D97706"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.truckCircle}
        >
          <Ionicons name="car-sport" size={36} color="#fff" />
        </LinearGradient>
      </Animated.View>

      {/* Trail elements */}
      <Animated.View style={[styles.trailElement, trail1Style]}>
        <View style={styles.trailDot} />
      </Animated.View>
      <Animated.View style={[styles.trailElement, trail2Style]}>
        <View style={styles.trailDot} />
      </Animated.View>
      <Animated.View style={[styles.trailElement, trail3Style]}>
        <View style={styles.trailDot} />
      </Animated.View>

      {/* Flying cart */}
      <Animated.View style={[styles.cartContainer, cartStyle]}>
        <View style={styles.cartGlow} />
        <LinearGradient
          colors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cartCircle}
        >
          <Ionicons name="cart" size={56} color="#fff" />
        </LinearGradient>
      </Animated.View>

      {/* Success popup */}
      <Animated.View style={[styles.popupContainer, popupStyle]}>
        <View style={styles.popup}>
          <Animated.View style={[styles.checkCircle, checkStyle]}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </Animated.View>

          <Animated.Text style={[styles.successTitle, textStyle]}>
            Order Placed!
          </Animated.Text>

          <Animated.Text style={[styles.orderId, textStyle]}>
            Order ID: {orderId.slice(-8).toUpperCase()}
          </Animated.Text>

          <Animated.Text style={[styles.successSubtitle, textStyle]}>
            Your order is on its way! 🎉
          </Animated.Text>

          <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
            <Pressable
              style={styles.primaryButton}
              onPress={onViewOrders}
              disabled={!showButtons}
            >
              <Ionicons name="receipt-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>View Orders</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={onContinueShopping}
              disabled={!showButtons}
            >
              <Ionicons name="bag-handle-outline" size={20} color="#8366CC" />
              <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  truckTarget: {
    position: "absolute",
    top: height * 0.1,
    alignSelf: "center",
  },
  truckGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F59E0B",
    top: -22,
    left: -22,
  },
  truckCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 14,
  },
  trailElement: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  trailDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  cartContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  cartGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
  },
  cartCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  popupContainer: {
    position: "absolute",
    top: height * 0.28,
    alignItems: "center",
    width: width * 0.9,
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  successSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 28,
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#8366CC",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    color: "#8366CC",
    fontSize: 17,
    fontWeight: "700",
  },
});
