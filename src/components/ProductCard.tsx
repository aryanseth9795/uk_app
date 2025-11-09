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

// import React from 'react';
// import { View, Text, Pressable } from 'react-native';
// import { Image } from 'expo-image';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '@theme/color';

// type Props = {
//   title: string;
//   price: string;
//   image: string;
//   onAdd: () => void;
//   onPress?: () => void;
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

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@theme/color";

type Props = {
  title: string;
  price: number; // selling price (rupees)
  mrp: number; // mrp (rupees)
  image: string;
  onAdd: () => void;
  onPress?: () => void;
};

const asINR = (v: number) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function ProductCard({
  title,
  price,
  mrp,
  image,
  onAdd,
  onPress,
}: Props) {
  const uri =
    image && image.length > 4
      ? image
      : "https://via.placeholder.com/600x600.png?text=No+Image";

  const hasDiscount = mrp > price && mrp > 0;
  const discountPct = hasDiscount
    ? Math.max(0, Math.round(((mrp - price) / mrp) * 100))
    : 0;

  const Card = (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 10,
        gap: 8,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
        height:260,
        alignContent:"center",
        justifyContent:"space-between"
      }}
    >
      <Image
        source={{ uri }}
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 12,
          backgroundColor: "#FAFAFA",
        }}
        contentFit="cover"
        transition={120}
      />

      <Text numberOfLines={2} style={{ fontSize: 13 }}>
        {title}
      </Text>

      {/* Price row like Flipkart: Selling • MRP (struck) • % off */}
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "900" }}>{asINR(price)}</Text>

        {hasDiscount && (
          <>
            <Text
              style={{ color: "#6B7280", textDecorationLine: "line-through" }}
            >
              {asINR(mrp)}
            </Text>
            <Text style={{ color: "#16a34a", fontWeight: "800" }}>
              {discountPct}% off
            </Text>
          </>
        )}
      </View>

      <View style={{ display: "flex", flexDirection: "row",  }}>
        <Pressable
          onPress={onAdd}
          style={{
            width: "95%",
            height: 32,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#eee",
        
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingHorizontal: 4,
            maxWidth: "95%",
          }}
        >
          <Text>Add To Cart</Text>

          <Ionicons name="cart-outline" size={18} color={colors.tint} />
        </Pressable>
      </View>
    </View>
  );

  return onPress ? (
    <Pressable onPress={onPress} android_ripple={{ color: "#E5E7EB" }}>
      {Card}
    </Pressable>
  ) : (
    Card
  );
}
