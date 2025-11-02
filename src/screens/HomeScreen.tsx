// import React, { useMemo, useState } from 'react';
// import { View, Text, ScrollView } from 'react-native';
// import AppHeader from '@components/AppHeader';
// import CategoryChips from '@components/CategoryChips';
// import ProductGrid from '@components/ProductGrid';
// import { useAppDispatch } from '@store/hooks';
// import { addToCart } from '@store/slices/cartSlice';

// const MOCK = [
//   { id: '1', title: 'Rose Glow Serum', price: '£24.99', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600' },
//   { id: '2', title: 'Effortless Eyeshadow Palette', price: '£38.50', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600' },
//   { id: '3', title: 'Whisper Bloom Perfume', price: '£55.00', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600' },
//   { id: '4', title: 'Deluxe Spa Gift Set', price: '£42.00', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600' },
//   // add more to test scroll
// ];

// export default function HomeScreen() {
//   const [query, setQuery] = useState('');
//   const [cat, setCat] = useState<string | null>(null);
//   const dispatch = useAppDispatch();

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return MOCK.filter(p => (!q || p.title.toLowerCase().includes(q)));
//   }, [query]);

//   return (
//     <>
//       <AppHeader searchValue={query} onSearchChange={setQuery} />
//       <ScrollView
//         // no big top padding needed anymore—the header reserves space
//         contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 10 }}
//       >
//         <View style={{ gap: 8, marginBottom: 16 }}>
//           <Text style={{ fontSize: 16, fontWeight: '700' }}>Categories</Text>
//           <CategoryChips selected={cat} onSelect={setCat} />
//         </View>

//         <View style={{ flex: 1 }}>
//           <ProductGrid
//             data={filtered}
//             onAdd={(id) => dispatch(addToCart({ id }))}
//           />
//         </View>
//       </ScrollView>
//     </>
//   );
// }
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AppHeader from "@components/AppHeader";
import CategoryChips from "@components/CategoryChips";
import PromoCarousel from "@components/PromoCarousel";
import ProductGrid from "@components/ProductGrid";
import { useAppDispatch } from "@store/hooks";
import { addToCart } from "@store/slices/cartSlice";
import { MOCK } from "../dummy/products";
// const MOCK = [
//   {
//     id: "1",
//     title: "Rose Glow Serum",
//     price: "Rs 245",
//     image:
//       "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600",
//   },
//   {
//     id: "2",
//     title: "Effortless Eyeshadow Palette",
//     price: "Rs 385",
//     image:
//       "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600",
//   },
//   {
//     id: "3",
//     title: "Whisper Bloom Perfume",
//     price: "Rs 555",
//     image:
//       "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
//   },
//   {
//     id: "4",
//     title: "Deluxe Spa Gift Set",
//     price: "Rs 425",
//     image:
//       "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600",
//   },
//   // add more items to test scroll
// ];

const SLIDES = [
  {
    id: "s1",
    title: "Winter Glow Sale",
    subtitle: "Up to 40% off on skincare & perfumes",
    ctaText: "Shop now",
    imageUrl:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000",
    onPress: () => console.log("Go to Winter Glow"),
  },
  {
    id: "s2",
    title: "New: Luxe Fragrances",
    subtitle: "Handpicked for festive gifting",
    ctaText: "Explore",
    imageUrl:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000",
    onPress: () => console.log("Go to Fragrances"),
  },
  {
    id: "s3",
    title: "Skincare Starter Kits",
    subtitle: "Derm-approved routines for beginners",
    ctaText: "Build your kit",
    imageUrl:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1000",
    onPress: () => console.log("Go to Kits"),
  },
];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK.filter((p) => !q || p.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <AppHeader searchValue={query} onSearchChange={setQuery} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {/* Categories */}
        <View style={{ marginBottom: 16 }}>
          <CategoryChips selected={cat} onSelect={setCat} />
        </View>

        {/* NEW: Auto carousel banner */}
        <View style={{ marginBottom: 16 }}>
          <PromoCarousel slides={SLIDES} />
        </View>

        {/* Products */}
        <View style={{ flex: 1 }}>
          <ProductGrid
            data={filtered}
            onAdd={(id) => dispatch(addToCart({ id }))}
          />
        </View>
      </ScrollView>
    </>
  );
}
