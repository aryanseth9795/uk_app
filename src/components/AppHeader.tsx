import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@theme/color";
import SearchBar from "@components/SearchBar";

type Props = {
  searchValue: string;
  onSearchChange: (v: string) => void;
  subtitle?: string;
};

export default function AppHeader({
  searchValue,
  onSearchChange,
  subtitle = "Beauty • Gifts • Fragrance",
}: Props) {
  
  const FLOAT_OFFSET = 2; 
  const SEARCH_HEIGHT = 8; 
  const RESERVED_SPACE = FLOAT_OFFSET + SEARCH_HEIGHT; 

  return (
    <LinearGradient
      colors={[colors.headerStart, colors.headerEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 2 }}
    >
      <SafeAreaView edges={["top", "left", "right"]}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 2,
            paddingBottom: 54,
            marginBottom: 1,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: "900",
              letterSpacing: -0.3,
              lineHeight: 30,
              justifyContent: "center",
            }}
          >
            U K Cosmetics & Gift Center
          </Text>

          <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
            {subtitle}
          </Text>
        </View>

        {/* Floating search pill */}
        <View
          style={{
            paddingHorizontal: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -FLOAT_OFFSET,
          }}
        >
          <View
            style={{
              borderRadius: 25,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <SearchBar value={searchValue} onChangeText={onSearchChange} />
          </View>
        </View>
      </SafeAreaView>

      {/* Reserve space below the header equal to the floating pill height */}
      <View
        style={{ height: RESERVED_SPACE, marginBottom: 5, paddingBottom: 1 }}
      />
    </LinearGradient>
  );
}


