// App.tsx - Main App Entry Point
import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import type { NavigationContainerRef } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";

import RootNavigator from "@nav/RootTabs";
import { store, persistor } from "@store/index";
import { queryClient } from "@utils/queryClient";
import { colors } from "@theme/color";
import AuthInitializer from "@components/AuthInitializer";
import { setupNotificationHandler } from "@services/notificationService";

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

// Set up notification handler
setupNotificationHandler();

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    // Listener for notifications received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received in foreground:", notification);
      }
    );

    // Listener for when user taps on a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped, data:", data);

        // Navigate to order detail screen if orderId is present
        if (data.orderId && navigationRef.current) {
          navigationRef.current.navigate("OrderDetail", {
            orderId: data.orderId,
          });
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer />
          <SafeAreaProvider>
            <NavigationContainer theme={navTheme} ref={navigationRef}>
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
