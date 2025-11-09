
// // src/screens/AccountScreen.tsx
// import React, { useMemo } from 'react';
// import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { StatusBar } from 'expo-status-bar';
// import { useIsFocused } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { colors } from '@theme/color';
// import SafeScreen from '@components/SafeScreen';

// type Address = {
//   id: string;
//   label: string;
//   line1: string;
//   city: string;
//   state: string;
//   pincode: string;
//   country: string;
//   isDefault?: boolean;
// };

// type AccountResponse = {
//   name: string;
//   email: string;
//   phone: string;
//   addresses: Address[];
// };

// const DUMMY: AccountResponse = {
//   name: 'Aryan Seth',
//   email: 'iiitianaryan@gmail.com',
//   phone: '+91 9795785251',
//   addresses: [
//     { id: 'a1', label: 'Home', line1: 'Hamam Darwaja Ajmeri', city: 'Jaunpur', state: 'UP', pincode: '222001', country: 'India', isDefault: true },
//     { id: 'a2', label: 'Hostel', line1: 'IIIT Bhagalpur Campus', city: 'Bhagalpur', state: 'Bihar', pincode: '812007', country: 'India' },
//   ],
// };

// const DUMMY_ORDERS = [
//   { id: 'O-1024', date: '2025-10-12', total: '₹1,299', status: 'Delivered' },
//   { id: 'O-1042', date: '2025-10-22', total: '₹899', status: 'In Transit' },
//   { id: 'O-1051', date: '2025-11-01', total: '₹2,499', status: 'Processing' },
// ];

// function FocusAwareStatusBar(props: React.ComponentProps<typeof StatusBar>) {
//   const isFocused = useIsFocused();
//   return isFocused ? <StatusBar {...props} /> : null;
// }

// export default function AccountScreen() {
//   const me = DUMMY;
//   const defaultAddress = useMemo(() => me.addresses.find(a => a.isDefault) ?? me.addresses[0], [me.addresses]);

//   const onEditProfile = () => Alert.alert('Edit Profile', 'Open edit profile screen');
//   const onForgotPassword = () => Alert.alert('Forgot Password', 'Trigger password reset flow');
//   const onLogout = () => Alert.alert('Logout', 'Implement your logout logic');

//   return (
//     // IMPORTANT: do NOT consume the top inset here
//     <SafeScreen edges={['left', 'right']}>
//       {/* Draw content under status bar so gradient shows there */}
//       <FocusAwareStatusBar style="light" translucent backgroundColor="transparent" />

//       <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
//         {/* Header now owns the TOP safe area */}
//         <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//           <SafeAreaView edges={['top', 'left', 'right']}>
//             <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//                 {/* Avatar initial */}
//                 <View
//                   style={{
//                     width: 52,
//                     height: 52,
//                     borderRadius: 26,
//                     backgroundColor: 'rgba(255,255,255,0.18)',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     borderWidth: 1,
//                     borderColor: 'rgba(255,255,255,0.3)',
//                   }}
//                 >
//                   <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20 }}>
//                     {me.name?.[0]?.toUpperCase() ?? 'U'}
//                   </Text>
//                 </View>

//                 <View style={{ flex: 1 }}>
//                   <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.2 }}>{me.name}</Text>
//                   <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{me.email}</Text>
//                   <Text style={{ color: 'rgba(255,255,255,0.9)' }}>{me.phone}</Text>
//                 </View>

//                 <Pressable onPress={onEditProfile} hitSlop={12}>
//                   <Ionicons name="create-outline" size={22} color="#fff" />
//                 </Pressable>
//               </View>
//             </View>
//           </SafeAreaView>
//         </LinearGradient>

//         {/* Body */}
//         <View style={{ paddingHorizontal: 16, gap: 14, marginTop: 14 }}>
//           <Section title="Addresses" icon="location-outline">
//             {me.addresses.map(addr => (
//               <Row
//                 key={addr.id}
//                 title={`${addr.label} ${addr.isDefault ? '• Default' : ''}`}
//                 subtitle={`${addr.line1}, ${addr.city}, ${addr.state} ${addr.pincode}`}
//                 right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
//               />
//             ))}
//             <PrimaryGhostButton icon="add-outline" label="Add new address" onPress={() => Alert.alert('Add Address', 'Open add address flow')} style={{ marginTop: 6 }} />
//           </Section>

