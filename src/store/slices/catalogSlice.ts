// // src/store/slices/catalogSlice.ts
// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { apiGetProductsList } from '../../services/api';

// export type CatalogItem = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   category?: string;
// };

// type State = {
//   items: CatalogItem[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error?: string;
//   lastFetchedAt?: number;
// };

// const initialState: State = {
//   items: [],
//   status: 'idle',
// };

// export const fetchCatalog = createAsyncThunk<CatalogItem[]>(
//   'catalog/fetchAll',
//   async () => {
//     const data = await apiGetProductsList(); // GET /products
//     return data;
//   }
// );

// const catalogSlice = createSlice({
//   name: 'catalog',
//   initialState,
//   reducers: {
//     clearCatalog(state) {
//       state.items = [];
//       state.status = 'idle';
//       state.error = undefined;
//       state.lastFetchedAt = undefined;
//     },
//     upsertMany(state, action: PayloadAction<CatalogItem[]>) {
//       // Simple upsert merge by id
//       const map = new Map(state.items.map(i => [i.id, i]));
//       action.payload.forEach(p => map.set(p.id, { ...map.get(p.id), ...p }));
//       state.items = Array.from(map.values());
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCatalog.pending, (state) => {
//         state.status = 'loading';
//         state.error = undefined;
//       })
//       .addCase(fetchCatalog.fulfilled, (state, action) => {
//         state.items = action.payload;
//         state.status = 'succeeded';
//         state.lastFetchedAt = Date.now();
//       })
//       .addCase(fetchCatalog.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || 'Failed to load products';
//       });
//   },
// });

// export const { clearCatalog, upsertMany } = catalogSlice.actions;
// export default catalogSlice.reducer;
// src/store/slices/catalogSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiGetProductsLite, apiSearchProductsLite, type ProductLite } from '@services/api';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type CatalogState = {
  items: ProductLite[];
  status: Status;
  error?: any;
  results: ProductLite[];
  resultsStatus: Status;
};

const initialState: CatalogState = {
  items: [],
  status: 'idle',
  error: undefined,
  results: [],
  resultsStatus: 'idle',
};

export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async (params: { page?: number; per_page?: number } | undefined, { rejectWithValue }) => {
    try {
      const data = await apiGetProductsLite(params);
      console.log("Fetched products data:", data);
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? e?.message ?? e);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'catalog/searchProducts',
  async (q: string, { rejectWithValue }) => {
    try {
      const data = await apiSearchProductsLite(q);
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? e?.message ?? e);
    }
  }
);

const slice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    clearResults(state) {
      state.results = [];
      state.resultsStatus = 'idle';
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (state) => {
      state.status = 'loading';
      state.error = undefined;
    });
    b.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductLite[]>) => {
      state.status = 'succeeded';
      state.items = action.payload ?? [];
    });
    b.addCase(fetchProducts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? action.error;
      state.items = [];
    });

    b.addCase(searchProducts.pending, (state) => {
      state.resultsStatus = 'loading';
    });
    b.addCase(searchProducts.fulfilled, (state, action: PayloadAction<ProductLite[]>) => {
      state.resultsStatus = 'succeeded';
      state.results = action.payload ?? [];
    });
    b.addCase(searchProducts.rejected, (state, action) => {
      state.resultsStatus = 'failed';
      state.error = action.payload ?? action.error;
      state.results = [];
    });
  },
});

export const { clearResults } = slice.actions;
export default slice.reducer;
