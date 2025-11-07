// src/store/slices/productSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiGetProductById } from '../../services/api';

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
};

type State = {
  byId: Record<string, Product>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  lastViewedId?: string;
};

const initialState: State = {
  byId: {},
  status: 'idle',
};

export const fetchProductById = createAsyncThunk<Product, string>(
  'product/fetchById',
  async (id) => {
    // dummy API (replace route in api.ts later)
    const data = await apiGetProductById(id);
    return data;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // optional: set last viewed (for analytics / back button restore)
    setLastViewed(state, action: PayloadAction<string | undefined>) {
      state.lastViewedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const p = action.payload;
        state.byId[p.id] = p;
        state.status = 'succeeded';
        state.lastViewedId = p.id;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load product';
      });
  },
});

export const { setLastViewed } = productSlice.actions;
export default productSlice.reducer;
