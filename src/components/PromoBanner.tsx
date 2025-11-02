import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { colors } from '@theme/color';

type Props = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onPress?: () => void;
  imageUrl?: string;
};

export default function PromoBanner({
  title = 'Winter Glow Sale',
  subtitle = 'Up to 40% off on skincare & perfumes',
  ctaText = 'Shop now',
  onPress,
  imageUrl = 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=800',
}: Props) {
  return (
    <LinearGradient
      colors={[colors.headerStart, colors.headerEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 }}>
        {/* Text block */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: '900',
              letterSpacing: -0.2,
              lineHeight: 24,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={{ color: 'rgba(255,255,255,0.9)', marginTop: 6 }}
            numberOfLines={2}
          >
            {subtitle}
          </Text>

          <Pressable
            onPress={onPress}
            style={{
              alignSelf: 'flex-start',
              marginTop: 12,
              backgroundColor: '#fff',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: colors.headerEnd, fontWeight: '700' }}>{ctaText}</Text>
          </Pressable>
        </View>

        {/* Decorative product image */}
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 110, height: 110, borderRadius: 16 }}
          contentFit="cover"
          transition={150}
        />
      </View>
    </LinearGradient>
  );
}
