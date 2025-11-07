// import React from "react";
// import { View, Text } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import { colors } from "@theme/color";
// import SearchBar from "@components/SearchBar";

// type Props = {
//   searchValue: string;
//   onSearchChange: (v: string) => void;
//   subtitle?: string;
// };

// export default function AppHeader({
//   searchValue,
//   onSearchChange,
//   subtitle = "Beauty • Gifts • Fragrance",
// }: Props) {
  
//   const FLOAT_OFFSET = 2; 
//   const SEARCH_HEIGHT = 8; 
//   const RESERVED_SPACE = FLOAT_OFFSET + SEARCH_HEIGHT; 

//   return (
//     <LinearGradient
//       colors={[colors.headerStart, colors.headerEnd]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 2 }}
//     >
//       <SafeAreaView edges={["top", "left", "right"]}>
//         <View
//           style={{
//             paddingHorizontal: 16,
//             paddingTop: 2,
//             paddingBottom: 54,
//             marginBottom: 1,
//           }}
//         >
//           <Text
//             style={{
//               color: "#fff",
//               fontSize: 28,
//               fontWeight: "900",
//               letterSpacing: -0.3,
//               lineHeight: 30,
//               justifyContent: "center",
//             }}
//           >
//             U K Cosmetics & Gift Center
//           </Text>

//           <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
//             {subtitle}
//           </Text>
//         </View>

//         {/* Floating search pill */}
//         <View
//           style={{
//             paddingHorizontal: 16,
//             position: "absolute",
//             left: 0,
//             right: 0,
//             bottom: -FLOAT_OFFSET,
//           }}
//         >
//           <View
//             style={{
//               borderRadius: 25,
//               overflow: "hidden",
//               shadowColor: "#000",
//               shadowOpacity: 0.15,
//               shadowRadius: 12,
//               shadowOffset: { width: 0, height: 6 },
//               elevation: 6,
//             }}
//           >
//             <SearchBar value={searchValue} onChangeText={onSearchChange} />
//           </View>
//         </View>
//       </SafeAreaView>

//       {/* Reserve space below the header equal to the floating pill height */}
//       <View
//         style={{ height: RESERVED_SPACE, marginBottom: 5, paddingBottom: 1 }}
//       />
//     </LinearGradient>
//   );
// }


// src/components/AppHeader.tsx
// import React, { useState } from 'react';
// import { View, Text, Pressable, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '@theme/color'; // change to '@theme/color' if that's your file
// import SearchBar from '@components/SearchBar';

// type Props = {
//   title?: string;
//   subtitle?: string;
//   showSearch?: boolean;

//   // Controlled search input (optional)
//   searchValue?: string;
//   onSearchChange?: (v: string) => void;
//   onSearchSubmit?: (v: string) => void;

//   // Suggestions dropdown (labels only)
//   suggestions?: string[];
//   suggestionsLoading?: boolean;
//   onSelectSuggestion?: (v: string) => void;
// };

// export default function AppHeader({
//   title = 'UK Cosmetics & Gift Center',
//   subtitle = 'Beauty • Gifts • Fragrance',
//   showSearch = true,
//   searchValue,
//   onSearchChange,
//   onSearchSubmit,
//   suggestions = [],
//   suggestionsLoading = false,
//   onSelectSuggestion,
// }: Props) {
//   // Uncontrolled fallback
//   const [internal, setInternal] = useState('');
//   const value = searchValue ?? internal;
//   const setValue = onSearchChange ?? setInternal;

//   const FLOAT_OFFSET = 24;
//   const SEARCH_HEIGHT = 44;
//   const SUGGEST_ROW_H = 40;

//   const open = showSearch && (suggestionsLoading || (value.trim().length > 0 && suggestions.length > 0));
//   const visibleCount = Math.min(suggestions.length, 6);
//   const DROP_H = open ? Math.min(visibleCount * SUGGEST_ROW_H, 240) + 8 : 0;

//   const RESERVED_SPACE = showSearch ? FLOAT_OFFSET + SEARCH_HEIGHT + 8 + DROP_H : 0;

//   return (
//     <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//       <SafeAreaView edges={['top', 'left', 'right']}>
//         <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 56 }}>
//           <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.3, lineHeight: 30 }}>
//             {title}
//           </Text>
//           {!!subtitle && <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{subtitle}</Text>}
//         </View>

