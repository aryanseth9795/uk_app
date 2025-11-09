import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = { id: string; qty: number };
type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ id: string, qty?: number }>) {
      const { id } = action.payload;
      const found = state.items.find(i => i.id === id);
      if (found) found.qty += 1;
      else state.items.push({ id, qty: 1 });
    },
    removeFromCart(state, action: PayloadAction<{ id: string }>) {
      state.items = state.items.filter(i => i.id !== action.payload.id);
    },
    setQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const it = state.items.find(i => i.id === action.payload.id);
      if (it) it.qty = Math.max(0, action.payload.qty);
      state.items = state.items.filter(i => i.qty > 0);
    },
    clearCart(state) { state.items = []; },
  },
});

export const { addToCart, removeFromCart, setQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
