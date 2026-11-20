
import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/color';
import SearchBar from '@components/SearchBar';
import BrandHeaderLockup from '@components/BrandHeaderLockup';

type Props = {
  title?: string;
  subtitle?: string;
  /** Show the bag logo beside the title. Default: only for the brand title. */
  showLogo?: boolean;
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

const BRAND_TITLE = 'UR Shop';

/** Side margin shared by the logo, the search pill and the page's cards. */
const GUTTER = 16;
const PILL_HEIGHT = 48;
/** Space under the pill before the page content starts. */
const BELOW_PILL = 4;

export default function AppHeader({
  title = BRAND_TITLE,
  showLogo,
  subtitle = 'Aap Ki Apni Dukaan',
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
  // The brand logo sits beside the shop name. Screens that pass their own
  // title ("Add Address", "Help & Support") keep a plain text heading.
  const withLogo = showLogo ?? title === BRAND_TITLE;

  const [internal, setInternal] = useState('');
  const value = searchValue ?? internal;
  const setValue = onSearchChange ?? setInternal;

  // Overlay colors (visible on white)
  const OVERLAY_BG = '#F5F3FF';     // violet-50
  const OVERLAY_BORDER = '#DDD6FE'; // violet-200
  const ROW_PRESS_BG = '#EEE7FF';

  // Only open overlay when typing (no active label)
  const open =
    showSearch &&
    !activeLabel &&
    (suggestionsLoading || (value.trim().length > 0 && suggestions.length > 0));

  return (
    <View
      style={{
        position: 'relative',
        zIndex: 100,
        elevation: 100,
        paddingBottom: showSearch ? BELOW_PILL : 0,
      }}
    >
      {/* Purple backdrop. It runs up under the status bar and, on the home
          screen, stops halfway down the search pill so the pill sits across
          the edge between the header and the page. */}
      <LinearGradient
        colors={[colors.headerStart, colors.headerEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: showSearch ? PILL_HEIGHT / 2 + BELOW_PILL : 0,
        }}
      />
      <SafeAreaView edges={['top', 'left', 'right']}>
        <View
          style={{
            paddingHorizontal: GUTTER,
            paddingTop: 10,
            paddingBottom: showSearch ? 14 : 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {withLogo ? (
            <BrandHeaderLockup tagline={subtitle} />
          ) : (
            <View style={{ flexShrink: 1 }}>
              <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.1, lineHeight: 30 }}>
                {title}
              </Text>
              {!!subtitle && <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{subtitle}</Text>}
            </View>
          )}
        </View>

        {showSearch && (
          <View style={{ marginHorizontal: GUTTER }}>
            {/* Search pill: a plum-tinted shadow keeps it part of the purple
                header rather than a grey card dropped on top of it. */}
            <View
              style={{
                borderRadius: 16,
                backgroundColor: '#fff',
                shadowColor: '#2E1065',
                shadowOpacity: 0.2,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
                elevation: 6,
              }}
            >
              <View style={{ borderRadius: 16, overflow: 'hidden' }}>
                <SearchBar
                  height={PILL_HEIGHT}
                  value={value}
                  onChangeText={setValue}
                  onSubmitEditing={() => onSearchSubmit?.(value)}
                  activeLabel={activeLabel}
                  onClearActive={onClearActive}
                />
              </View>
            </View>

            {/* Suggestions overlay (absolute, tinted, over content) */}
            {open && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: PILL_HEIGHT + 6,
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
    </View>
  );
}
