// Quick Access Cards Component with Background Images
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type QuickAccessCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string, ...string[]];
  imageUrl: string;
  onPress: () => void;
};

export default function QuickAccessCard({
  title,
  icon,
  gradient,
  imageUrl,
  onPress,
}: QuickAccessCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={[...gradient, "rgba(0,0,0,0.3)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name={icon} size={32} color="#fff" />
          <Text style={styles.title}>{title}</Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imageBackground: {
    width: "100%",
    minHeight: 110,
  },
  image: {
    borderRadius: 16,
  },
  gradient: {
    padding: 16,
    minHeight: 110,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
