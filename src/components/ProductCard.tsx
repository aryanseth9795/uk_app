// // import { View, Text, Pressable } from 'react-native';
// // import { Image } from 'expo-image';
// // import { Ionicons } from '@expo/vector-icons';
// // import { colors } from '@theme/color';

// // type Props = { title: string; price: string; image: string; onAdd: () => void; };

// // export default function ProductCard({ title, price, image, onAdd }: Props) {
// //   return (
// //     <View
// //       style={{
// //         backgroundColor: '#fff', borderRadius: 16, padding: 10, gap: 8,
// //         shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 3 }, elevation: 2,
// //       }}
// //     >
// //       <Image source={{ uri: image }} style={{ width: '100%', height: 140, borderRadius: 12 }} contentFit="cover" transition={100} />
// //       <Text numberOfLines={2} style={{ fontSize: 14 }}>{title}</Text>
// //       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
// //         <Text style={{ fontWeight: '600' }}>{price}</Text>
// //         <Pressable
// //           onPress={onAdd}
// //           style={{
// //             width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#eee',
// //             alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
// //           }}
// //         >
// //           <Ionicons name="cart-outline" size={18} color={colors.tint} />
// //         </Pressable>
// //       </View>
// //     </View>
// //   );
// // }


// // src/components/ProductCard.tsx
// import React from 'react';
// import { View, Text, Pressable } from 'react-native';
// import { Image } from 'expo-image';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '@theme/colors';

// type Props = {
//   title: string;
//   price: string;
//   image: string;
//   onAdd: () => void;
//   onPress?: () => void; // <-- NEW
// };

// export default function ProductCard({ title, price, image, onAdd, onPress }: Props) {
//   const uri =
//     image && image.length > 4
//       ? image
//       : 'https://via.placeholder.com/600x600.png?text=No+Image';

//   const Card = (
//     <View
//       style={{
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 10,
//         gap: 8,
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 3 },
//         elevation: 2,
//       }}
//     >
//       <Image
//         source={{ uri }}
//         style={{ width: '100%', aspectRatio: 1, borderRadius: 12 }}
//         contentFit="cover"
//         transition={120}
//       />
//       <Text numberOfLines={2} style={{ fontSize: 14 }}>
//         {title}
//       </Text>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Text style={{ fontWeight: '600' }}>{price}</Text>
//         <Pressable
//           onPress={onAdd}
//           style={{
//             width: 32,
//             height: 32,
//             borderRadius: 8,
//             borderWidth: 1,
//             borderColor: '#eee',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#fff',
//           }}
//         >
//           <Ionicons name="cart-outline" size={18} color={colors.tint} />
//         </Pressable>
//       </View>
//     </View>
//   );

//   return onPress ? (
//     <Pressable onPress={onPress} android_ripple={{ color: '#E5E7EB' }}>
//       {Card}
//     </Pressable>
//   ) : (
//     Card
//   );
// }

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/color';

type Props = {
  title: string;
  price: string;
  image: string;
  onAdd: () => void;
  onPress?: () => void;
};

export default function ProductCard({ title, price, image, onAdd, onPress }: Props) {
  const uri =
    image && image.length > 4
      ? image
      : 'https://via.placeholder.com/600x600.png?text=No+Image';

  const Card = (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        gap: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      <Image
        source={{ uri }}
        style={{ width: '100%', aspectRatio: 1, borderRadius: 12 }}
        contentFit="cover"
        transition={120}
      />
      <Text numberOfLines={2} style={{ fontSize: 14 }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '600' }}>{price}</Text>
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

  return onPress ? (
    <Pressable onPress={onPress} android_ripple={{ color: '#E5E7EB' }}>
      {Card}
    </Pressable>
  ) : (
    Card
  );
}