//           <Section title="Your Orders" icon="bag-handle-outline">
//             {DUMMY_ORDERS.map(o => (
//               <Row
//                 key={o.id}
//                 title={`${o.id} • ${o.status}`}
//                 subtitle={`Placed on ${o.date} • Total ${o.total}`}
//                 right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
//                 onPress={() => Alert.alert('Order', `Open order ${o.id}`)}
//               />
//             ))}
//             <PrimaryGhostButton icon="list-outline" label="See all orders" onPress={() => Alert.alert('Orders', 'Open orders screen')} style={{ marginTop: 6 }} />
//           </Section>

//           <Section title="Account" icon="person-circle-outline">
//             <PrimaryButton icon="create-outline" label="Edit Profile" onPress={onEditProfile} />
//             <PrimaryButton icon="key-outline" label="Forgot Password" onPress={onForgotPassword} style={{ marginTop: 10 }} />
//             <DangerButton icon="log-out-outline" label="Logout" onPress={onLogout} style={{ marginTop: 10 }} />
//           </Section>
//         </View>
//       </ScrollView>
//     </SafeScreen>
//   );
// }

// /* ---------- UI helpers (same as before) ---------- */
// function Section({
//   title,
//   icon,
//   children,
// }: {
//   title: string;
//   icon: keyof typeof Ionicons.glyphMap;
//   children: React.ReactNode;
// }) {
//   return (
//     <View
//       style={{
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         borderWidth: 1,
//         borderColor: '#eee',
//         padding: 12,
//         shadowColor: '#000',
//         shadowOpacity: 0.05,
//         shadowRadius: 10,
//         shadowOffset: { width: 0, height: 4 },
//         elevation: 2,
//       }}
//     >
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
//         <Ionicons name={icon} size={18} color={colors.tint} />
//         <Text style={{ fontWeight: '800', color: colors.text }}>{title}</Text>
//       </View>
//       <View style={{ gap: 6 }}>{children}</View>
//     </View>
//   );
// }

// function Row({
//   title,
//   subtitle,
//   right,
//   onPress,
// }: {
//   title: string;
//   subtitle?: string;
//   right?: React.ReactNode;
//   onPress?: () => void;
// }) {
//   const Content = (
//     <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
//       <View style={{ flex: 1 }}>
//         <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>
//           {title}
//         </Text>
//         {!!subtitle && (
//           <Text style={{ color: colors.muted, marginTop: 2 }} numberOfLines={2}>
//             {subtitle}
//           </Text>
//         )}
//       </View>
//       {right}
//     </View>
//   );
//   if (onPress) {
//     return (
//       <Pressable onPress={onPress} style={{ borderTopWidth: 1, borderTopColor: '#F1F1F1' }}>
//         {Content}
//       </Pressable>
//     );
//   }
//   return <View style={{ borderTopWidth: 1, borderTopColor: '#F1F1F1' }}>{Content}</View>;
// }

// function PrimaryButton({ icon, label, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style?: any }) {
//   return (
//     <Pressable
//       onPress={onPress}
//       style={[
//         { backgroundColor: colors.tint, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
//         style,
//       ]}
//     >
//       <Ionicons name={icon} size={18} color="#fff" />
//       <Text style={{ color: '#fff', fontWeight: '800' }}>{label}</Text>
//     </Pressable>
//   );
// }

// function PrimaryGhostButton({ icon, label, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style?: any }) {
//   return (
//     <Pressable
//       onPress={onPress}
//       style={[
//         { backgroundColor: '#fff', borderColor: colors.tint, borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6 },
//         style,
//       ]}
//     >
//       <Ionicons name={icon} size={16} color={colors.tint} />
//       <Text style={{ color: colors.tint, fontWeight: '700' }}>{label}</Text>
//     </Pressable>
//   );
// }

// function DangerButton({ icon, label, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style?: any }) {
//   return (
//     <Pressable
//       onPress={onPress}
//       style={[
//         { backgroundColor: '#fff5f5', borderColor: '#ffd6d6', borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
//         style,
//       ]}
//     >
//       <Ionicons name={icon} size={18} color="#e11d48" />
//       <Text style={{ color: '#e11d48', fontWeight: '800' }}>{label}</Text>
//     </Pressable>
//   );
// }



