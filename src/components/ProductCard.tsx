// import { View, Text, Pressable } from 'react-native';
// import { Image } from 'expo-image';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '@theme/color';

// type Props = { title: string; price: string; image: string; onAdd: () => void; };

// export default function ProductCard({ title, price, image, onAdd }: Props) {
//   return (
//     <View
//       style={{
//         backgroundColor: '#fff', borderRadius: 16, padding: 10, gap: 8,
//         shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
//         shadowOffset: { width: 0, height: 3 }, elevation: 2,
//       }}
//     >
//       <Image source={{ uri: image }} style={{ width: '100%', height: 140, borderRadius: 12 }} contentFit="cover" transition={100} />
//       <Text numberOfLines={2} style={{ fontSize: 14 }}>{title}</Text>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Text style={{ fontWeight: '600' }}>{price}</Text>
//         <Pressable
//           onPress={onAdd}
//           style={{
//             width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#eee',
//             alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
//           }}
//         >
//           <Ionicons name="cart-outline" size={18} color={colors.tint} />
//         </Pressable>
//       </View>
//     </View>
//   );
// }


import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/color'; // ← change to '@theme/color' if that's your file

type Props = { title: string; price: string; image: string; onAdd: () => void };

const TITLE_FS = 14;
const TITLE_LH = 18;

export default function ProductCard({ title, price, image, onAdd }: Props) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      {/* Square image => uniform height across cards */}
      <Image
        source={{ uri: image }}
        style={{ width: '100%', aspectRatio: 1, borderRadius: 12 }}
        contentFit="cover"
        transition={100}
      />

      {/* Fixed-height title area (2 lines) */}
      <Text
        numberOfLines={2}
        style={{
          fontSize: TITLE_FS,
          lineHeight: TITLE_LH,
          height: TITLE_LH * 2,
          marginTop: 8,
          color: '#111827',
        }}
      >
        {title}
      </Text>

      {/* Price + Add */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Text style={{ fontWeight: '700', color: '#111827' }}>{price}</Text>

        <Pressable
          onPress={onAdd}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#eee',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Ionicons name="cart-outline" size={18} color={colors.tint} />
        </Pressable>
      </View>
    </View>
  );
}
