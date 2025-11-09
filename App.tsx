// import 'react-native-gesture-handler';
// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// import { Provider } from 'react-redux';
// import { QueryClientProvider } from '@tanstack/react-query';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import RootTabs from '@nav/RootTabs';
// import { store } from '@store/index';
// import { queryClient } from '@utils/queryClient';
// import { colors } from '@theme/color';

// const navTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: colors.bg,
//     text: colors.text,
//     primary: colors.tint,
//     card: colors.card,
//     border: '#eee',
//   },
// };

// export default function App() {
//   return (
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//         <SafeAreaProvider>
//           <NavigationContainer theme={navTheme}>
//             <StatusBar style="light" translucent={false} backgroundColor={colors.headerStart} />
//             <RootTabs />
//           </NavigationContainer>
//         </SafeAreaProvider>
//       </QueryClientProvider>
//     </Provider>
//   );
// }

// import 'react-native-gesture-handler';
// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { QueryClientProvider } from '@tanstack/react-query';

// import RootTabs from '@nav/RootTabs';
// import { store, persistor } from '@store/index';   // updated import
// import { queryClient } from '@utils/queryClient';
// import { colors } from '@theme/color';

// // Navigation theme (matching app colors)
// const navTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: colors.bg,
//     text: colors.text,
//     primary: colors.tint,
//     card: colors.card,
//     border: '#eee',
//   },
// };

// export default function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <QueryClientProvider client={queryClient}>
//           <SafeAreaProvider>
//             <NavigationContainer theme={navTheme}>
//               <StatusBar style="light" translucent={false} backgroundColor={colors.headerStart} />
//               <RootTabs />
//             </NavigationContainer>
//           </SafeAreaProvider>
//         </QueryClientProvider>
//       </PersistGate>
//     </Provider>
//   );
// }



// App.tsx
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import RootNavigator from '@nav/RootTabs'; // <-- use the guarded navigator
import { store, persistor } from '@store/index';
import { hydrateAuth } from '@store/slices/authSlice';
import { queryClient } from '@utils/queryClient';
import { colors } from '@theme/color';

// Navigation theme (matching app colors)
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
  useEffect(() => {
    // Load tokens on app start (and refresh if needed)
    store.dispatch(hydrateAuth());
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar style="light" translucent={false} backgroundColor={colors.headerStart} />
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
