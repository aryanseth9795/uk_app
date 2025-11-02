import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList, NativeScrollEvent, NativeSyntheticEvent, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { colors } from '@theme/color';

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  imageUrl: string;
  onPress?: () => void;
};

type Props = {
  slides: Slide[];
  height?: number;       // default 160
  intervalMs?: number;   // default 3000
  borderRadius?: number; // default 20
};

const { width: SCREEN_W} = Dimensions.get('window');

export default function PromoCarousel({
  slides,
  height = 150,
  intervalMs = 3000,
  borderRadius = 20,
}: Props) {
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const total = slides.length;

  // ensure we have at least 1 slide
  const data = useMemo(() => (total > 0 ? slides : []), [slides, total]);

  // Autoplay
  useEffect(() => {
    if (total <= 1) return; // no autoplay for single slide
    const id = setInterval(() => {
      const next = (index + 1) % total;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, intervalMs);
    return () => clearInterval(id);
  }, [index, total, intervalMs]);

  // Keep index in sync with manual swipes
  const onMomentumEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / SCREEN_W);
    if (i !== index) setIndex(i);
  }, [index]);

  const keyExtractor = useCallback((item: Slide) => item.id, []);

  const renderItem = useCallback(({ item }: { item: Slide }) => (
    <View style={{ width: SCREEN_W-30,  }}>
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height,
          marginHorizontal: 8,
          borderRadius,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, flex: 1 }}>
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
              {item.title}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 6 }} numberOfLines={2}>
              {item.subtitle}
            </Text>

            {!!item.ctaText && (
              <Pressable
                onPress={item.onPress}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 12,
                  backgroundColor: '#fff',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: colors.headerEnd, fontWeight: '700' }}>{item.ctaText}</Text>
              </Pressable>
            )}
          </View>

          {/* Decorative product image */}
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: height - 50, height: height - 50, borderRadius: 16 }}
            contentFit="cover"
            transition={150}
          />
        </View>
      </LinearGradient>
    </View>
  ), [borderRadius, height]);

  if (data.length === 0) return null;

  return (
    <View>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        // Important for nested vertical scroll: allow horizontal swipes to pass
        nestedScrollEnabled={false}
      />

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
        {data.map((_, i) => {
          const active = i === index;
          return (
            <View
              key={i}
              style={{
                width: active ? 18 : 6,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 4,
                backgroundColor: active ? colors.headerEnd : 'rgba(0,0,0,0.15)',
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
