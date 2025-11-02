import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootTabs from '@nav/RootTabs';
import { store } from '@store/index';
import { queryClient } from '@utils/queryClient';
import { colors } from '@theme/color';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    text: colors.text,
    primary: colors.tint,
    card: colors.card,
    border: '#eee',
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="light" translucent={false} backgroundColor={colors.headerStart} />
            <RootTabs />
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}