// import React from 'react';
// import { View, Text, Pressable } from 'react-native';
// import { useAppSelector, useAppDispatch } from '@store/hooks';
// import { logoutUser } from '@store/slices/authSlice';
// import { colors } from '@theme/color';
// import AppHeader from '@components/AppHeader';
// import SafeScreen from '@components/SafeScreen';
// import { useNavigation } from '@react-navigation/native';


// type User =   {
//   name: string;
//   email: string;
//   phone: string[];
//   address: string[];
//   id: string;

// }
// export default function AccountScreen() {
//   const { user } = useAppSelector((s) => s.auth);
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<any>();

//   if (!user.id) {
//     return (
//       <SafeScreen edges={['left', 'right']}>
//         <AppHeader title="Account" showSearch={false} />
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//           <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
//             You must be logged in to access your account.
//           </Text>
//           <Pressable
//             onPress={() => navigation.navigate('Login')}
//             style={{
//               backgroundColor: colors.tint,
//               paddingHorizontal: 24,
//               paddingVertical: 10,
//               borderRadius: 12,
//             }}
//           >
//             <Text style={{ color: '#fff', fontWeight: '700' }}>Login Now</Text>
//           </Pressable>
//         </View>
//       </SafeScreen>
//     );
//   }

//   return (
//     <SafeScreen edges={['left', 'right']}>
//       <AppHeader title="My Account" showSearch={false} />
//       <View style={{ flex: 1, padding: 20 }}>
//         <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>{user.name}</Text>
//         <Text style={{ color: '#6B7280' }}>{user?.email}</Text>
//         <Text style={{ color: '#6B7280', marginBottom: 20 }}>{user.phone}</Text>

//         <Pressable
//           onPress={() => dispatch(logoutUser())}
//           style={{
//             backgroundColor: colors.tint,
//             paddingVertical: 12,
//             borderRadius: 10,
//             alignItems: 'center',
//           }}
//         >
//           <Text style={{ color: '#fff', fontWeight: '800' }}>Logout</Text>
//         </Pressable>
//       </View>
//     </SafeScreen>
//   );
// }


// import React from 'react';
// import { View, Text, Pressable } from 'react-native';
// import { useAppSelector, useAppDispatch } from '@store/hooks';
// import { logoutUser } from '@store/slices/authSlice';
// import { colors } from '@theme/color';
// import AppHeader from '@components/AppHeader';
// import SafeScreen from '@components/SafeScreen';
// import { useNavigation } from '@react-navigation/native';

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address?: string[];
// };

// export default function AccountScreen() {
//   const { user } = useAppSelector((s) => s.auth);
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<any>();

//   // user can be null → check safely
//   if (!user || !user.id) {
//     return (
//       <SafeScreen edges={['left', 'right']}>
//         <AppHeader title="Account" showSearch={false} />
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//           <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
//             You must be logged in to access your account.
//           </Text>
//           <Pressable
//             onPress={() => navigation.navigate('Login')}
//             style={{
//               backgroundColor: colors.tint,
//               paddingHorizontal: 24,
//               paddingVertical: 10,
//               borderRadius: 12,
//             }}
//           >
//             <Text style={{ color: '#fff', fontWeight: '700' }}>Login Now</Text>
//           </Pressable>
//         </View>
//       </SafeScreen>
//     );
//   }
//   console.log('User info:', user);

//   // Once logged in, render user info
//   return (
//     <SafeScreen edges={['left', 'right']}>
//       <AppHeader title="My Account" showSearch={false} />
//       <View style={{ flex: 1, padding: 20 }}>
//         <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>{user.name}</Text>
//         {!!user.email && <Text style={{ color: '#6B7280' }}>{user.email}</Text>}
//         {!!user.phone && <Text style={{ color: '#6B7280', marginBottom: 20 }}>{user.phone}</Text>}

//         <Pressable
//           onPress={() => dispatch(logoutUser())}
//           style={{
//             backgroundColor: colors.tint,
//             paddingVertical: 12,
//             borderRadius: 10,
//             alignItems: 'center',
//           }}
//         >
//           <Text style={{ color: '#fff', fontWeight: '800' }}>Logout</Text>
//         </Pressable>
//       </View>
//     </SafeScreen>
//   );
// }


// // src/screens/AccountScreen.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, Pressable, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import SafeScreen from '@components/SafeScreen';
// import AppHeader from '@components/AppHeader';
// import { colors } from '@theme/color';

// import { useAppDispatch, useAppSelector } from '@store/hooks';
// import { setUser, logout } from '@store/slices/authSlice';
// import { apiMe } from '@services/api';

