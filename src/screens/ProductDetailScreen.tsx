// src/screens/ProductDetailScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { apiGetProductById } from '../services/api';
import { useAppDispatch } from '@store/hooks';
import { addToCart } from '@store/slices/cartSlice';
import AppHeader from '@components/AppHeader';
import { colors } from '@theme/color';

type RouteParams = { id: string };

const { width } = Dimensions.get('window');
const IMG_W = width;
const IMG_H = Math.round(width * 0.9);

function rupees(v: number) {
  return `Rs ${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** Given pricing_tiers + mrp_paise, pick unit price for a chosen qty (paise -> rupees) */
function computeUnitPriceRupees(p: any, qty: number): number {
  const tiers = Array.isArray(p?.pricing_tiers) ? p.pricing_tiers : [];
  // Find the highest min_qty <= qty
  const applicable = tiers
    .filter((t: any) => Number(t?.min_qty) <= qty)
    .sort((a: any, b: any) => Number(b.min_qty) - Number(a.min_qty))[0];

  if (applicable?.unit_price_paise) return applicable.unit_price_paise / 100;

  // fallback: min tier price
  const minTier = tiers.reduce((acc: number | null, t: any) => {
    const v = Number(t?.unit_price_paise ?? NaN);
    if (!Number.isFinite(v)) return acc;
    return acc === null ? v : Math.min(acc, v);
  }, null);
  if (minTier != null) return minTier / 100;

  // fallback: mrp
  if (Number.isFinite(Number(p?.mrp_paise))) return Number(p.mrp_paise) / 100;

  // final: parse "₹399.00"
  if (typeof p?.mrp_inr === 'string') {
    const n = Number(p.mrp_inr.replace(/[^\d.]/g, ''));
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function pickImages(p: any): string[] {
  const urls: string[] = [];
  if (p?.thumbnail?.secure_url) urls.push(String(p.thumbnail.secure_url));
  if (Array.isArray(p?.images)) {
    for (const im of p.images) {
      if (im?.secure_url) urls.push(String(im.secure_url));
    }
  }
  // de-dup
  return Array.from(new Set(urls));
}

export default function ProductDetailScreen() {
  const route = useRoute() as any;
  const { id } = (route?.params || {}) as RouteParams;
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | undefined>(undefined);

  // local UI state
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    setError(undefined);
    apiGetProductById(id)
      .then((res: any) => {
        if (!mounted) return;
        setData(res);
        setStatus('succeeded');
      })
      .catch((e:any) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load product');
        setStatus('failed');
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const images = useMemo(() => pickImages(data || {}), [data]);

  const unitPrice = useMemo(() => computeUnitPriceRupees(data, qty), [data, qty]);
  const totalPrice = useMemo(() => unitPrice * qty, [unitPrice, qty]);

  const mrpRupees = useMemo(() => {
    if (Number.isFinite(Number(data?.mrp_paise))) return Number(data.mrp_paise) / 100;
    if (typeof data?.mrp_inr === 'string') {
      const n = Number(data.mrp_inr.replace(/[^\d.]/g, ''));
      if (Number.isFinite(n)) return n;
    }
    return unitPrice; // fallback
  }, [data, unitPrice]);

  const discountPct = useMemo(() => {
    if (!mrpRupees || !unitPrice) return 0;
    const d = ((mrpRupees - unitPrice) / mrpRupees) * 100;
    return Math.max(0, Math.round(d));
  }, [mrpRupees, unitPrice]);

  // ETA: today+3 ~ today+5 (India)
  const eta = useMemo(() => {
    const now = new Date();
    const d1 = new Date(now.getTime() + 3 * 86400000);
    const d2 = new Date(now.getTime() + 5 * 86400000);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    return `${fmt(d1)} – ${fmt(d2)}`;
  }, []);

  const onAddToCart = () => {
    if (!data?.id) return;
    dispatch(addToCart({ id: String(data.id), qty }));
    Alert.alert('Added to cart', `${data?.title ?? data?.name} × ${qty}`);
  };

  const onBuyNow = () => {
    Alert.alert('Buy Now', 'Proceed to checkout flow (to be implemented).');
  };

  const goToCartTab = () => {
    // Adjust the route name to your tab key if different
    navigation.navigate('Cart');
  };

  // CONTENT
  if (status === 'loading' && !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <AppHeader title="Loading..." showSearch={false} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8, color: '#6B7280' }}>Fetching product…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'failed') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <AppHeader title="Product" showSearch={false} />
        <View style={{ padding: 16 }}>
          <View
            style={{
              backgroundColor: '#FFF4F4',
              borderColor: '#FECACA',
              borderWidth: 1,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#991B1B', fontWeight: '700' }}>Failed to load product</Text>
            <Text style={{ color: '#7F1D1D' }}>{error}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Main UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Keep the same purple header without search */}
      <AppHeader title={String(data?.name ?? data?.title ?? 'Product')} subtitle="" showSearch={false} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / IMG_W);
            setImgIndex(idx);
          }}
          scrollEventThrottle={16}
        >
          {images.length > 0 ? (
            images.map((uri, i) => (
              <Image
                key={`${uri}-${i}`}
                source={{ uri }}
                style={{ width: IMG_W, height: IMG_H, backgroundColor: '#FAFAFA' }}
                contentFit="cover"
                transition={120}
              />
            ))
          ) : (
            <Image
              source={{ uri: 'https://via.placeholder.com/1200x900.png?text=No+Image' }}
              style={{ width: IMG_W, height: IMG_H, backgroundColor: '#FAFAFA' }}
              contentFit="cover"
            />
          )}
        </ScrollView>

        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {(images.length > 0 ? images : ['_']).map((_, i) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === imgIndex ? colors.tint : '#E5E7EB',
              }}
            />
          ))}
        </View>

        {/* Title + price */}
        <View style={{ paddingHorizontal: 16, marginTop: 14, gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>
            {String(data?.name ?? data?.title ?? '')}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '900' }}>{rupees(unitPrice)}</Text>
            {discountPct > 0 && (
              <>
                <Text style={{ color: '#6B7280', textDecorationLine: 'line-through' }}>
                  {rupees(mrpRupees)}
                </Text>
                <Text style={{ color: '#16a34a', fontWeight: '800' }}>{discountPct}% off</Text>
              </>
            )}
          </View>

          {/* Quantity & tier note */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <Text style={{ fontWeight: '700' }}>Qty</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12 }}>
              <Pressable
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={{ paddingHorizontal: 12, paddingVertical: 8 }}
              >
                <Ionicons name="remove-outline" size={18} />
              </Pressable>
              <Text style={{ minWidth: 28, textAlign: 'center', fontWeight: '800' }}>{qty}</Text>
              <Pressable
                onPress={() => setQty((q) => Math.min(999, q + 1))}
                style={{ paddingHorizontal: 12, paddingVertical: 8 }}
              >
                <Ionicons name="add-outline" size={18} />
              </Pressable>
            </View>
            <Text style={{ color: '#6B7280' }}>
              {qty >= 3 ? 'Bulk discount applied' : 'Save more on 3+, 6+'}
            </Text>
          </View>

          {/* Delivery container */}
          <View
            style={{
              marginTop: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              backgroundColor: '#F8FAFC',
              padding: 12,
              gap: 6,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="location-outline" size={18} color={colors.tint} />
              <Text style={{ fontWeight: '800' }}>Delivery</Text>
            </View>
            <Text style={{ color: '#374151' }}>
              Deliver to <Text style={{ fontWeight: '700' }}>Jaunpur, UP 222001</Text>
            </Text>
            <Text style={{ color: '#374151' }}>
              Expected by <Text style={{ fontWeight: '700' }}>{eta}</Text>
            </Text>
          </View>

          {/* Returns / Replacement notice */}
          <View
            style={{
              marginTop: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#FDE68A',
              backgroundColor: '#FFFBEB',
              padding: 12,
              gap: 6,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#92400E" />
              <Text style={{ fontWeight: '800', color: '#92400E' }}>Returns & Replacement</Text>
            </View>
            <Text style={{ color: '#92400E' }}>
              Eligible for <Text style={{ fontWeight: '800' }}>7-day replacement</Text>. Returns may be restricted for perishable or hygiene products.
            </Text>
          </View>

          {/* Description */}
          {!!data?.description && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: '800', marginBottom: 6 }}>About this item</Text>
              <Text style={{ color: '#374151' }}>{String(data.description)}</Text>
            </View>
          )}
        </View>

        {/* Bottom spacer so content isn't hidden by action bar */}
        <View style={{ height: Math.max(insets.bottom, 16) + 72 }} />
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingHorizontal: 12,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -4 },
          elevation: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable
            onPress={goToCartTab}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Ionicons name="cart-outline" size={22} color={colors.tint} />
          </Pressable>

          <Pressable
            onPress={onAddToCart}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.tint,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ color: colors.tint, fontWeight: '900' }}>Add to Cart • {rupees(totalPrice)}</Text>
          </Pressable>

          <Pressable
            onPress={onBuyNow}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.tint,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '900' }}>Buy Now</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
