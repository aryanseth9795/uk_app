// Address Slice - Primary Address ID Management with Persistence
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ===================================
// STATE TYPES
// ===================================

export type AddressState = {
  primaryAddressId: string | null;
};

const initialState: AddressState = {
  primaryAddressId: null,
};

// ===================================
// ADDRESS SLICE
// ===================================

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // Set primary address ID
    setPrimaryAddressId(state, action: PayloadAction<string | null>) {
      state.primaryAddressId = action.payload;
    },

    // Clear primary address ID (called on logout)
    clearPrimaryAddressId(state) {
      state.primaryAddressId = null;
    },
  },
});

export const { setPrimaryAddressId, clearPrimaryAddressId } =
  addressSlice.actions;
export default addressSlice.reducer;
