// src/screens/address/types.ts
export type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
};
