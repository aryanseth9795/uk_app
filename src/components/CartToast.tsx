// CartToast.tsx - Center-screen "Fly to Cart" animation with visible trail
import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
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
  // Animation values
  const backdropOpacity = useSharedValue(0);
  const bagScale = useSharedValue(0);
  const bagTranslateY = useSharedValue(0);
  const bagOpacity = useSharedValue(1);
  const bagRotate = useSharedValue(0);
  const trailOpacity = useSharedValue(0);
  const trailScale = useSharedValue(1);
  const cartScale = useSharedValue(1);
  const cartGlow = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const successContainerScale = useSharedValue(0);
  // Trail elements
  const trail1Opacity = useSharedValue(0);
  const trail2Opacity = useSharedValue(0);
  const trail3Opacity = useSharedValue(0);
  const trail1Y = useSharedValue(0);
  const trail2Y = useSharedValue(0);
  const trail3Y = useSharedValue(0);

  const hideToast = useCallback(() => {
    onHide();
  }, [onHide]);

  useEffect(() => {
    if (visible) {
      // Reset all values
      backdropOpacity.value = 0;
      bagScale.value = 0;
      bagTranslateY.value = 0;
      bagOpacity.value = 1;
      bagRotate.value = 0;
      trailOpacity.value = 0;
      trailScale.value = 1;
      cartScale.value = 1;
      cartGlow.value = 0;
      checkScale.value = 0;
      textOpacity.value = 0;
      successContainerScale.value = 0;
      trail1Opacity.value = 0;
      trail2Opacity.value = 0;
      trail3Opacity.value = 0;
      trail1Y.value = 0;
      trail2Y.value = 0;
      trail3Y.value = 0;

      // Phase 1: Backdrop fades in, bag appears with dramatic entrance (0-600ms)
      backdropOpacity.value = withTiming(1, { duration: 400 });
      bagScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1.3, { damping: 8, stiffness: 100 }),
        withSpring(1.1, { damping: 10, stiffness: 150 }),
      );
      // Slight wobble to indicate readiness
      bagRotate.value = withSequence(
        withDelay(400, withTiming(-5, { duration: 100 })),
        withTiming(5, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      );

      // Phase 2: Bag rockets upward with trail (700-1400ms)
      const flightDelay = 700;
      const flightDuration = 700;

      bagTranslateY.value = withDelay(
        flightDelay,
        withTiming(-height * 0.38, {
          duration: flightDuration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );
      // Bag shrinks as it flies up
      bagScale.value = withDelay(
        flightDelay,
        withTiming(0.25, {
          duration: flightDuration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      );
      // Slight rotation during flight for realism
      bagRotate.value = withDelay(
        flightDelay,
        withTiming(-15, {
          duration: flightDuration,
          easing: Easing.out(Easing.quad),
        }),
      );

      // Trail elements appear during flight
      trail1Opacity.value = withDelay(
        flightDelay + 100,
        withSequence(
          withTiming(0.8, { duration: 150 }),
          withTiming(0, { duration: 400 }),
        ),
      );
      trail1Y.value = withDelay(
        flightDelay + 100,
        withTiming(-height * 0.15, { duration: 500 }),
      );

      trail2Opacity.value = withDelay(
        flightDelay + 200,
        withSequence(
          withTiming(0.6, { duration: 150 }),
          withTiming(0, { duration: 350 }),
        ),
      );
      trail2Y.value = withDelay(
        flightDelay + 200,
        withTiming(-height * 0.1, { duration: 450 }),
      );

      trail3Opacity.value = withDelay(
        flightDelay + 300,
        withSequence(
          withTiming(0.4, { duration: 150 }),
          withTiming(0, { duration: 300 }),
        ),
      );
      trail3Y.value = withDelay(
        flightDelay + 300,
        withTiming(-height * 0.05, { duration: 400 }),
      );

      // Bag fades near cart
      bagOpacity.value = withDelay(
        flightDelay + flightDuration - 100,
        withTiming(0, { duration: 100 }),
      );

      // Phase 3: Cart receives with satisfying bounce + glow (1400-1800ms)
      const receiveDelay = flightDelay + flightDuration;
      cartScale.value = withDelay(
        receiveDelay - 50,
        withSequence(
          withSpring(1.5, { damping: 6, stiffness: 180 }),
          withSpring(1.15, { damping: 10, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 180 }),
        ),
      );
      cartGlow.value = withDelay(
        receiveDelay - 50,
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0.3, { duration: 400 }),
        ),
      );

      // Success message appears
      successContainerScale.value = withDelay(
        receiveDelay + 200,
        withSpring(1, { damping: 12, stiffness: 120 }),
      );
      checkScale.value = withDelay(
        receiveDelay + 300,
        withSequence(
          withTiming(1.2, {
            duration: 250,
            easing: Easing.out(Easing.back(1.5)),
          }),
          withTiming(1, { duration: 150 }),
        ),
      );
      textOpacity.value = withDelay(
        receiveDelay + 350,
        withTiming(1, { duration: 300 }),
      );

      // Phase 4: Everything fades out (2200-2600ms)
      const timeout = setTimeout(() => {
        backdropOpacity.value = withTiming(0, { duration: 350 });
        successContainerScale.value = withTiming(0.9, { duration: 300 });
        textOpacity.value = withTiming(0, { duration: 250 });
        cartScale.value = withTiming(1, { duration: 300 });
        cartGlow.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(hideToast)();
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [
    visible,
    backdropOpacity,
    bagScale,
    bagTranslateY,
    bagOpacity,
    bagRotate,
    trailOpacity,
    trailScale,
    cartScale,
    cartGlow,
    checkScale,
    textOpacity,
    successContainerScale,
    trail1Opacity,
    trail2Opacity,
    trail3Opacity,
    trail1Y,
    trail2Y,
    trail3Y,
    hideToast,
  ]);

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.65,
  }));

  const bagStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bagTranslateY.value },
      { scale: bagScale.value },
      { rotate: `${bagRotate.value}deg` },
    ],
    opacity: bagOpacity.value,
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

  const cartIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  const cartGlowStyle = useAnimatedStyle(() => ({
    opacity: cartGlow.value,
    transform: [{ scale: 1 + cartGlow.value * 0.5 }],
  }));

  const successContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successContainerScale.value }],
    opacity: interpolate(successContainerScale.value, [0, 0.5, 1], [0, 0.5, 1]),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      {/* Semi-transparent backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      {/* Cart icon at top with glow */}
      <Animated.View style={[styles.cartTarget, cartIconStyle]}>
        <Animated.View style={[styles.cartGlow, cartGlowStyle]} />
        <LinearGradient
          colors={["#10B981", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cartCircle}
        >
          <Ionicons name="cart" size={32} color="#fff" />
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

      {/* Flying shopping bag - larger and more prominent */}
      <Animated.View style={[styles.bagContainer, bagStyle]}>
        <View style={styles.bagGlow} />
        <LinearGradient
          colors={["#A855F7", "#7C3AED", "#6D28D9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bagCircle}
        >
          <Ionicons name="bag-handle" size={56} color="#fff" />
        </LinearGradient>
      </Animated.View>

      {/* Success message container */}
      <Animated.View style={[styles.successContainer, successContainerStyle]}>
        <Animated.View style={[styles.checkCircle, checkStyle]}>
          <Ionicons name="checkmark" size={36} color="#fff" />
        </Animated.View>
        <Animated.Text style={[styles.successTitle, textStyle]}>
          Added to Cart!
        </Animated.Text>
        <Animated.Text
          style={[styles.productName, textStyle]}
          numberOfLines={1}
        >
          {productName}
        </Animated.Text>
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
  cartTarget: {
    position: "absolute",
    top: height * 0.1,
    alignSelf: "center",
  },
  cartGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10B981",
    top: -18,
    left: -18,
  },
  cartCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
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
    backgroundColor: "#A855F7",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  bagContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  bagGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(168, 85, 247, 0.3)",
  },
  bagCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  successContainer: {
    position: "absolute",
    alignItems: "center",
    top: height * 0.45,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  productName: {
    fontSize: 17,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    maxWidth: width * 0.8,
    textAlign: "center",
  },
});