//         {showSearch && (
//           <View style={{ paddingHorizontal: 16, position: 'absolute', left: 0, right: 0, bottom: -FLOAT_OFFSET }}>
//             <View
//               style={{
//                 borderRadius: 16,
//                 overflow: 'hidden',
//                 shadowColor: '#000',
//                 shadowOpacity: 0.15,
//                 shadowRadius: 12,
//                 shadowOffset: { width: 0, height: 6 },
//                 elevation: 6,
//                 backgroundColor: '#fff',
//               }}
//             >
//               <SearchBar
//                 value={value}
//                 onChangeText={setValue}
//                 onSubmitEditing={() => onSearchSubmit?.(value)}
//               />
//             </View>

//             {open && (
//               <View
//                 style={{
//                   marginTop: 8,
//                   borderRadius: 12,
//                   borderWidth: 1,
//                   borderColor: '#E5E7EB',
//                   backgroundColor: '#fff',
//                   overflow: 'hidden',
//                   maxHeight: 240,
//                 }}
//               >
//                 {suggestionsLoading ? (
//                   <View style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}>
//                     <ActivityIndicator />
//                   </View>
//                 ) : (
//                   suggestions.slice(0, 6).map((label, idx) => (
//                     <Pressable
//                       key={`${label}-${idx}`}
//                       onPress={() => onSelectSuggestion?.(label)}
//                       style={{
//                         paddingVertical: 10,
//                         paddingHorizontal: 12,
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         gap: 8,
//                         borderTopWidth: idx === 0 ? 0 : 1,
//                         borderTopColor: '#F3F4F6',
//                       }}
//                     >
//                       <Ionicons name="search-outline" size={16} color="#9CA3AF" />
//                       <Text style={{ color: '#111827', flex: 1 }} numberOfLines={1}>
//                         {label}
//                       </Text>
//                     </Pressable>
//                   ))
//                 )}
//               </View>
//             )}
//           </View>
//         )}
//       </SafeAreaView>

//       {RESERVED_SPACE > 0 && <View style={{ height: RESERVED_SPACE }} />}
//     </LinearGradient>
//   );
// }
// src/components/AppHeader.tsx
// import React, { useState } from 'react';
// import { View, Text, Pressable, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '@theme/color'; // change to '@theme/color' if that's your file
// import SearchBar from '@components/SearchBar';

// type Props = {
//   title?: string;
//   subtitle?: string;
//   showSearch?: boolean;

//   // Controlled search input (optional)
//   searchValue?: string;
//   onSearchChange?: (v: string) => void;
//   onSearchSubmit?: (v: string) => void;

//   // Suggestions (labels only)
//   suggestions?: string[];
//   suggestionsLoading?: boolean;
//   onSelectSuggestion?: (v: string) => void;
// };

// export default function AppHeader({
//   title = 'UK Cosmetics & Gift Center',
//   subtitle = 'Beauty • Gifts • Fragrance',
//   showSearch = true,
//   searchValue,
//   onSearchChange,
//   onSearchSubmit,
//   suggestions = [],
//   suggestionsLoading = false,
//   onSelectSuggestion,
// }: Props) {
//   // Uncontrolled fallback (if no value/handler passed)
//   const [internal, setInternal] = useState('');
//   const value = searchValue ?? internal;
//   const setValue = onSearchChange ?? setInternal;

//   // Layout constants
//   const FLOAT_OFFSET = 2;   // distance the pill floats below header
//   const SEARCH_HEIGHT = 4;  // SearchBar height

//   // Overlay colors (visible on white bg)
//   const OVERLAY_BG = '#F5F3FF';     // violet-50
//   const OVERLAY_BORDER = '#DDD6FE'; // violet-200
//   const ROW_PRESS_BG = '#EEE7FF';   // pressed state

//   // OPEN when there is text & items OR loading
//   const open = showSearch && (suggestionsLoading || (value.trim().length > 0 && suggestions.length > 0));

//   // Reserve space ONLY for the floating search (NOT the dropdown)
//   const RESERVED_SPACE = showSearch ? FLOAT_OFFSET + SEARCH_HEIGHT + 5 : 0;

//   return (
//     // 👇 Make the whole header a higher layer than ScrollView siblings
//     <View style={{ position: 'relative', zIndex: 100, elevation: 100 }}>
//       <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//         {/* Header owns the top safe area so status bar area is colored */}
//         <SafeAreaView edges={['top', 'left', 'right']}>
//           <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 56 }}>
//             <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.3, lineHeight: 30 }}>
//               {title}
//             </Text>
//             {!!subtitle && <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{subtitle}</Text>}
//           </View>