// export default function AccountScreen() {
//   const dispatch = useAppDispatch();
//   const { user, isAuthenticated } = useAppSelector((s) => s.auth);
//   const [loading, setLoading] = useState(false);

//   // Fetch profile if missing (token is assumed valid thanks to AuthGate)
//   useEffect(() => {
//     let alive = true;
//     const fetchMe = async () => {
//       if (!isAuthenticated) return;
//       if (user?.id) return; // already have user
//       try {
//         setLoading(true);
//         const data = await apiMe(); // shape: { id,name,email,phone,... }
//         if (!alive) return;
//         dispatch(setUser(data));
//       } catch (e) {
//         // optional: toast/log
//       } finally {
//         if (alive) setLoading(false);
//       }
//     };
//     fetchMe();
//     return () => {
//       alive = false;
//     };
//   }, [dispatch, isAuthenticated, user?.id]);

//   return (
//     <SafeScreen edges={[ 'left', 'right']}>
//       <AppHeader title="My Account" showSearch={false} />

//       {loading && !user?.id ? (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//           <ActivityIndicator />
//         </View>
//       ) : (
//         <View style={{ flex: 1, padding: 20 }}>
//           {/* Profile card */}
//           <View
//             style={{
//               backgroundColor: '#fff',
//               borderRadius: 16,
//               borderWidth: 1,
//               borderColor: '#EEE',
//               padding: 16,
//               gap: 8,
//               shadowColor: '#000',
//               shadowOpacity: 0.06,
//               shadowRadius: 8,
//               shadowOffset: { width: 0, height: 3 },
//               elevation: 2,
//             }}
//           >
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//               <View
//                 style={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 24,
//                   backgroundColor: colors.tint,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>
//                   {(user?.name?.[0] ?? 'U').toUpperCase()}
//                 </Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={{ fontSize: 18, fontWeight: '800' }}>{user?.name ?? 'User'}</Text>
//                 {!!user?.email && (
//                   <Text style={{ color: '#6B7280' }} numberOfLines={1}>
//                     {user.email}
//                   </Text>
//                 )}
//                 {!!user?.phone && (
//                   <Text style={{ color: '#6B7280' }} numberOfLines={1}>
//                     {user.phone}
//                   </Text>
//                 )}
//               </View>
//             </View>
//           </View>

//           {/* Quick actions */}
//           <View style={{ marginTop: 16, gap: 10 }}>
//             <Row
//               icon="bag-handle-outline"
//               label="Your Orders"
//               onPress={() => {
//                 // TODO: navigate to Orders screen
//               }}
//             />
//             <Row
//               icon="location-outline"
//               label="Addresses"
//               onPress={() => {
//                 // TODO: navigate to Address book
//               }}
//             />
//             <Row
//               icon="create-outline"
//               label="Edit Profile"
//               onPress={() => {
//                 // TODO: navigate to Edit Profile
//               }}
//             />
//           </View>

//           {/* Danger area */}
//           <Pressable
//             onPress={() => dispatch(logout())}
//             style={{
//               marginTop: 24,
//               backgroundColor: '#fff5f5',
//               borderColor: '#ffd6d6',
//               borderWidth: 1,
//               borderRadius: 12,
//               paddingVertical: 12,
//               alignItems: 'center',
//               flexDirection: 'row',
//               justifyContent: 'center',
//               gap: 8,
//             }}
//           >
//             <Ionicons name="log-out-outline" size={18} color="#e11d48" />
//             <Text style={{ color: '#e11d48', fontWeight: '800' }}>Logout</Text>
//           </Pressable>
//         </View>
//       )}
//     </SafeScreen>
//   );
// }

// /* ---------- tiny UI helper ---------- */
// function Row({
//   icon,
//   label,
//   onPress,
// }: {
//   icon: keyof typeof Ionicons.glyphMap;
//   label: string;
//   onPress: () => void;
// }) {
//   return (
//     <Pressable
//       onPress={onPress}
//       style={{
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#EEE',
//         paddingVertical: 14,
//         paddingHorizontal: 14,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//       }}
//     >
//       <Ionicons name={icon} size={18} color={colors.tint} />
//       <Text style={{ fontWeight: '700', color: '#111827' }}>{label}</Text>
//     </Pressable>
//   );
// }
// src/screens/AccountScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@theme/color';
import SafeScreen from '@components/SafeScreen';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setUser, logout } from '@store/slices/authSlice';
import { apiMe } from '@services/api';
import { http } from '@services/http';

