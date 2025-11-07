// import { View, TextInput } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '@theme/color';

// type Props = { value: string; onChangeText: (v: string) => void; };

// export default function SearchBar({ value, onChangeText }: Props) {
//   return (
//     <View
//       style={{
//         flexDirection: 'row', alignItems: 'center',
//         backgroundColor: '#fff', borderRadius: 16,
//         paddingHorizontal: 12, height: 44, gap: 8,
//         shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
//         shadowOffset: { width: 0, height: 4 }, elevation: 2,
//         borderWidth: 1, borderColor: '#eee',
//       }}
//     >
//       <Ionicons name="search-outline" size={18} color={colors.muted} />
//       <TextInput
//         placeholder="Search for products…"
//         value={value}
//         onChangeText={onChangeText}
//         style={{ flex: 1, fontSize: 16 }}
//         placeholderTextColor={colors.muted}
//       />
//     </View>
//   );
// }


// src/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/color';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  onSubmitEditing?: () => void;

  /** When set, input hides and we show a label chip with a clear (×) icon */
  activeLabel?: string | null;
  onClearActive?: () => void;
};

export default function SearchBar({
  value,
  onChangeText,
  onSubmitEditing,
  activeLabel,
  onClearActive,
}: Props) {
  const hasActive = !!activeLabel;

  return (
    <View
      style={{
        height: 44,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
      }}
    >
      <Ionicons name="search-outline" size={18} color="#6B7280" />

      {hasActive ? (
        // Active label view
        <View
          style={{
            flex: 1,
            height: 32,
            borderRadius: 8,
            backgroundColor: '#F3F4F6',
            paddingHorizontal: 10,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Text numberOfLines={1} style={{ flex: 1, color: '#111827', fontWeight: '700' }}>
            {activeLabel}
          </Text>

          {/* Clear cross */}
          <Pressable
            onPress={onClearActive}
            hitSlop={10}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close-circle" size={18} color={colors.tint} />
          </Pressable>
        </View>
      ) : (
        // Typing mode
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search for products…"
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          onSubmitEditing={onSubmitEditing}
          style={{ flex: 1, paddingVertical: 8, color: '#111827' }}
        />
      )}
    </View>
  );
}
