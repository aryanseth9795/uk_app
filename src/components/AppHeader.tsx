
import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/color';
import SearchBar from '@components/SearchBar';

type Props = {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;

  // Controlled search input while typing
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onSearchSubmit?: (v: string) => void;

  // Active selected query label (chip mode)
  activeLabel?: string | null;
  onClearActive?: () => void;

  // Suggestions (labels only)
  suggestions?: string[];
  suggestionsLoading?: boolean;
  onSelectSuggestion?: (v: string) => void;
};

export default function AppHeader({
  title = 'UR Shop',
  subtitle = 'Beauty • Gifts • Fragrance',
  showSearch = true,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeLabel = null,
  onClearActive,
  suggestions = [],
  suggestionsLoading = false,
  onSelectSuggestion,
}: Props) {
  const [internal, setInternal] = useState('');
  const value = searchValue ?? internal;
  const setValue = onSearchChange ?? setInternal;

  const FLOAT_OFFSET = 40;
  const SEARCH_HEIGHT = 10;

  // Overlay colors (visible on white)
  const OVERLAY_BG = '#F5F3FF';     // violet-50
  const OVERLAY_BORDER = '#DDD6FE'; // violet-200
  const ROW_PRESS_BG = '#EEE7FF';

  // Only open overlay when typing (no active label)
  const open =
    showSearch &&
    !activeLabel &&
    (suggestionsLoading || (value.trim().length > 0 && suggestions.length > 0));

  const RESERVED_SPACE = showSearch ? FLOAT_OFFSET + SEARCH_HEIGHT -12
   : 0;

  return (
    <View style={{ position: 'relative', zIndex: 100, elevation: 100 }}>
      <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 20 }}>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.1, lineHeight: 30 }}>
              {title}
            </Text>
            {!!subtitle && <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{subtitle}</Text>}
          </View>

          {showSearch && (
            <View
              style={{
                paddingHorizontal: 12,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -FLOAT_OFFSET+8,
              }}
            >
              {/* Search pill */}
              <View
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                  backgroundColor: '#fff',
                }}
              >
                <SearchBar
                  value={value}
                  onChangeText={setValue}
                  onSubmitEditing={() => onSearchSubmit?.(value)}
                  activeLabel={activeLabel}
                  onClearActive={onClearActive}
                />
              </View>

              {/* Suggestions overlay (absolute, tinted, over content) */}
              {open && (
                <View
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    top: SEARCH_HEIGHT + 42,
                    backgroundColor: OVERLAY_BG,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: OVERLAY_BORDER,
                    maxHeight: 240,
                    overflow: 'hidden',
                    zIndex: 1000,
                    elevation: 16,
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                  }}
                >
                  {suggestionsLoading ? (
                    <View style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}>
                      <ActivityIndicator />
                    </View>
                  ) : (
                    suggestions.slice(0, 6).map((label, idx) => (
                      <Pressable
                        key={`${label}-${idx}`}
                        onPress={() => onSelectSuggestion?.(label)}
                        style={({ pressed }) => [
                          {
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            borderTopWidth: idx === 0 ? 0 : 1,
                            borderTopColor: '#EDE9FE',
                          },
                          pressed && { backgroundColor: ROW_PRESS_BG },
                        ]}
                      >
                        <Ionicons name="search-outline" size={16} color="#7C3AED" />
                        <Text style={{ color: '#111827', flex: 1 }} numberOfLines={1}>
                          {label}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </View>
              )}
            </View>
          )}
        </SafeAreaView>

        {RESERVED_SPACE > 0 && <View style={{ height: RESERVED_SPACE }} />}
      </LinearGradient>
    </View>
  );
}
