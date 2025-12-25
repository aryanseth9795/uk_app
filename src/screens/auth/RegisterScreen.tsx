// src/screens/RegisterScreen.tsx
import React, { useMemo, useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { registerUser } from '@store/slices/authSlice';
import { colors } from '@theme/color';
import SafeScreen from '@components/SafeScreen';
import AppHeader from '@components/AppHeader';
import { useNavigation ,useRoute} from '@react-navigation/native';


function toErrorText(err: any): string {
  if (!err) return '';
  if (typeof err === 'string') return err;
  const data = err?.response?.data ?? err?.data ?? err;
  if (Array.isArray(data?.detail)) return data.detail.map((d: any) => d?.msg ?? '').join('\n');
  if (typeof data?.detail === 'string') return data.detail;
  if (data?.msg) return String(data.msg);
  if (err?.message) return String(err.message);
  try { return JSON.stringify(data); } catch { return String(data); }
}

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { status, error } = useAppSelector((s) => s.auth);
  const errorText = useMemo(() => toErrorText(error), [error]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onRegister = async () => {
    if (!name || !email || !phone || !password || !confirm) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', "Passwords don't match");
      return;
    }
    Keyboard.dismiss();

    const result = await dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirm_password: confirm,
      })
    );

    if ((registerUser as any).fulfilled.match(result)) {
      Alert.alert('Success', 'Account created. Please login.');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', toErrorText((result as any)?.payload) || 'Registration failed');
    }
  };
const { isAuthenticated } = useAppSelector((s) => s.auth);
// const navigation = useNavigation<any>();
const route = useRoute<any>();
const redirectTo: 'Account' | 'Home' | undefined = route.params?.redirectTo;

useEffect(() => {
  if (isAuthenticated) {
    navigation.replace('Tabs', { screen: redirectTo ?? 'Home' });
  }
}, [isAuthenticated, navigation, redirectTo]);
  
  return (
    <SafeScreen edges={[ 'left', 'right']}>
      <AppHeader title="UK Cosmetics & Gift Center" showSearch={false} />

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Fancy heading */}
            <View style={{ alignItems: 'center', marginBottom: 26, paddingTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.tint,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="person-add-outline" size={18} color="#fff" />
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '900',
                    letterSpacing: -0.3,
                    color: '#111827',
                  }}
                >
                  Create Account
                </Text>
              </View>
              <Text style={{ color: '#6B7280', marginTop: 6 }}>
                Join us — it only takes a minute
              </Text>
              <LinearGradient
                colors={[colors.headerStart, colors.headerEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 4, width: 160, borderRadius: 999, marginTop: 10 }}
              />
            </View>

            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                marginBottom: 14,
              }}
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                marginBottom: 14,
              }}
            />

            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                marginBottom: 14,
              }}
            />

            {/* Password */}
            <View
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingHorizontal: 14,
                marginBottom: 14,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ flex: 1, paddingVertical: 12 }}
              />
              <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={10}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
              </Pressable>
            </View>

            {/* Confirm Password */}
            <View
              style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                paddingHorizontal: 14,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TextInput
                placeholder="Confirm Password"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ flex: 1, paddingVertical: 12 }}
              />
              <Pressable onPress={() => setShowConfirm((s) => !s)} hitSlop={10}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
              </Pressable>
            </View>

            <Pressable
              onPress={onRegister}
              disabled={status === 'loading'}
              style={{
                backgroundColor: colors.tint,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 16,
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Create Account</Text>
              )}
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={{ textAlign: 'center' }}>
                Have an account? <Text style={{ color: colors.tint, fontWeight: '700' }}>Login instead</Text>
              </Text>
            </Pressable>

            {!!errorText && (
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorText}</Text>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
