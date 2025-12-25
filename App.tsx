// App.tsx - Main App Entry Point
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";

import RootNavigator from "@nav/RootTabs";
import { store, persistor } from "@store/index";
import { queryClient } from "@utils/queryClient";
import { colors } from "@theme/color";
import AuthInitializer from "@components/AuthInitializer";

// Navigation theme (matching app colors)
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    text: colors.text,
    primary: colors.tint,
    card: colors.card,
    border: "#eee",
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer />
          <SafeAreaProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar
                style="light"
                translucent={false}
                backgroundColor={colors.headerStart}
              />
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
