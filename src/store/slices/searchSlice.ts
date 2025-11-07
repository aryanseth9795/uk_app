// src/store/slices/searchSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiGetSuggestions, apiSearchProducts } from '../../services/api';

type SearchItem = { id: string; title: string; price: number; image: string; category?: string };

type State = {
  suggest: { items: string[]; status: 'idle' | 'loading' | 'succeeded' | 'failed'; error?: string; lastQuery: string; };
  results: { items: SearchItem[]; status: 'idle' | 'loading' | 'succeeded' | 'failed'; error?: string; lastQuery: string; };
};

const initialState: State = {
  suggest: { items: [], status: 'idle', lastQuery: '' },
  results: { items: [], status: 'idle', lastQuery: '' },
};

export const fetchSearchSuggestions = createAsyncThunk<string[], string>(
  'search/suggest',
  async (q) => {
    const data = await apiGetSuggestions(q); // returns label[]
    return data;
  }
);

export const searchProducts = createAsyncThunk<SearchItem[], string>(
  'search/query',
  async (q) => {
    const data = await apiSearchProducts(q);
    return data;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSuggestions(state) {
      state.suggest.items = [];
      state.suggest.status = 'idle';
      state.suggest.error = undefined;
      state.suggest.lastQuery = '';
    },
    clearResults(state) {
      state.results.items = [];
      state.results.status = 'idle';
      state.results.error = undefined;
      state.results.lastQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchSuggestions.pending, (state, action) => {
        state.suggest.status = 'loading';
        state.suggest.lastQuery = action.meta.arg;
        state.suggest.error = undefined;
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggest.items = action.payload;
        state.suggest.status = 'succeeded';
      })
      .addCase(fetchSearchSuggestions.rejected, (state, action) => {
        state.suggest.status = 'failed';
        state.suggest.error = action.error.message;
      });

    builder
      .addCase(searchProducts.pending, (state, action) => {
        state.results.status = 'loading';
        state.results.lastQuery = action.meta.arg;
        state.results.error = undefined;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.results.items = action.payload;
        state.results.status = 'succeeded';
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.results.status = 'failed';
        state.results.error = action.error.message;
      });
  },
});

export const { clearSuggestions, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
