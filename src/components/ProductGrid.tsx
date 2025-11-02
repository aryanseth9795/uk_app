// import { View } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
// import ProductCard from './ProductCard';

// type Item = { id: string; title: string; price: string; image: string };
// type Props = { data: Item[]; onAdd: (id: string) => void };

// export default function ProductGrid({ data, onAdd }: Props) {
//   return (
//     <View style={{ flex: 1 }}>
//       <FlashList
//         data={data}
//         keyExtractor={(i) => i.id}
//         numColumns={2}
//         // estimatedItemSize={220}
//         // allow the list to expand to fit items (so outer ScrollView scrolls)
//         scrollEnabled={false}
//         renderItem={({ item }) => (
//           <View style={{ flex: 1, padding: 8 }}>
//             <ProductCard title={item.title} price={item.price} image={item.image} onAdd={() => onAdd(item.id)} />
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 8 }}
//       />
//     </View>
//   );
// }
import React, { useState, useCallback } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ProductCard from './ProductCard';

type Item = { id: string; title: string; price: string; image: string };
type Props = { data: Item[]; onAdd: (id: string) => void };

const GAP = 12;
const NUM_COLS = 2;

export default function ProductGrid({ data, onAdd }: Props) {
  const [listW, setListW] = useState(0);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setListW(e.nativeEvent.layout.width);
  }, []);

  const CARD_W = listW > 0 ? (listW - GAP * (NUM_COLS - 1)) / NUM_COLS : undefined;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <FlashList
        data={data}
        keyExtractor={(i) => i.id}
        numColumns={NUM_COLS}
        // NOTE: removed estimatedItemSize to satisfy your FlashList typings
        scrollEnabled={false} // outer ScrollView handles scrolling
        contentContainerStyle={{ paddingBottom: 8 }}
        renderItem={({ item, index }) => {
          const isLeft = index % NUM_COLS === 0;
          return (
            <View
              style={{
                width: CARD_W,             // explicit width for perfect columns
                marginRight: isLeft ? GAP : 0,
                marginBottom: GAP,
              }}
            >
              <ProductCard
                title={item.title}
                price={item.price}
                image={item.image}
                onAdd={() => onAdd(item.id)}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 16 }} />
        }
      />
    </View>
  );
}
