// src/screen/help/HelpSupportScreen.tsx
import React from 'react';
import { View, Text, Pressable, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '@components/SafeScreen';
import AppHeader from '@components/AppHeader';
import { colors } from '@theme/color';

const CONTACT_PERSON = 'Ujjwal Seth';
const STORE_NAME = 'UK Cosmetics & Gift Center';
const ADDRESS =
  'Shakarmandi, Near Mohammad Hasan PG College, in front of petrol pump, Jaunpur, 222001';
const PHONE = '+91 9696174586';     // dummy number
const WHATSAPP = '+91 9696174586';  // dummy number (can be same as phone)

export default function HelpSupportScreen() {
  const onCall = async () => {
    const url = `tel:${PHONE.replace(/\s/g, '')}`;
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) Linking.openURL(url);
      else Alert.alert('Call', 'Your device cannot make phone calls.');
    } catch {
      Alert.alert('Call', 'Unable to start a call.');
    }
  };

  const onWhatsApp = async () => {
    const phoneIntl = WHATSAPP.replace(/[^\d+]/g, ''); // keep + and digits
    const msg = encodeURIComponent('Hello, I have a query/complaint regarding my order.');
    const deepLink = `whatsapp://send?phone=${phoneIntl}&text=${msg}`;
    const webLink = `https://wa.me/${phoneIntl.replace('+', '')}?text=${msg}`;
    try {
      const ok = await Linking.canOpenURL(deepLink);
      if (ok) Linking.openURL(deepLink);
      else Linking.openURL(webLink);
    } catch {
      Alert.alert('WhatsApp', 'Unable to open WhatsApp.');
    }
  };

  const onOpenMaps = async () => {
    const q = encodeURIComponent(ADDRESS);
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?q=${q}`,
        android: `https://www.google.com/maps/search/?api=1&query=${q}`,
        default: `https://www.google.com/maps/search/?api=1&query=${q}`,
      }) || `https://www.google.com/maps/search/?api=1&query=${q}`;
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) Linking.openURL(url);
      else Alert.alert('Maps', 'No maps app found on this device.');
    } catch {
      Alert.alert('Maps', 'Unable to open maps.');
    }
  };

  return (
    <SafeScreen edges={[ 'left', 'right']}>
      <AppHeader title="Help & Support" showSearch={false} />

      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        {/* Complaint Intro */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#eee',
            padding: 14,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>
            Have a complaint?
          </Text>
          <Text style={{ color: '#6B7280' }}>
            We’re here to help. Use the contact options below to reach us quickly.
          </Text>
        </View>

        {/* Store / Contact Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#eee',
            padding: 14,
            gap: 10,
          }}
        >
          <InfoRow icon="person-circle-outline" label="Contact Person" value={CONTACT_PERSON} />
          <InfoRow icon="business-outline" label="Store" value={STORE_NAME} />
          <InfoRow icon="location-outline" label="Address" value={ADDRESS} />
          <InfoRow icon="call-outline" label="Phone" value={PHONE} />
          <InfoRow icon="logo-whatsapp" label="WhatsApp" value={WHATSAPP} />

          {/* Actions */}
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginTop: 8,
              justifyContent: 'space-between',
            }}
          >
            <PrimaryButton icon="call-outline" label="Call" onPress={onCall} style={{ flex: 1 }} />
            <PrimaryButton icon="logo-whatsapp" label="WhatsApp" onPress={onWhatsApp} style={{ flex: 1 }} />
            <GhostButton icon="map-outline" label="Map" onPress={onOpenMaps} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}

/* ---------- tiny UI helpers ---------- */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Ionicons name={icon} size={18} color={colors.tint} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#6B7280', fontWeight: '700' }}>{label}</Text>
        <Text style={{ color: colors.text, marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );
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
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={{ color: '#fff', fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

function GhostButton({
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
          borderWidth: 1,
          borderColor: colors.tint,
          borderRadius: 12,
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.tint} />
      <Text style={{ color: colors.tint, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}
