import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViewStyle, StatusBar } from "react-native";
import { colors } from "@theme/color";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "right" | "bottom" | "left")[];
};

export default function SafeScreen({
  children,
  style,
  edges = ["top", "left", "right"],
}: Props) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.bg }, style]}
      edges={edges}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      {children}
    </SafeAreaView>
  );
}
