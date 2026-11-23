import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string; // product ID
  variantId: string; // variant ID
  qty: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{
        id: string;
        variantId: string;
        qty?: number;
        /** Lowest orderable quantity (bulk-only pricing); see getMinOrderQty. */
        minQty?: number;
      }>
    ) {
      const { id, variantId, qty = 1, minQty = 1 } = action.payload;
      const existing = state.items.find(
        (item) => item.id === id && item.variantId === variantId
      );
      // Never leave a line below the minimum: the backend rejects it.
      if (existing) {
        existing.qty = Math.max(existing.qty + qty, minQty);
      } else {
        state.items.push({ id, variantId, qty: Math.max(qty, minQty) });
      }
    },
    removeFromCart(
      state,
      action: PayloadAction<{ id: string; variantId: string }>
    ) {
      const { id, variantId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.variantId === variantId)
      );
    },
    updateQty(
      state,
      action: PayloadAction<{ id: string; variantId: string; qty: number }>
    ) {
      const { id, variantId, qty } = action.payload;
      const existing = state.items.find(
        (item) => item.id === id && item.variantId === variantId
      );
      if (existing) {
        existing.qty = Math.max(1, qty);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
