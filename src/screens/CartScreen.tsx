// src/screens/CartScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';

import SafeScreen from '@components/SafeScreen';
import { colors } from '@theme/color';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addToCart, setQty, removeFromCart } from '@store/slices/cartSlice';

/* ---------- Dummy product catalog ---------- */
const PRODUCTS: Record<string, { id: string; title: string; price: number; image: string }> = {
  '1': { id: '1', title: 'Rose Glow Serum',       price: 1299, image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600' },
  '2': { id: '2', title: 'Eyeshadow Palette',     price:  899, image: 'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=600' },
  '3': { id: '3', title: 'Whisper Bloom Perfume', price: 2499, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600' },
  '4': { id: '4', title: 'Deluxe Spa Gift Set',   price: 1699, image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600' },
};

/* ---------- Dummy default address ---------- */
const DEFAULT_ADDRESS = {
  label: 'Home',
  line1: 'Lane 12, Civil Lines',
  city: 'Jaunpur',
  state: 'UP',
  pincode: '222001',
};

const formatINR = (v: number) => `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

function FocusAwareStatusBar(props: React.ComponentProps<typeof StatusBar>) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}

export default function CartScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items); // [{ id, qty }]

  const enriched = useMemo(() => {
    return items
      .map((i) => {
        const p = PRODUCTS[i.id];
        if (!p) return null;
        return { ...p, qty: i.qty, lineTotal: p.price * i.qty };
      })
      .filter(Boolean) as Array<{ id: string; title: string; price: number; image: string; qty: number; lineTotal: number }>;
  }, [items]);

  const itemsCount = enriched.reduce((acc, it) => acc + it.qty, 0);
  const subTotal   = enriched.reduce((acc, it) => acc + it.lineTotal, 0);
  const delivery   = 0; // Free for now
  const total      = subTotal + delivery;

  const onCheckout = () => {
    if (enriched.length === 0) {
      Alert.alert('Cart is empty', 'Add a few items before checkout.');
      return;
    }
    Alert.alert('Checkout', 'Proceed to address & payment.');
    // TODO: navigate to checkout + call backend
  };

  return (
    // Let the header own the TOP inset so gradient fills the status bar
    <SafeScreen edges={['left', 'right',]}>
      <FocusAwareStatusBar style="light" translucent backgroundColor="transparent" />

      {/* Inbuilt gradient header (no search) */}
      <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 28,
                fontWeight: '900',
                letterSpacing: -0.3,
                lineHeight: 30,
                flex: 1,
              }}
            >
              Cart
            </Text>
            {/* Optional: cart icon for flair */}
            <Ionicons name="cart-outline" size={24} color="#fff" />
          </View>

          {/* Optional tiny subtitle under header */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Review your order</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Body */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16, gap: 14, marginTop: 12 }}>
        {/* Cart Summary */}
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
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="receipt-outline" size={18} color={colors.tint} />
            <Text style={{ fontWeight: '800', color: colors.text }}>Cart Summary</Text>
          </View>

          <RowLine label="Items"    value={`${itemsCount}`} />
          <RowLine label="Subtotal" value={formatINR(subTotal)} />
          <RowLine label="Delivery" value={delivery === 0 ? 'Free' : formatINR(delivery)} />

          <View style={{ height: 1, backgroundColor: '#F1F1F1', marginVertical: 6 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="location-outline" size={16} color={colors.muted} />
            <Text style={{ color: colors.muted, flex: 1 }} numberOfLines={1}>
              Deliver to: {DEFAULT_ADDRESS.label} • {DEFAULT_ADDRESS.city}, {DEFAULT_ADDRESS.state} {DEFAULT_ADDRESS.pincode}
            </Text>
            <Pressable onPress={() => Alert.alert('Change address')}>
              <Text style={{ color: colors.tint, fontWeight: '700' }}>Change</Text>
            </Pressable>
          </View>
        </View>

        {/* Items */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#eee',
            overflow: 'hidden',
          }}
        >
          {enriched.length === 0 ? (
            <View style={{ padding: 16, alignItems: 'center', gap: 8 }}>
              <Ionicons name="cart-outline" size={28} color={colors.muted} />
              <Text style={{ color: colors.muted }}>Your cart is empty</Text>
            </View>
          ) : (
            enriched.map((it, idx) => (
              <CartRow
                key={it.id}
                isLast={idx === enriched.length - 1}
                item={it}
                onInc={() => dispatch(addToCart({ id: it.id }))}
                onDec={() => {
                  const next = it.qty - 1;
                  if (next <= 0) dispatch(removeFromCart({ id: it.id }));
                  else dispatch(setQty({ id: it.id, qty: next }));
                }}
                onRemove={() => dispatch(removeFromCart({ id: it.id }))}
              />
            ))
          )}
        </View>

        {/* Final total + Checkout */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#eee',
            padding: 12,
            gap: 8,
          }}
        >
          <RowLine label="Subtotal" value={formatINR(subTotal)} />
          <RowLine label="Delivery" value={delivery === 0 ? 'Free' : formatINR(delivery)} />
          <View style={{ height: 1, backgroundColor: '#F1F1F1', marginVertical: 4 }} />
          <RowLine label="Total" value={formatINR(total)} bold />

          <Pressable
            onPress={onCheckout}
            style={{
              marginTop: 10,
              backgroundColor: colors.tint,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="bag-check-outline" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800' }}>Checkout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

/* -------------------- UI Bits -------------------- */

function CartRow({
  item,
  isLast,
  onInc,
  onDec,
  onRemove,
}: {
  item: { id: string; title: string; price: number; image: string; qty: number; lineTotal: number };
  isLast: boolean;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 12,
        gap: 12,
        alignItems: 'center',
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#F1F1F1',
      }}
    >
      <Image source={{ uri: item.image }} style={{ width: 56, height: 56, borderRadius: 12 }} contentFit="cover" transition={150} />

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '700' }} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 2 }}>{formatINR(item.price)}</Text>

        {/* Qty stepper */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <CircleBtn onPress={onDec}><Ionicons name="remove" size={16} color={colors.text} /></CircleBtn>
          <Text style={{ minWidth: 20, textAlign: 'center', fontWeight: '700' }}>{item.qty}</Text>
          <CircleBtn onPress={onInc}><Ionicons name="add" size={16} color={colors.text} /></CircleBtn>

          <Pressable onPress={onRemove} style={{ marginLeft: 12 }}>
            <Ionicons name="trash-outline" size={18} color="#e11d48" />
          </Pressable>
        </View>
      </View>

      <Text style={{ color: colors.text, fontWeight: '800' }}>{formatINR(item.lineTotal)}</Text>
    </View>
  );
}

function CircleBtn({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      {children}
    </Pressable>
  );
}

function RowLine({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ color: colors.muted, flex: 1 }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: bold ? '800' : '600' }}>{value}</Text>
    </View>
  );
}