//           {/* Floating search container */}
//           {showSearch && (
//             <View
//               style={{
//                 paddingHorizontal: 16,
//                 position: 'absolute',
//                 left: 0,
//                 right: 0,
//                 bottom: -FLOAT_OFFSET,
//               }}
//             >
//               {/* Search pill */}
//               <View
//                 style={{
//                   borderRadius: 16,
//                   overflow: 'hidden',
//                   shadowColor: '#000',
//                   shadowOpacity: 0.15,
//                   shadowRadius: 12,
//                   shadowOffset: { width: 0, height: 6 },
//                   elevation: 6,
//                   backgroundColor: '#fff',
//                 }}
//               >
//                 <SearchBar
//                   value={value}
//                   onChangeText={setValue}
//                   onSubmitEditing={() => onSearchSubmit?.(value)}
//                 />
//               </View>

//               {/* Suggestions overlay (absolute, does NOT affect layout) */}
//               {open && (
//                 <View
//                   style={{
//                     position: 'absolute',
//                     left: 16,                  // match paddingHorizontal
//                     right: 16,
//                     top: SEARCH_HEIGHT + 42,    // directly below the pill
//                     backgroundColor: OVERLAY_BG,
//                     borderRadius: 12,
//                     borderWidth: 1,
//                     borderColor: OVERLAY_BORDER,
//                     maxHeight: 240,
//                     overflow: 'hidden',
//                     zIndex: 1000,              // within header
//                     elevation: 16,             // Android overlay above grid
//                     shadowColor: '#000',
//                     shadowOpacity: 0.15,
//                     shadowRadius: 12,
//                     shadowOffset: { width: 0, height: 6 },
//                   }}
//                 >
//                   {suggestionsLoading ? (
//                     <View style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}>
//                       <ActivityIndicator />
//                     </View>
//                   ) : (
//                     suggestions.slice(0, 6).map((label, idx) => (
//                       <Pressable
//                         key={`${label}-${idx}`}
//                         onPress={() => onSelectSuggestion?.(label)}
//                         style={({ pressed }) => [
//                           {
//                             paddingVertical: 10,
//                             paddingHorizontal: 12,
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             gap: 8,
//                             borderTopWidth: idx === 0 ? 0 : 1,
//                             borderTopColor: '#EDE9FE', // violet-100 separator
//                           },
//                           pressed && { backgroundColor: ROW_PRESS_BG },
//                         ]}
//                       >
//                         <Ionicons name="search-outline" size={16} color="#7C3AED" />
//                         <Text style={{ color: '#111827', flex: 1 }} numberOfLines={1}>
//                           {label}
//                         </Text>
//                       </Pressable>
//                     ))
//                   )}
//                 </View>
//               )}
//             </View>
//           )}
//         </SafeAreaView>

//         {/* Reserve just enough space for the floating search */}
//         {RESERVED_SPACE > 0 && <View style={{ height: RESERVED_SPACE }} />}
//       </LinearGradient>
//     </View>
//   );
// }


// src/components/AppHeader.tsx
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
  title = 'UK Cosmetics & Gift Center',
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

  const FLOAT_OFFSET = 4;
  const SEARCH_HEIGHT = 4;

  // Overlay colors (visible on white)
  const OVERLAY_BG = '#F5F3FF';     // violet-50
  const OVERLAY_BORDER = '#DDD6FE'; // violet-200
  const ROW_PRESS_BG = '#EEE7FF';

  // Only open overlay when typing (no active label)
  const open =
    showSearch &&
    !activeLabel &&
    (suggestionsLoading || (value.trim().length > 0 && suggestions.length > 0));

  const RESERVED_SPACE = showSearch ? FLOAT_OFFSET + SEARCH_HEIGHT + 4
   : 0;

  return (
    <View style={{ position: 'relative', zIndex: 100, elevation: 100 }}>
      <LinearGradient colors={[colors.headerStart, colors.headerEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 56 }}>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.3, lineHeight: 30 }}>
              {title}
            </Text>
            {!!subtitle && <Text style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{subtitle}</Text>}
          </View>

          {showSearch && (
            <View
              style={{
                paddingHorizontal: 16,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -FLOAT_OFFSET,
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
