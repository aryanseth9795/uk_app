// src/screen/about/AboutUsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Linking,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Rect, Path, Circle, Defs, LinearGradient as SvgLinear, Stop } from 'react-native-svg';

import SafeScreen from '@components/SafeScreen';
import AppHeader from '@components/AppHeader';
import { colors } from '@theme/color';

const STORE_NAME = 'UK Cosmetics & Gift Center';
const OWNER_NAME = 'Ujjwal Seth';
const DEV_NAME = 'Aryan Seth (SDE, IIIT-BH )';
const DEV_EMAIL = 'iiitianaryan@gmail.com';
const ADDRESS =
  'Shakarmandi, Near Mohammad Hasan PG College, in front of petrol pump, Jaunpur, 222001';
const PHONE = '+91  9696174586';     // dummy
const WHATSAPP = '+91  9696174586';  // dummy
const APP_VERSION = '1.0.0';

export default function AboutUsScreen() {
  const [expanded, setExpanded] = useState(false);

  const onEmailDev = async () => {
    const url = `mailto:${DEV_EMAIL}?subject=${encodeURIComponent(`Feedback for ${STORE_NAME}`)}`;
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) Linking.openURL(url);
      else Alert.alert('Email', 'No mail app found.');
    } catch {
      Alert.alert('Email', 'Unable to open email app.');
    }
  };

  const onCall = async () => {
    const url = `tel:${PHONE.replace(/\s/g, '')}`;
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) Linking.openURL(url);
      else Alert.alert('Call', 'Your device cannot place calls.');
    } catch {
      Alert.alert('Call', 'Unable to start a call.');
    }
  };

  const onWhatsApp = async () => {
    const phoneIntl = WHATSAPP.replace(/[^\d+]/g, '');
    const msg = encodeURIComponent('Hello, I have a query about UK Cosmetics & Gift Center.');
    const deep = `whatsapp://send?phone=${phoneIntl}&text=${msg}`;
    const web = `https://wa.me/${phoneIntl.replace('+', '')}?text=${msg}`;
    try {
      const ok = await Linking.canOpenURL(deep);
      if (ok) Linking.openURL(deep);
      else Linking.openURL(web);
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
      else Alert.alert('Maps', 'No maps app found.');
    } catch {
      Alert.alert('Maps', 'Unable to open maps.');
    }
  };

  return (
    <SafeScreen edges={[ 'left', 'right']}>
      <AppHeader title="About Us" showSearch={false} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* Hero + SVG */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#eee',
            padding: 14,
            overflow: 'hidden',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: 'rgba(131,102,204,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.tint,
              }}
            >
              <Ionicons name="sparkles-outline" color={colors.tint} size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: colors.text }}>
                {STORE_NAME}
              </Text>
              <Text style={{ color: '#6B7280', marginTop: 2 }}>
                Beauty • Cosmetics • Gifts — curated with care
              </Text>
            </View>
          </View>

          <View style={{ height: 140, marginTop: 12 }}>
            <BeautyAndGiftSVG />
          </View>

          <Pressable onPress={() => setExpanded((s) => !s)} style={{ marginTop: 10 }}>
            <Text style={{ color: '#6B7280', lineHeight: 20 }}>
              {expanded
                ? 'We’re a modern neighborhood store in Jaunpur offering cosmetics, skincare, fragrances, stationery and gift items. Our focus is a delightful selection, fair pricing, and fast service. With this app, we’re building a simple and fast shopping experience tailored to local needs.'
                : 'We’re a modern neighborhood store in Jaunpur offering cosmetics, skincare, fragrances, stationery and gift items… '}
              <Text style={{ color: colors.tint, fontWeight: '800' }}>
                {expanded ? 'Show less' : 'Read more'}
              </Text>
            </Text>
          </Pressable>
        </View>

        {/* Owner & Developer cards — NOW STACKED VERTICALLY */}
        <View style={{ gap: 12, marginTop: 12 }}>
          <InfoCard
            title="Owner"
            subtitle={OWNER_NAME}
            icon="person-circle-outline"
            accent="#10B981"
          />
          <InfoCard
            title="App Developer"
            subtitle={DEV_NAME}
            icon="code-slash-outline"
            accent={colors.tint}
            footerAction={{
              label: 'Contact',
              onPress: onEmailDev,
              icon: 'mail-outline',
            }}
          />
        </View>

        {/* Contact + Address */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#eee',
            padding: 14,
            marginTop: 12,
            gap: 10,
          }}
        >
          <Row icon="call-outline" label="Phone" value={PHONE} />
          <Row icon="logo-whatsapp" label="WhatsApp" value={WHATSAPP} />
          <Row icon="location-outline" label="Address" value={ADDRESS} />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            <PrimaryButton icon="call-outline" label="Call" onPress={onCall} style={{ flex: 1 }} />
            <PrimaryButton icon="logo-whatsapp" label="WhatsApp" onPress={onWhatsApp} style={{ flex: 1 }} />
            <GhostButton icon="map-outline" label="Map" onPress={onOpenMaps} style={{ flex: 1 }} />
          </View>
        </View>

        {/* Values / Features */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#eee',
            padding: 14,
            marginTop: 12,
            gap: 10,
          }}
        >
          <Text style={{ fontWeight: '900', color: colors.text, marginBottom: 4 }}>What we value</Text>
          <PillRow items={['Genuine Products', 'Fair Prices', 'Local Service', 'Fast Ordering']} />
        </View>

        {/* Footer meta */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#6B7280' }}>
            App version <Text style={{ fontWeight: '800', color: colors.text }}>{APP_VERSION}</Text>
          </Text>
          <Text style={{ color: '#9CA3AF', marginTop: 2 }}>© {new Date().getFullYear()} {STORE_NAME}</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

/* ---------------- SVG Illustration ---------------- */
function BeautyAndGiftSVG() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 360 140">
      <Defs>
        <SvgLinear id="grad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E9D5FF" stopOpacity="1" />
          <Stop offset="1" stopColor="#C7D2FE" stopOpacity="1" />
        </SvgLinear>
      </Defs>

      <Rect x="0" y="0" width="360" height="140" rx="16" fill="url(#grad)" />

      {/* Gift box */}
      <Rect x="40" y="40" width="80" height="60" rx="8" fill="#fff" stroke="#D1D5DB" />
      <Rect x="78" y="40" width="4" height="60" fill="#8366CC" />
      <Rect x="40" y="68" width="80" height="4" fill="#8366CC" />
      <Path
        d="M72 32 C70 24, 82 22, 84 30 C86 22, 98 24, 96 32 C92 36, 76 36, 72 32 Z"
        fill="#F43F5E"
      />

      {/* Lipstick */}
      <Rect x="166" y="54" width="22" height="46" rx="4" fill="#111827" />
      <Rect x="166" y="44" width="22" height="14" rx="3" fill="#F59E0B" />
      <Path d="M166 44 L188 44 L188 38 C184 32, 170 32, 166 38 Z" fill="#EF4444" />

      {/* Cosmetic bottle */}
      <Rect x="210" y="48" width="26" height="52" rx="6" fill="#fff" stroke="#D1D5DB" />
      <Rect x="214" y="40" width="18" height="12" rx="3" fill="#9CA3AF" />
      <Circle cx="223" cy="75" r="8" fill="#8366CC" opacity="0.2" />
    </Svg>
  );
}

