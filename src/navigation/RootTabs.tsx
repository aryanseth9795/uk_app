// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '@screens/HomeScreen';
// import CartScreen from '@screens/CartScreen';
// import AccountScreen from '@screens/AccountScreen';
// import { Ionicons } from '@expo/vector-icons';
// import { View, Text } from 'react-native';
// import { useAppSelector } from '@store/hooks';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const Tab = createBottomTabNavigator();

// const CartIcon = ({ color, size }: { color: string; size: number }) => {
//   const count = useAppSelector(s => s.cart.items.reduce((n, i) => n + i.qty, 0));
//   return (
//     <View>
//       <Ionicons name="cart-outline" size={size} color={color} />
//       {count > 0 && (
//         <View
//           style={{
//             position: 'absolute', right: -6, top: -4,
//             minWidth: 16, height: 12, borderRadius: 12,
//             backgroundColor: '#8366CC',
//             alignItems: 'center', justifyContent: 'center',
//             paddingHorizontal: 3,
//           }}
//         >
//           <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{count}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default function RootTabs() {
//     const insets = useSafeAreaInsets();
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#8366CC',
//         tabBarStyle: { height: 48 + insets.bottom, paddingBottom: Math.max(12, insets.bottom), paddingTop: 4 },
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }}
//       />
//       <Tab.Screen
//         name="Cart"
//         component={CartScreen}
//         options={{ tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} /> }}
//       />
//       <Tab.Screen
//         name="Account"
//         component={AccountScreen}
//         options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }}
//       />
//     </Tab.Navigator>
//   );
// }

// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import HomeScreen from "@screens/HomeScreen";
// import CartScreen from "@screens/CartScreen";
// import AccountScreen from "@screens/AccountScreen";
// import ProductDetailScreen from "@screens/ProductDetailScreen";
// import { Ionicons } from "@expo/vector-icons";
// import { View, Text } from "react-native";
// import { useAppSelector } from "@store/hooks";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import LoginScreen from "@screens/LoginScreen";
// import RegisterScreen from "@screens/RegisterScreen";

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// const CartIcon = ({ color, size }: { color: string; size: number }) => {
//   const count = useAppSelector((s) =>
//     s.cart.items.reduce((n, i) => n + i.qty, 0)
//   );
//   return (
//     <View>
//       <Ionicons name="cart-outline" size={size} color={color} />
//       {count > 0 && (
//         <View
//           style={{
//             position: "absolute",
//             right: -6,
//             top: -4,
//             minWidth: 16,
//             height: 12,
//             borderRadius: 12,
//             backgroundColor: "#8366CC",
//             alignItems: "center",
//             justifyContent: "center",
//             paddingHorizontal: 3,
//           }}
//         >
//           <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
//             {count}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// function Tabs() {
//   const insets = useSafeAreaInsets();
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#8366CC",
//         tabBarStyle: {
//           height: 48 + insets.bottom,
//           paddingBottom: Math.max(12, insets.bottom),
//           paddingTop: 4,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Cart"
//         component={CartScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <CartIcon color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Account"
//         component={AccountScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// export default function RootNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {/* Tabs (shows bottom bar) */}
//       <Stack.Screen name="Tabs" component={Tabs} />
//       {/* Product detail (no bottom bar) */}
//       <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//     </Stack.Navigator>
//   );
// }

// // src/navigation/RootNavigator.tsx
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '@screens/HomeScreen';
// import CartScreen from '@screens/CartScreen';
// import AccountScreen from '@screens/AccountScreen';
// import LoginScreen from '@screens/LoginScreen';
// import RegisterScreen from '@screens/RegisterScreen';
// import ProductDetailScreen from '@screens/ProductDetailScreen';
// import { Ionicons } from '@expo/vector-icons';
// import { View, Text } from 'react-native';
// import { useAppSelector } from '@store/hooks';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// const CartIcon = ({ color, size }: { color: string; size: number }) => {
//   const count = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
//   return (
//     <View>
//       <Ionicons name="cart-outline" size={size} color={color} />
//       {count > 0 && (
//         <View
//           style={{
//             position: 'absolute',
//             right: -6,
//             top: -4,
//             minWidth: 16,
//             height: 12,
//             borderRadius: 12,
//             backgroundColor: '#8366CC',
//             alignItems: 'center',
//             justifyContent: 'center',
//             paddingHorizontal: 3,
//           }}
//         >
//           <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{count}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// function Tabs() {
//   const insets = useSafeAreaInsets();
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#8366CC',
//         tabBarStyle: { height: 48 + insets.bottom, paddingBottom: Math.max(12, insets.bottom), paddingTop: 4 },
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }}
//       />
//       <Tab.Screen
//         name="Cart"
//         component={CartScreen}
//         options={{ tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} /> }}
//       />
//       <Tab.Screen
//         name="Account"
//         component={AccountScreen}
//         options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Root stack decides: Auth flow vs App flow
// export default function RootNavigator() {
//   const { hydrated, isAuthenticated } = useAppSelector((s) => s.auth);

//   // While hydrating, you can render a splash or nothing
//   if (!hydrated) return null;

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isAuthenticated ? (
//         <>
//           <Stack.Screen name="Tabs" component={Tabs} />
//           <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
//         </>
//       ) : (
//         <>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// }

// src/navigation/RootNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "@/screens/home/HomeScreen";
import CategoryProductsScreen from "@/screens/home/CategoryProductsScreen";
import QuickAccessScreen from "@/screens/home/QuickAccessScreen";
import SearchResultsScreen from "@/screens/search/SearchResultsScreen";
import CartScreen from "@/screens/cart/CartScreen";
import AccountScreen from "@/screens/account/AccountScreen";
import ProductDetailScreen from "@/screens/product/ProductDetailScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import RegisterScreen from "@/screens/auth/RegisterScreen";

import AuthGate from "@components/AuthGate";
import { useAppSelector } from "@store/hooks";
import AddressesScreen from "@screens/address/AddressesScreen";
import AddAddressScreen from "@screens/address/AddAddressScreen";
import EditAddressScreen from "../screens/address/EditAddressScreen";
import CheckoutScreen from "../screens/checkout/CheckoutScreen";
import AllOrdersScreen from "@screens/orders/AllOrdersScreen";
import OrderDetailScreen from "@screens/orders/OrderDetailScreen";
import HelpSupportScreen from "@screens/help/HelpSupportScreen";
import AboutUsScreen from "@screens/about/AboutUsScreen";
import SummaryScreen from "@screens/checkout/SummaryScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CartIcon = ({ color, size }: { color: string; size: number }) => {
  const count = useAppSelector((s) =>
    s.cart.items.reduce((n, i) => n + i.qty, 0)
  );
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {count > 0 && (
        <View
          style={{
            position: "absolute",
            right: -6,
            top: -4,
            minWidth: 16,
            height: 12,
            borderRadius: 12,
            backgroundColor: "#8366CC",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            {count}
          </Text>
        </View>
      )}
    </View>
  );
};

function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8366CC",
        tabBarStyle: {
          height: 48 + insets.bottom+15,
          paddingBottom: Math.max(12, insets.bottom),
          paddingTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CartIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
      />
      <Stack.Screen name="QuickAccess" component={QuickAccessScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />

      <Stack.Screen name="AllOrders" component={AllOrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />

      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />

      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: "Sign Up" }}
      />
    </Stack.Navigator>
  );
}
