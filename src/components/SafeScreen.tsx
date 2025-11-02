import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewStyle } from 'react-native';

type Props = { children: React.ReactNode; style?: ViewStyle; edges?: ("top" | "right" | "bottom" | "left")[] };

export default function SafeScreen({ children, style, edges = ['top', 'left', 'right'] }: Props) {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
