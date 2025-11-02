import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/HomeScreen';
import CartScreen from '@screens/CartScreen';
import AccountScreen from '@screens/AccountScreen';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useAppSelector } from '@store/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const CartIcon = ({ color, size }: { color: string; size: number }) => {
  const count = useAppSelector(s => s.cart.items.reduce((n, i) => n + i.qty, 0));
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {count > 0 && (
        <View
          style={{
            position: 'absolute', right: -6, top: -4,
            minWidth: 16, height: 12, borderRadius: 12,
            backgroundColor: '#8366CC',
            alignItems: 'center', justifyContent: 'center',
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{count}</Text>
        </View>
      )}
    </View>
  );
};

export default function RootTabs() {
    const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8366CC',
        tabBarStyle: { height: 48 + insets.bottom, paddingBottom: Math.max(12, insets.bottom), paddingTop: 4 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
