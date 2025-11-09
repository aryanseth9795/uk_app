// // src/screens/HomeScreen.tsx
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import { View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';

// import SafeScreen from '@components/SafeScreen';
// import AppHeader from '@components/AppHeader';
// import ProductGrid from '@components/ProductGrid';

// import { useAppDispatch, useAppSelector } from '@store/hooks';
// import { fetchCatalog } from '@store/slices/catalogSlice';
// import { addToCart } from '@store/slices/cartSlice';

// const asINR = (v: number) => `Rs ${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

// export default function HomeScreen() {
//   const dispatch = useAppDispatch();

//   // Be defensive in case reducer isn't mounted yet
//   const catalog = useAppSelector((s: any) => s?.catalog);
//   const items = Array.isArray(catalog?.items) ? catalog.items : [];
//   const status: 'idle' | 'loading' | 'succeeded' | 'failed' = catalog?.status ?? 'idle';
//   const error: string | undefined = catalog?.error;

//   useEffect(() => {
//     if (status === 'idle') dispatch(fetchCatalog());
//   }, [status, dispatch]);

//   // pull-to-refresh
//   const [refreshing, setRefreshing] = useState(false);
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await dispatch(fetchCatalog()).unwrap();
//       console.log(await fetchCatalog())
//     } finally {
//       setRefreshing(false);
//     }
//   }, [dispatch]);

//   const gridData = useMemo(
//     () =>
//       items.map((p: any) => ({
//         id: String(p.id),
//         title: String(p.title ?? ''),
//         price: asINR(p.price),
//         image: String(p.image ?? ''),
//       })),
//     [items]
//   );

//   return (
//     // Let AppHeader own the top inset so the gradient fills the status bar
//     <SafeScreen edges={['left', 'right']}>
//       {/* Gradient header with floating search (no props needed) */}
//       <AppHeader   />

//       <ScrollView
//         contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {/* Error bar */}
//         {error ? (
//           <View
//             style={{
//               backgroundColor: '#FFF4F4',
//               borderColor: '#FECACA',
//               borderWidth: 1,
//               padding: 10,
//               borderRadius: 10,
//               marginBottom: 12,
//             }}
//           >
//             <Text style={{ color: '#991B1B', fontWeight: '700' }}>Failed to load products</Text>
//             <Text style={{ color: '#7F1D1D' }}>{error}</Text>
//           </View>
//         ) : null}

//         {/* Initial loader */}
//         {status === 'loading' && gridData.length === 0 ? (
//           <View style={{ paddingVertical: 40, alignItems: 'center' }}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading products…</Text>
//           </View>
//         ) : null}

//         {/* Product grid */}
//         <ProductGrid data={gridData} onAdd={(id) => dispatch(addToCart({ id }))} />
//       </ScrollView>
//     </SafeScreen>
//   );
// }

// src/screens/HomeScreen.tsx
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import { View, ScrollView, RefreshControl, ActivityIndicator, Text, Pressable } from 'react-native';

// import SafeScreen from '@components/SafeScreen';
// import AppHeader from '@components/AppHeader';
// import ProductGrid from '@components/ProductGrid';

// import { useAppDispatch, useAppSelector } from '@store/hooks';
// import { fetchCatalog } from '@store/slices/catalogSlice';
// import { addToCart } from '@store/slices/cartSlice';
// import { fetchSearchSuggestions, searchProducts, clearSuggestions, clearResults } from '@store/slices/searchSlice';

// const asINR = (v: number) => `Rs ${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

// export default function HomeScreen() {
//   const dispatch = useAppDispatch();

//   // Catalog
//   const catalog = useAppSelector((s: any) => s?.catalog);
//   const catItems = Array.isArray(catalog?.items) ? catalog.items : [];
//   const catStatus: 'idle' | 'loading' | 'succeeded' | 'failed' = catalog?.status ?? 'idle';
//   const catError: string | undefined = catalog?.error;

//   // Search state
//   const [query, setQuery] = useState('');
//   const suggest = useAppSelector((s: any) => s?.search?.suggest);
//   const result  = useAppSelector((s: any) => s?.search?.results);

//   const suggestItems: string[] = Array.isArray(suggest?.items) ? suggest.items : [];
//   const suggestLoading = suggest?.status === 'loading';

//   const resultItems = Array.isArray(result?.items) ? result.items : [];
//   const showingResults = query.trim().length > 0 && result?.status === 'succeeded';

//   // Initial catalog load
//   useEffect(() => {
//     if (catStatus === 'idle') dispatch(fetchCatalog());
//   }, [catStatus, dispatch]);

//   // Debounced suggestions on query change
//   useEffect(() => {
//     const q = query.trim();
//     if (!q) {
//       dispatch(clearSuggestions());
//       return;
//     }
//     const t = setTimeout(() => dispatch(fetchSearchSuggestions(q)), 250);
//     return () => clearTimeout(t);
//   }, [query, dispatch]);

//   // Submit search
//   const doSearch = useCallback(() => {
//     const q = query.trim();
//     if (!q) return;
//     dispatch(searchProducts(q));
//   }, [query, dispatch]);

//   // Select from dropdown (labels only)
//   const onPickSuggestion = useCallback(
//     (label: string) => {
//       setQuery(label);
//       dispatch(clearSuggestions());
//       dispatch(searchProducts(label));
//     },
//     [dispatch]
//   );

//   // Pull-to-refresh (refresh catalog; keep results)
//   const [refreshing, setRefreshing] = useState(false);
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await dispatch(fetchCatalog()).unwrap();
//     } finally {
//       setRefreshing(false);
//     }
//   }, [dispatch]);

//   // Data → grid
//   const gridData = useMemo(
//     () =>
//       (showingResults ? resultItems : catItems).map((p: any) => ({
//         id: String(p.id),
//         title: String(p.title ?? ''),
//         price: asINR(p.price),
//         image: String(p.image ?? ''),
//       })),
//     [showingResults, resultItems, catItems]
//   );

//   const clearSearch = () => {
//     setQuery('');
//     dispatch(clearResults());
//     dispatch(clearSuggestions());
//   };

//   return (
//     <SafeScreen edges={['left', 'right']}>
//       {/* Gradient header with floating search and suggestions dropdown */}
//       <AppHeader
//         searchValue={query}
//         onSearchChange={setQuery}
//         onSearchSubmit={doSearch}
//         suggestions={suggestItems}        // labels only
//         suggestionsLoading={suggestLoading}
//         onSelectSuggestion={onPickSuggestion}
//       />

//       <ScrollView
//         contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {/* Results banner */}
//         {showingResults && (
//           <View
//             style={{
//               backgroundColor: '#EEF2FF',
//               borderColor: '#C7D2FE',
//               borderWidth: 1,
//               padding: 10,
//               borderRadius: 10,
//               marginBottom: 12,
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 8,
//             }}
//           >
//             <Text style={{ color: '#3730A3', fontWeight: '700', flex: 1 }}>
//               Results for “{query}”
//             </Text>
//             <Pressable onPress={clearSearch}>
//               <Text style={{ color: '#6F56BF', fontWeight: '800' }}>Clear</Text>
//             </Pressable>
//           </View>
//         )}

//         {/* Error bar (catalog) */}
//         {!showingResults && catError ? (
//           <View
//             style={{
//               backgroundColor: '#FFF4F4',
//               borderColor: '#FECACA',
//               borderWidth: 1,
//               padding: 10,
//               borderRadius: 10,
//               marginBottom: 12,
//             }}
//           >
//             <Text style={{ color: '#991B1B', fontWeight: '700' }}>Failed to load products</Text>
//             <Text style={{ color: '#7F1D1D' }}>{catError}</Text>
//           </View>
//         ) : null}

//         {/* Initial loader (catalog) */}
//         {!showingResults && catStatus === 'loading' && catItems.length === 0 ? (
//           <View style={{ paddingVertical: 40, alignItems: 'center' }}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading products…</Text>
//           </View>
//         ) : null}

//         {/* Product grid */}
//         <ProductGrid data={gridData} onAdd={(id) => dispatch(addToCart({ id }))} />
//       </ScrollView>
//     </SafeScreen>
//   );
// }

// src/screens/HomeScreen.tsx
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import { View, ScrollView, RefreshControl, ActivityIndicator, Text, Pressable } from 'react-native';

// import SafeScreen from '@components/SafeScreen';
// import AppHeader from '@components/AppHeader';
// import ProductGrid from '@components/ProductGrid';

// import { useAppDispatch, useAppSelector } from '@store/hooks';
// import { fetchCatalog } from '@store/slices/catalogSlice';
// import { addToCart } from '@store/slices/cartSlice';
// import { fetchSearchSuggestions, searchProducts, clearSuggestions, clearResults } from '@store/slices/searchSlice';

// const asINR = (v: number) => `Rs ${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

// export default function HomeScreen() {
//   const dispatch = useAppDispatch();

//   // Catalog
//   const catalog = useAppSelector((s: any) => s?.catalog);
//   const catItems = Array.isArray(catalog?.items) ? catalog.items : [];
//   const catStatus: 'idle' | 'loading' | 'succeeded' | 'failed' = catalog?.status ?? 'idle';
//   const catError: string | undefined = catalog?.error;

//   // Search state
//   const [query, setQuery] = useState('');
//   const suggest = useAppSelector((s: any) => s?.search?.suggest);
//   const result  = useAppSelector((s: any) => s?.search?.results);

//   const suggestItems: string[] = Array.isArray(suggest?.items) ? suggest.items : [];
//   const suggestLoading = suggest?.status === 'loading';

//   const resultItems = Array.isArray(result?.items) ? result.items : [];
//   const showingResults = query.trim().length > 0 && result?.status === 'succeeded';

//   // Initial catalog load
//   useEffect(() => {
//     if (catStatus === 'idle') dispatch(fetchCatalog());
//   }, [catStatus, dispatch]);

//   // Debounced suggestions
//   useEffect(() => {
//     const q = query.trim();
//     if (!q) {
//       dispatch(clearSuggestions());
//       return;
//     }
//     const t = setTimeout(() => dispatch(fetchSearchSuggestions(q)), 250);
//     return () => clearTimeout(t);
//   }, [query, dispatch]);

//   // Submit search
//   const doSearch = useCallback(() => {
//     const q = query.trim();
//     if (!q) return;
//     dispatch(searchProducts(q));
//   }, [query, dispatch]);

//   // Pick suggestion (labels only)
//   const onPickSuggestion = useCallback(
//     (label: string) => {
//       setQuery(label);
//       dispatch(clearSuggestions());
//       dispatch(searchProducts(label));
//     },
//     [dispatch]
//   );

//   // Refresh catalog
//   const [refreshing, setRefreshing] = useState(false);
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await dispatch(fetchCatalog()).unwrap();
//     } finally {
//       setRefreshing(false);
//     }
//   }, [dispatch]);

//   // Data → grid
//   const gridData = useMemo(
//     () =>
//       (showingResults ? resultItems : catItems).map((p: any) => ({
//         id: String(p.id),
//         title: String(p.title ?? ''),
//         price: asINR(p.price),
//         image: String(p.image ?? ''),
//       })),
//     [showingResults, resultItems, catItems]
//   );

//   const clearSearch = () => {
//     setQuery('');
//     dispatch(clearResults());
//     dispatch(clearSuggestions());
//   };

//   return (
//     <SafeScreen edges={['left', 'right']}>
//       {/* 👇 Header sits in its own high layer */}
//       <View style={{ zIndex: 100, elevation: 100 }}>
//         <AppHeader
//           searchValue={query}
//           onSearchChange={setQuery}
//           onSearchSubmit={doSearch}
//           suggestions={suggestItems}         // labels only
//           suggestionsLoading={suggestLoading}
//           onSelectSuggestion={onPickSuggestion}
//         />
//       </View>

//       {/* 👇 Product list stays below header layer */}
//       <ScrollView
//         style={{ zIndex: 0 }} // ensure grid is a lower layer than header/overlay
//         contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
//         keyboardShouldPersistTaps="handled"
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {/* Results banner */}
//         {showingResults && (
//           <View
//             style={{
//               backgroundColor: '#EEF2FF',
//               borderColor: '#C7D2FE',
//               borderWidth: 1,
//               padding: 10,
//               borderRadius: 10,
//               marginBottom: 12,
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 8,
//             }}
//           >
//             <Text style={{ color: '#3730A3', fontWeight: '700', flex: 1 }}>
//               Results for “{query}”
//             </Text>
//             <Pressable onPress={clearSearch}>
//               <Text style={{ color: '#6F56BF', fontWeight: '800' }}>Clear</Text>
//             </Pressable>
//           </View>
//         )}

//         {/* Error bar (catalog) */}
//         {!showingResults && catError ? (
//           <View
//             style={{
//               backgroundColor: '#FFF4F4',
//               borderColor: '#FECACA',
//               borderWidth: 1,
//               padding: 10,
//               borderRadius: 10,
//               marginBottom: 12,
//             }}
//           >
//             <Text style={{ color: '#991B1B', fontWeight: '700' }}>Failed to load products</Text>
//             <Text style={{ color: '#7F1D1D' }}>{catError}</Text>
//           </View>
//         ) : null}

//         {/* Initial loader (catalog) */}
//         {!showingResults && catStatus === 'loading' && catItems.length === 0 ? (
//           <View style={{ paddingVertical: 40, alignItems: 'center' }}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading products…</Text>
//           </View>
//         ) : null}

//         {/* Product grid */}
//         <ProductGrid data={gridData} onAdd={(id) => dispatch(addToCart({ id }))} />
//       </ScrollView>
//     </SafeScreen>
//   );
// }

// import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
// import {
//   View,
//   ScrollView,
//   RefreshControl,
//   ActivityIndicator,
//   Text,
//   Pressable,
//   Keyboard,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// import SafeScreen from '@components/SafeScreen';
// import AppHeader from '@components/AppHeader';
// import ProductGrid from '@components/ProductGrid';

// import { useAppDispatch, useAppSelector } from '@store/hooks';
// import { fetchCatalog } from '@store/slices/catalogSlice';
// import { addToCart } from '@store/slices/cartSlice';
// import {
//   fetchSearchSuggestions,
//   searchProducts,
//   clearSuggestions,
//   clearResults,
// } from '@store/slices/searchSlice';

// const asINR = (v: number) =>
//   `Rs ${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

// export default function HomeScreen() {
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<any>();

//   // Catalog state
//   const catalog = useAppSelector((s: any) => s?.catalog);
//   const catItems = Array.isArray(catalog?.items) ? catalog.items : [];
//   const catStatus: 'idle' | 'loading' | 'succeeded' | 'failed' = catalog?.status ?? 'idle';
//   const catError: string | undefined = catalog?.error;

//   // Search state
//   const [query, setQuery] = useState('');
//   const [isShowingResults, setIsShowingResults] = useState(false); // <-- drives which list to show

//   const suggest = useAppSelector((s: any) => s?.search?.suggest);
//   const result = useAppSelector((s: any) => s?.search?.results);

//   const suggestItems: string[] = Array.isArray(suggest?.items) ? suggest.items : [];
//   const suggestLoading = suggest?.status === 'loading';
//   const resultItems = Array.isArray(result?.items) ? result.items : [];
//   const lastQuery: string | undefined = result?.lastQuery;

//   // Load catalog once
//   useEffect(() => {
//     if (catStatus === 'idle') dispatch(fetchCatalog());
//   }, [catStatus, dispatch]);

//   // Debounced suggestions (only when typing)
//   useEffect(() => {
//     const q = query.trim();
//     if (!q) {
//       dispatch(clearSuggestions());
//       return;
//     }
//     const t = setTimeout(() => dispatch(fetchSearchSuggestions(q)), 250);
//     return () => clearTimeout(t);
//   }, [query, dispatch]);

//   // Ensure a suggestion click only fires search ONCE
//   const searchLock = useRef(false);
//   const runSearchOnce = useCallback(
//     async (q: string) => {
//       if (searchLock.current) return;
//       searchLock.current = true;
//       try {
//         await dispatch(searchProducts(q));
//         setIsShowingResults(true);
//       } finally {
//         // release on next tick to avoid double-dispatch in Strict Mode press
//         setTimeout(() => {
//           searchLock.current = false;
//         }, 0);
//       }
//     },
//     [dispatch]
//   );

//   // Keyboard submit (from SearchBar arrow / return key)
//   const doSearch = useCallback(() => {
//     const q = query.trim();
//     if (!q) return;
//     Keyboard.dismiss();
//     runSearchOnce(q);
//   }, [query, runSearchOnce]);

//   // Pick a suggestion:
//   // 1) Clear input (so overlay closes)
//   // 2) Clear suggestions
//   // 3) Run search exactly once
//   const onPickSuggestion = useCallback(
//     (label: string) => {
//       Keyboard.dismiss();
//       setQuery('');                // <-- reset input to blank
//       dispatch(clearSuggestions()); // <-- hide dropdown
//       runSearchOnce(label);         // <-- single search call
//     },
//     [dispatch, runSearchOnce]
//   );

//   // Pull-to-refresh for catalog (doesn't touch results)
//   const [refreshing, setRefreshing] = useState(false);
//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       await dispatch(fetchCatalog()).unwrap();
//     } finally {
//       setRefreshing(false);
//     }
//   }, [dispatch]);

//   // Decide which list to show
//   const gridData = useMemo(
//     () =>
//       (isShowingResults ? resultItems : catItems).map((p: any) => ({
//         id: String(p.id),
//         title: String(p.title ?? ''),
//         price: asINR(p.price),
//         image: String(p.image ?? ''),
//       })),
//     [isShowingResults, resultItems, catItems]
//   );

//   // Clear results and go back to catalog
//   const clearSearch = () => {
//     setIsShowingResults(false);
//     dispatch(clearResults());
//     dispatch(clearSuggestions());
//     setQuery('');
//   };

//   return (
//     <SafeScreen edges={['left', 'right']}>
//       {/* Header in higher layer to keep suggestions overlay above the grid */}
//       <View style={{ zIndex: 100, elevation: 100 }}>
//         <AppHeader
//           searchValue={query}
//           onSearchChange={setQuery}
//           onSearchSubmit={doSearch}
//           suggestions={suggestItems}
//           suggestionsLoading={suggestLoading}
//           onSelectSuggestion={onPickSuggestion}
//         />
//       </View>

//       <ScrollView
//         style={{ zIndex: 0 }}
//         contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
//         keyboardShouldPersistTaps="handled"
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {/* Results banner — shows lastQuery even if input is blank */}
//         {isShowingResults && !!lastQuery && (
//           <View
//             style={{
//               backgroundColor: '#EEF2FF',
//               borderColor: '#C7D2FE',
//               borderWidth: 1,
//               padding: 10,
//               borderRadius: 10,
//               marginBottom: 12,
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 8,
//             }}
//           >
//             <Text style={{ color: '#3730A3', fontWeight: '700', flex: 1 }}>
//               Results for “{lastQuery}”
//             </Text>
//             <Pressable onPress={clearSearch}>
//               <Text style={{ color: '#6F56BF', fontWeight: '800' }}>Clear</Text>
//             </Pressable>
//           </View>
//         )}

//         {/* Error bar (catalog) */}
//         {!isShowingResults && catError ? (
//           <View
//             style={{
//               backgroundColor: '#FFF4F4',
//               borderColor: '#FECACA',
//               borderWidth: 1,
//               padding: 10,
//               borderRadius: 10,
//               marginBottom: 12,
//             }}
//           >
//             <Text style={{ color: '#991B1B', fontWeight: '700' }}>Failed to load products</Text>
//             <Text style={{ color: '#7F1D1D' }}>{catError}</Text>
//           </View>
//         ) : null}

//         {/* Initial loader (catalog) */}
//         {!isShowingResults && catStatus === 'loading' && catItems.length === 0 ? (
//           <View style={{ paddingVertical: 40, alignItems: 'center' }}>
//             <ActivityIndicator />
//             <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading products…</Text>
//           </View>
//         ) : null}

//         {/* Grid */}
//         <ProductGrid
//           data={gridData}
//           onAdd={(id) => dispatch(addToCart({ id }))}
//           onPressItem={(id) => navigation.navigate('ProductDetail', { id })}
//         />
//       </ScrollView>
//     </SafeScreen>
//   );
// }

// src/screens/HomeScreen.tsx
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Pressable,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import SafeScreen from "@components/SafeScreen";
import AppHeader from "@components/AppHeader";
import ProductGrid from "@components/ProductGrid";

import { useAppDispatch, useAppSelector } from "@store/hooks";
// import { fetchCatalog } from '@store/slices/catalogSlice';
import { fetchProducts } from "@store/slices/catalogSlice";
import { addToCart } from "@store/slices/cartSlice";
import {
  fetchSearchSuggestions,
  searchProducts,
  clearSuggestions,
  clearResults,
} from "@store/slices/searchSlice";
// import PromoBanner from "@/components/PromoCarousel";
import CategoryChips from "@/components/CategoryChips";
import PromoCarousel from "@/components/PromoCarousel";

const asINR = (v: number) =>
  `Rs ${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  // Catalog
  const catalog = useAppSelector((s: any) => s?.catalog);
  const catItems = Array.isArray(catalog?.items) ? catalog.items : [];
  const catStatus: "idle" | "loading" | "succeeded" | "failed" =
    catalog?.status ?? "idle";
  const catError: string | undefined = catalog?.error;

  // Typing value
  const [query, setQuery] = useState("");

  // Active selected query (chip in SearchBar)
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  // Suggestions & results
  const suggest = useAppSelector((s: any) => s?.search?.suggest);
  const result = useAppSelector((s: any) => s?.search?.results);
  const suggestItems: string[] = Array.isArray(suggest?.items)
    ? suggest.items
    : [];
  const suggestLoading = suggest?.status === "loading";
  const resultItems = Array.isArray(result?.items) ? result.items : [];
  const [cat, setCat] = useState<string | null>(null);

  // Load catalog
  useEffect(() => {
    if (catStatus === "idle") {dispatch(fetchProducts())
      // console.log("Fetching products for catalog");
    }
  
  }, [catStatus, dispatch]);

  // Debounced suggestions while typing only (no overlay when a label is active)
  useEffect(() => {
    if (activeQuery) return; // skip suggestions when label is active
    const q = query.trim();
    if (!q) {
      dispatch(clearSuggestions());
      return;
    }
    const t = setTimeout(() => dispatch(fetchSearchSuggestions(q)), 250);
    return () => clearTimeout(t);
  }, [query, activeQuery, dispatch]);

  // Single-dispatch lock
  const searchLock = useRef(false);
  const runSearchOnce = useCallback(
    async (q: string) => {
      if (searchLock.current) return;
      searchLock.current = true;
      try {
        await dispatch(searchProducts(q));
        setActiveQuery(q); // set chip label
      } finally {
        setTimeout(() => {
          searchLock.current = false;
        }, 0);
      }
    },
    [dispatch]
  );

  // Submit from keyboard
  const doSearch = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    Keyboard.dismiss();
    setQuery(""); // clear input
    dispatch(clearSuggestions()); // hide overlay
    runSearchOnce(q); // runs once & sets activeQuery
  }, [query, dispatch, runSearchOnce]);

  // Pick suggestion
  const onPickSuggestion = useCallback(
    (label: string) => {
      Keyboard.dismiss();
      setQuery(""); // clear input
      dispatch(clearSuggestions()); // hide overlay
      runSearchOnce(label); // runs once & sets activeQuery
    },
    [dispatch, runSearchOnce]
  );

  // Clear chip + results
  const clearSearch = useCallback(() => {
    setActiveQuery(null);
    setQuery("");
    dispatch(clearResults());
    dispatch(clearSuggestions());
  }, [dispatch]);

  // Pull-to-refresh on catalog
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchProducts()).unwrap();
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Decide what to show
  const showingResults = !!activeQuery;
  const gridData = useMemo(
    () =>
      (showingResults ? resultItems : catItems).map((p: any) => ({
        id: String(p.id),
        title: String(p.title ?? ""),
        price: Number(p.price ?? 0), // ← numbers
        mrp: Number(p.mrp ?? p.price ?? 0),
        image: String(p.image ?? ""),
      })),
    [showingResults, resultItems, catItems]
  );

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

  console.log("HomeScreen rendered with cat:", cat);
  console.log("HomeScreen rendered with gridData:", gridData);

  return (
    <SafeScreen edges={["left", "right"]}>
      {/* Header layer (overlay above grid) */}
      <View style={{ zIndex: 100, elevation: 100 }}>
        <AppHeader
          searchValue={query}
          onSearchChange={setQuery}
          onSearchSubmit={doSearch}
          activeLabel={activeQuery}
          onClearActive={clearSearch}
          suggestions={suggestItems}
          suggestionsLoading={suggestLoading}
          onSelectSuggestion={onPickSuggestion}
        />
      </View>

      <ScrollView
        style={{ zIndex: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Optional: you can keep/remove this status strip */}
        {showingResults && activeQuery && (
          <View
            style={{
              backgroundColor: "#EEF2FF",
              borderColor: "#C7D2FE",
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ color: "#3730A3", fontWeight: "700", flex: 1 }}>
              Showing results for “{activeQuery}”
            </Text>
            <Pressable onPress={clearSearch}>
              <Text style={{ color: "#6F56BF", fontWeight: "800" }}>Clear</Text>
            </Pressable>
          </View>
        )}
        <View style={{ marginBottom: 16 }}>
          <CategoryChips selected={cat} onSelect={setCat} />
        </View>
        <View style={{ marginBottom: 16 }}>
          <PromoCarousel slides={SLIDES} />
        </View>
        <ProductGrid
          data={gridData}
          onAdd={(id) => dispatch(addToCart({ id }))}
          onPressItem={(id) => navigation.navigate("ProductDetail", { id })}
        />
      </ScrollView>
    </SafeScreen>
  );
}
