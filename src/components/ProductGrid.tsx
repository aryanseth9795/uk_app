// // src/components/ProductGrid.tsx
// import React from 'react';
// import { View } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
// import ProductCard from './ProductCard';

// type Item = { id: string; title: string; price: string; image: string };
// type Props = {
//   data: Item[];
//   onAdd: (id: string) => void;
//   onPressItem?: (id: string) => void; // <-- NEW
// };

// export default function ProductGrid({ data, onAdd, onPressItem }: Props) {
//   return (
//     <View style={{ flex: 1 }}>
//       <FlashList
//         data={data}
//         keyExtractor={(i) => i.id}
//         numColumns={2}
//         // For FlashList v1 you may not need estimatedItemSize; remove if TS complains
//         // estimatedItemSize={220}
//         scrollEnabled={false}
//         renderItem={({ item }) => (
//           <View style={{ flex: 1, padding: 8 }}>
//             <ProductCard
//               title={item.title}
//               price={item.price}
//               image={item.image}
//               onAdd={() => onAdd(item.id)}
//               onPress={onPressItem ? () => onPressItem(item.id) : undefined}
//             />
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 8 }}
//       />
//     </View>
//   );
// }
 import React from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ProductCard from './ProductCard';

type Item = { id: string; title: string; price: string; image: string };
type Props = {
  data: Item[];
  onAdd: (id: string) => void;
  onPressItem?: (id: string) => void;
};

export default function ProductGrid({ data, onAdd, onPressItem }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={data}
        keyExtractor={(i) => i.id}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={{ flex: 1, padding: 8 }}>
            <ProductCard
              title={item.title}
              price={item.price}
              image={item.image}
              onAdd={() => onAdd(item.id)}
              onPress={onPressItem ? () => onPressItem(item.id) : undefined}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 8 }}
      />
    </View>
  );
}
