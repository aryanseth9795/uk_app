// // src/screens/LoginScreen.tsx
// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAppDispatch, useAppSelector } from '@store/hooks';
// import { loginUser } from '@store/slices/authSlice';
// import { colors } from '@theme/color';
// import SafeScreen from '@components/SafeScreen';
// import AppHeader from '@components/AppHeader';
// import { useNavigation } from '@react-navigation/native';

// function toErrorText(err: any): string {
//   if (!err) return '';
//   if (typeof err === 'string') return err;
//   const data = err?.response?.data ?? err?.data ?? err;
//   if (Array.isArray(data?.detail)) return data.detail.map((d: any) => d?.msg ?? '').join('\n');
//   if (typeof data?.detail === 'string') return data.detail;
//   if (data?.msg) return String(data.msg);
//   if (err?.message) return String(err.message);
//   try { return JSON.stringify(data); } catch { return String(data); }
// }

// export default function LoginScreen() {
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<any>();
//   const { status, error } = useAppSelector((s) => s.auth);
//   const errorText = useMemo(() => toErrorText(error), [error]);

//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPass, setShowPass] = useState(false);

//   const onLogin = async () => {
//     if (!emailOrPhone || !password) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }
//     Keyboard.dismiss();
//     const result = await dispatch(loginUser({ email: emailOrPhone, password }));
//     if (loginUser.fulfilled.match(result)) {
//       Alert.alert('Welcome', 'Login successful!');
//       navigation.navigate('Tabs', { screen: 'Home' });
//     } else {
//       Alert.alert('Error', toErrorText((result as any)?.payload) || 'Login failed');
//     }
//   };

//   return (
//     <SafeScreen edges={[ 'left', 'right']}>
//       <AppHeader title="UK Cosmetics & Gift Center" showSearch={false} />

//       <KeyboardAvoidingView
//         behavior={Platform.select({ ios: 'padding', android: 'height' })}
//         style={{ flex: 1 }}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView
//             contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}
//             keyboardShouldPersistTaps="handled"
//           >
//             {/* Fancy heading */}
//             <View style={{ alignItems: 'center', marginBottom: 26, paddingTop: 8 }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                 <View
//                   style={{
//                     width: 36,
//                     height: 36,
//                     borderRadius: 18,
//                     backgroundColor: colors.tint,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   <Ionicons name="lock-closed-outline" size={18} color="#fff" />
//                 </View>
//                 <Text
//                   style={{
//                     fontSize: 28,
//                     fontWeight: '900',
//                     letterSpacing: -0.3,
//                     color: '#111827',
//                   }}
//                 >
//                   Login
//                 </Text>
//               </View>
//               <Text style={{ color: '#6B7280', marginTop: 6 }}>
//                 Welcome back — sign in to continue
//               </Text>
//               <LinearGradient
//                 colors={[colors.headerStart, colors.headerEnd]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={{ height: 4, width: 120, borderRadius: 999, marginTop: 10 }}
//               />
//             </View>

//             {/* Email / Phone */}
//             <TextInput
//               placeholder="Email or Phone"
//               value={emailOrPhone}
//               onChangeText={setEmailOrPhone}
//               autoCapitalize="none"
//               autoCorrect={false}
//               keyboardType="email-address"
//               style={{
//                 backgroundColor: '#fff',
//                 borderWidth: 1,
//                 borderColor: '#ddd',
//                 borderRadius: 12,
//                 paddingHorizontal: 14,
//                 paddingVertical: 12,
//                 marginBottom: 14,
//               }}
//             />

//             {/* Password with eye */}
//             <View
//               style={{
//                 backgroundColor: '#fff',
//                 borderWidth: 1,
//                 borderColor: '#ddd',
//                 borderRadius: 12,
//                 paddingHorizontal: 14,
//                 marginBottom: 16,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//               }}
//             >
//               <TextInput
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPass}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 style={{ flex: 1, paddingVertical: 12 }}
//               />
//               <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={10}>
//                 <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#666" />
//               </Pressable>
//             </View>

//             <Pressable
//               onPress={onLogin}
//               disabled={status === 'loading'}
//               style={{
//                 backgroundColor: colors.tint,
//                 borderRadius: 12,
//                 paddingVertical: 12,
//                 alignItems: 'center',
//                 marginBottom: 16,
//                 opacity: status === 'loading' ? 0.7 : 1,
//               }}
//             >
//               {status === 'loading' ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Login</Text>
//               )}
//             </Pressable>

//             <Pressable onPress={() => Alert.alert('Reset Password', 'Password reset flow')}>
//               <Text style={{ color: colors.tint, textAlign: 'center', marginBottom: 12 }}>
//                 Forgot Password?
//               </Text>
//             </Pressable>

//             <Pressable onPress={() => navigation.navigate('Register')}>
//               <Text style={{ textAlign: 'center' }}>
//                 New user? <Text style={{ color: colors.tint, fontWeight: '700' }}>Register here</Text>
//               </Text>
//             </Pressable>

//             {!!errorText && (
//               <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorText}</Text>
//             )}
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeScreen>
//   );
// }


// src/screens/LoginScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { loginUser } from '@store/slices/authSlice';
import { colors } from '@theme/color';
import SafeScreen from '@components/SafeScreen';
import AppHeader from '@components/AppHeader';

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

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const redirectTo: 'Account' | 'Home' | undefined = route.params?.redirectTo;

  const { status, error, isAuthenticated } = useAppSelector((s) => s.auth);
  const errorText = useMemo(() => toErrorText(error), [error]);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // If already authed, don't allow viewing login
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Tabs', { screen: redirectTo ?? 'Home' });
    }
  }, [isAuthenticated, navigation, redirectTo]);

  const onLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    Keyboard.dismiss();
    const result = await dispatch(loginUser({ email: emailOrPhone, password }));
    if (loginUser.fulfilled.match(result)) {
      Alert.alert('Welcome', 'Login successful!');
      // navigation.replace('Tabs', { screen: redirectTo ?? 'Home' });
      navigation.replace('Tabs', { screen: route.params?.redirectTo ?? 'Home' });
    } else {
      Alert.alert('Error', toErrorText((result as any)?.payload) || 'Login failed');
    }
  };

  return (
    <SafeScreen edges={[ 'left', 'right']}>
      <AppHeader title="UK Cosmetics & Gift Center" showSearch={false} />

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: 'height' })} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
            {/* Fancy heading */}
            <View style={{ alignItems: 'center', marginBottom: 26, paddingTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="lock-closed-outline" size={18} color="#fff" />
                </View>
                <Text style={{ fontSize: 28, fontWeight: '900', letterSpacing: -0.3, color: '#111827' }}>Login</Text>
              </View>
              <Text style={{ color: '#6B7280', marginTop: 6 }}>Welcome back — sign in to continue</Text>
              <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 4, width: 120, borderRadius: 999, marginTop: 10 }} />
            </View>

            <TextInput
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14 }}
            />

            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
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

            <Pressable onPress={onLogin} disabled={status === 'loading'} style={{ backgroundColor: colors.tint, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 16, opacity: status === 'loading' ? 0.7 : 1 }}>
              {status === 'loading' ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Login</Text>}
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={{ textAlign: 'center' }}>
                New user? <Text style={{ color: colors.tint, fontWeight: '700' }}>Register here</Text>
              </Text>
            </Pressable>

            {!!errorText && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorText}</Text>}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
