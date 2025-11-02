
// src/screens/AccountScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@theme/color';
import SafeScreen from '@components/SafeScreen';

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

type AccountResponse = {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
};

const DUMMY: AccountResponse = {
  name: 'Aryan Seth',
  email: 'iiitianaryan@gmail.com',
  phone: '+91 9795785251',
  addresses: [
    { id: 'a1', label: 'Home', line1: 'Hamam Darwaja Ajmeri', city: 'Jaunpur', state: 'UP', pincode: '222001', country: 'India', isDefault: true },
    { id: 'a2', label: 'Hostel', line1: 'IIIT Bhagalpur Campus', city: 'Bhagalpur', state: 'Bihar', pincode: '812007', country: 'India' },
  ],
};

const DUMMY_ORDERS = [
  { id: 'O-1024', date: '2025-10-12', total: '₹1,299', status: 'Delivered' },
  { id: 'O-1042', date: '2025-10-22', total: '₹899', status: 'In Transit' },
  { id: 'O-1051', date: '2025-11-01', total: '₹2,499', status: 'Processing' },
];

function FocusAwareStatusBar(props: React.ComponentProps<typeof StatusBar>) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

export default function AccountScreen() {
  const me = DUMMY;
  const defaultAddress = useMemo(() => me.addresses.find(a => a.isDefault) ?? me.addresses[0], [me.addresses]);

  const onEditProfile = () => Alert.alert('Edit Profile', 'Open edit profile screen');
  const onForgotPassword = () => Alert.alert('Forgot Password', 'Trigger password reset flow');
  const onLogout = () => Alert.alert('Logout', 'Implement your logout logic');

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
                    {me.name?.[0]?.toUpperCase() ?? 'U'}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: -0.2 }}>{me.name}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{me.email}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.9)' }}>{me.phone}</Text>
                </View>

                <Pressable onPress={onEditProfile} hitSlop={12}>
                  <Ionicons name="create-outline" size={22} color="#fff" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Body */}
        <View style={{ paddingHorizontal: 16, gap: 14, marginTop: 14 }}>
          <Section title="Addresses" icon="location-outline">
            {me.addresses.map(addr => (
              <Row
                key={addr.id}
                title={`${addr.label} ${addr.isDefault ? '• Default' : ''}`}
                subtitle={`${addr.line1}, ${addr.city}, ${addr.state} ${addr.pincode}`}
                right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
              />
            ))}
            <PrimaryGhostButton icon="add-outline" label="Add new address" onPress={() => Alert.alert('Add Address', 'Open add address flow')} style={{ marginTop: 6 }} />
          </Section>

          <Section title="Your Orders" icon="bag-handle-outline">
            {DUMMY_ORDERS.map(o => (
              <Row
                key={o.id}
                title={`${o.id} • ${o.status}`}
                subtitle={`Placed on ${o.date} • Total ${o.total}`}
                right={<Ionicons name="chevron-forward" size={18} color={colors.muted} />}
                onPress={() => Alert.alert('Order', `Open order ${o.id}`)}
              />
            ))}
            <PrimaryGhostButton icon="list-outline" label="See all orders" onPress={() => Alert.alert('Orders', 'Open orders screen')} style={{ marginTop: 6 }} />
          </Section>

          <Section title="Account" icon="person-circle-outline">
            <PrimaryButton icon="create-outline" label="Edit Profile" onPress={onEditProfile} />
            <PrimaryButton icon="key-outline" label="Forgot Password" onPress={onForgotPassword} style={{ marginTop: 10 }} />
            <DangerButton icon="log-out-outline" label="Logout" onPress={onLogout} style={{ marginTop: 10 }} />
          </Section>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

/* ---------- UI helpers (same as before) ---------- */
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

function PrimaryButton({ icon, label, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style?: any }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { backgroundColor: colors.tint, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={{ color: '#fff', fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

function PrimaryGhostButton({ icon, label, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style?: any }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { backgroundColor: '#fff', borderColor: colors.tint, borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6 },
        style,
      ]}
    >
      <Ionicons name={icon} size={16} color={colors.tint} />
      <Text style={{ color: colors.tint, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

function DangerButton({ icon, label, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style?: any }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { backgroundColor: '#fff5f5', borderColor: '#ffd6d6', borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color="#e11d48" />
      <Text style={{ color: '#e11d48', fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}
