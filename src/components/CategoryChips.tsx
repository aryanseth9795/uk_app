// src/components/CategoryChips.tsx
import React, { useMemo } from 'react';
import { FlatList, Pressable, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@theme/color';
import { Category,CATEGORIES } from '@/dummy/category';

type Item = { id: string; label: string; icon: keyof typeof Ionicons.glyphMap };



type Props = {
  selected: string | null;      // 'all' | 'skincare' | ...
  onSelect: (id: string) => void;
};

const GAP = 5;           // spacing between chips
const TILE = 45;          // smaller, compact tile size
const ICON = 24;          // icon size

export default function CategoryChips({ selected, onSelect }: Props) {
  const activeId = selected ?? 'all';
  const activeLabel = useMemo(
    () => CATEGORIES.find(d => d.id === activeId)?.label ?? 'All',
    [activeId]
  );

  // Slider data: active pill first, then icon tiles
  const data = useMemo(
    () => [{ id: '__active', label: activeLabel } as any, ...CATEGORIES],
    [activeLabel]
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', colors.tintLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 22,
        borderWidth: 2,
        borderColor: colors.chipBorder,
        paddingVertical: 6,
        paddingHorizontal: 8,
        // subtle elevation / shadow for a banner-like boundary
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        marginTop: 10,
      }}
    >
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', gap: GAP }}
        renderItem={({ item }) => {
          // Active pill (scrolls with the list)
          if (item.id === '__active') {
            return (
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: colors.tintLight,
                  borderWidth: 1,
                  borderColor: colors.tint,
                }}
              >
                <Text style={{ color: colors.tint, fontWeight: '700', fontSize: 12 }}>
                  {activeLabel}
                </Text>
              </View>
            );
          }

          const active = item.id === activeId;
          return (
            <Pressable onPress={() => onSelect(item.id)}>
              <View
                style={{
                  width: TILE,
                  height: TILE,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? '#fff' : colors.chipBg,
                  borderWidth: 1,
                  borderColor: active ? colors.tint : colors.chipBorder,
                  shadowColor: '#000',
                  shadowOpacity: active ? 0.08 : 0,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: active ? 2 : 0,
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={ICON}
                  color={active ? colors.tint : colors.text}
                />
              </View>
            </Pressable>
          );
        }}
      />
    </LinearGradient>
  );
}
