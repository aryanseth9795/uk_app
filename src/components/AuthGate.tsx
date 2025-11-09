// src/components/AuthGate.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@store/hooks';

type Props = {
  children: React.ReactNode;
  redirectTo?: 'Account' | 'Home';
};

export default function AuthGate({ children, redirectTo = 'Account' }: Props) {
  const { hydrated, isAuthenticated } = useAppSelector((s) => s.auth);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      navigation.replace('Login', { redirectTo });
    }
  }, [hydrated, isAuthenticated, navigation, redirectTo]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) return null; // will be replaced by Login

  return <>{children}</>;
}
