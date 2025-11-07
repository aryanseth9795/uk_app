// src/store/slices/catalogSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiGetProductsList } from '../../services/api';

export type CatalogItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  category?: string;
};

type State = {
  items: CatalogItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  lastFetchedAt?: number;
};

const initialState: State = {
  items: [],
  status: 'idle',
};

export const fetchCatalog = createAsyncThunk<CatalogItem[]>(
  'catalog/fetchAll',
  async () => {
    const data = await apiGetProductsList(); // GET /products
    return data;
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    clearCatalog(state) {
      state.items = [];
      state.status = 'idle';
      state.error = undefined;
      state.lastFetchedAt = undefined;
    },
    upsertMany(state, action: PayloadAction<CatalogItem[]>) {
      // Simple upsert merge by id
      const map = new Map(state.items.map(i => [i.id, i]));
      action.payload.forEach(p => map.set(p.id, { ...map.get(p.id), ...p }));
      state.items = Array.from(map.values());
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load products';
      });
  },
});

export const { clearCatalog, upsertMany } = catalogSlice.actions;
export default catalogSlice.reducer;