/* ---------------- UI helpers ---------------- */
function InfoCard({
  title,
  subtitle,
  icon,
  accent,
  footerAction,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  footerAction?: { label: string; onPress: () => void; icon: keyof typeof Ionicons.glyphMap };
}) {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 14,
        gap: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${accent}1A`,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: accent,
          }}
        >
          <Ionicons name={icon} size={18} color={accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '900', color: colors.text }}>{title}</Text>
          <Text style={{ color: '#6B7280', marginTop: 2 }}>{subtitle}</Text>
        </View>
      </View>

      {footerAction && (
        <Pressable
          onPress={footerAction.onPress}
          style={{
            marginTop: 6,
            alignSelf: 'flex-start',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: colors.tint,
            borderRadius: 999,
            paddingVertical: 8,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Ionicons name={footerAction.icon} size={16} color={colors.tint} />
          <Text style={{ color: colors.tint, fontWeight: '800' }}>{footerAction.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

function Row({
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

function PillRow({ items }: { items: string[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {items.map((t) => (
        <View
          key={t}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 999,
            backgroundColor: 'rgba(131,102,204,0.10)',
            borderWidth: 1,
            borderColor: colors.tint,
          }}
        >
          <Text style={{ color: colors.tint, fontWeight: '800', fontSize: 12 }}>{t}</Text>
        </View>
      ))}
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