type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
};

type OrderLite = {
  id: string;
  date: string;     // ISO or yyyy-mm-dd
  total: string;    // e.g. "₹1,299"
  status: string;   // e.g. "Delivered"
};

function FocusAwareStatusBar(props: React.ComponentProps<typeof StatusBar>) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

export default function AccountScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const [loadingMe, setLoadingMe] = useState(false);
  const [loadingAddr, setLoadingAddr] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<OrderLite[]>([]);

  // --- Load profile (name/email/phone & maybe addresses) ---
  useEffect(() => {
    let alive = true;
    const loadMe = async () => {
      if (!isAuthenticated) return;
      try {
        setLoadingMe(true);
        const data = await apiMe(); // shape from your API
        if (!alive) return;
        dispatch(setUser(data));

        // try to pull addresses from /me if present
        const fromMe = Array.isArray((data as any)?.addresses) ? (data as any).addresses : null;
        if (fromMe && fromMe.length) {
          setAddresses(fromMe as Address[]);
        } else {
          // otherwise fetch addresses separately
          setLoadingAddr(true);
          try {
            const resp = await http.get('/user/addresses');
            const arr = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp?.data?.items) ? resp.data.items : [];
            setAddresses(arr as Address[]);
          } catch {
            // ignore; leave empty
          } finally {
            setLoadingAddr(false);
          }
        }
      } catch (e: any) {
        // optional: Alert.alert('Profile', toError(e));
      } finally {
        if (alive) setLoadingMe(false);
      }
    };
    loadMe();
    return () => {
      alive = false;
    };
  }, [dispatch, isAuthenticated]);

  // --- Load last 3 orders ---
  useEffect(() => {
    let alive = true;
    const loadOrders = async () => {
      if (!isAuthenticated) return;
      try {
        setLoadingOrders(true);
        // try `/orders/my?limit=3`, fallback to `/orders?limit=3`
        let data: any = null;
        try {
          const r1 = await http.get('/orders/my', { params: { limit: 3 } });
          data = r1.data;
        } catch {
          const r2 = await http.get('/orders', { params: { limit: 3 } });
          data = r2.data;
        }

        if (!alive) return;
        const raw = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.items) ? data.items : [];
        // normalize a bit
        const mapped: OrderLite[] = raw.slice(0, 3).map((o: any) => ({
          id: String(o?.id ?? o?.order_id ?? o?.code ?? ''),
          date: String(o?.date ?? o?.created_at ?? '').slice(0, 10),
          total: String(o?.total_inr ?? o?.total ?? ''),
          status: String(o?.status ?? ''),
        }));
        setOrders(mapped);
      } catch {
        setOrders([]);
      } finally {
        if (alive) setLoadingOrders(false);
      }
    };
    loadOrders();
    return () => {
      alive = false;
    };
  }, [isAuthenticated]);

  // --- Addresses: default first, then others, max 2 shown ---
  const topAddresses = useMemo(() => {
    const arr = Array.isArray(addresses) ? addresses.slice() : [];
    arr.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)); // default first
    // Actually we want default first → inverse sort
    arr.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
    return arr.slice(0, 2);
  }, [addresses]);

  const headerName = user?.name ?? 'User';
  const headerEmail = user?.email ?? '';
  const headerPhone = user?.phone ?? '';

  const onLogout = () => {
    dispatch(logout());
    // AuthGate will redirect to Login; optionally send user immediately:
    navigation.replace('Login', { redirectTo: 'Account' });
  };

  return (
    // IMPORTANT: do NOT consume the top inset here
    <SafeScreen edges={['left', 'right']}>
      {/* Draw content under status bar so gradient shows there */}
      <FocusAwareStatusBar style="light" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header now owns the TOP safe area */}
        <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <SafeAreaView edges={['top', 'left', 'right']}>
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {/* Avatar initial */}
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20 }}>
                    {(headerName?.[0] ?? 'U').toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.2 }}>
                    {headerName}
                  </Text>
                  {!!headerEmail && <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{headerEmail}</Text>}
                  {!!headerPhone && <Text style={{ color: 'rgba(255,255,255,0.9)' }}>{headerPhone}</Text>}
                </View>

                <Pressable onPress={() => navigation.navigate('EditProfile')} hitSlop={12}>
                  <Ionicons name="create-outline" size={22} color="#fff" />
                </Pressable>
              </View>

              {(loadingMe || loadingAddr) && (
                <View style={{ marginTop: 12 }}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Body */}
        <View style={{ paddingHorizontal: 16, gap: 14, marginTop: 14 }}>
          {/* Addresses */}
          <Section title="Addresses" icon="location-outline">
            {topAddresses.length > 0 ? (
              <>
                {topAddresses.map((addr) => (
                  <Row
                    key={addr.id}
                    title={`${addr.label}${addr.isDefault ? ' • Default' : ''}`}
                    subtitle={`${addr.line1}, ${addr.city}, ${addr.state} ${addr.pincode}`}
                    right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
                    onPress={() => navigation.navigate('Addresses')}
                  />
                ))}

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  <PrimaryGhostButton
                    icon="list-outline"
                    label="See all addresses"
                    onPress={() => navigation.navigate('Addresses')}
                  />
                  <PrimaryGhostButton
                    icon="add-outline"
                    label="Add new address"
                    onPress={() => navigation.navigate('AddAddress')}
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={{ color: colors.muted, paddingVertical: 8 }}>No addresses added yet.</Text>
                <PrimaryGhostButton
                  icon="add-outline"
                  label="Add new address"
                  onPress={() => navigation.navigate('AddAddress')}
                  style={{ marginTop: 6 }}
                />
              </>
            )}
          </Section>

          {/* Orders */}
          <Section title="Your Orders" icon="bag-handle-outline">
            {loadingOrders && orders.length === 0 ? (
              <View style={{ paddingVertical: 10 }}>
                {/* {console.log(orders)} */}
                <Text style={{ color: colors.tintLight, paddingVertical: 8 }}>No orders placed yet.</Text>
                <ActivityIndicator />
              </View>
            ) : (
              <>
                {orders.slice(0, 3).map((o) => (
                  <Row
                    key={o.id}
                    title={`${o.id} • ${o.status}`}
                    subtitle={`Placed on ${o.date}${o.total ? ` • Total ${o.total}` : ''}`}
                    right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
                    onPress={() => navigation.navigate('Orders', { orderId: o.id })}
                  />
                ))}
                {orders.length === 0 && !loadingOrders && (
                  <Text style={{ color: colors.muted, paddingVertical: 8 }}>No orders placed yet.</Text>
                ) }
                <PrimaryGhostButton
                  icon="list-outline"
                  label="See all orders"
                  onPress={() => navigation.navigate('Orders')}
                  style={{ marginTop: 6 }}
                />
              </>
            )}
          </Section>

          {/* Help & About */}
          <Section title="Help & Info" icon="help-circle-outline">
            <Row
              title="Help & Support"
              right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
              onPress={() => navigation.navigate('Help')}
            />
            <Row
              title="About Us"
              right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
              onPress={() => navigation.navigate('About')}
            />
          </Section>

          {/* Logout */}
          <DangerButton
            icon="log-out-outline"
            label="Logout"
            onPress={onLogout}
            style={{ marginTop: 6 }}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

/* ---------- UI helpers (unchanged style/theme) ---------- */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <Ionicons name={icon} size={18} color={colors.tint} />
        <Text style={{ fontWeight: '800', color: colors.text }}>{title}</Text>
      </View>
      <View style={{ gap: 6 }}>{children}</View>
    </View>
  );
}

function Row({
  title,
  subtitle,
  right,
  onPress,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  const Content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={{ color: colors.muted, marginTop: 2 }} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ borderTopWidth: 1, borderTopColor: '#F1F1F1' }}>
        {Content}
      </Pressable>
    );
  }
  return <View style={{ borderTopWidth: 1, borderTopColor: '#F1F1F1' }}>{Content}</View>;
}

function PrimaryButton({
  icon,
  label,
  onPress,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.tint,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={{ color: '#fff', fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

function PrimaryGhostButton({
  icon,
  label,
  onPress,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: '#fff',
          borderColor: colors.tint,
          borderWidth: 1,
          borderRadius: 999,
          paddingVertical: 8,
          paddingHorizontal: 12,
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={16} color={colors.tint} />
      <Text style={{ color: colors.tint, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

function DangerButton({
  icon,
  label,
  onPress,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: '#fff5f5',
          borderColor: '#ffd6d6',
          borderWidth: 1,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color="#e11d48" />
      <Text style={{ color: '#e11d48', fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}
