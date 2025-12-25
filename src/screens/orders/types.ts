// src/screen/orders/types.ts
export type OrderItem = {
  product_id?: string;
  slug?: string;
  name?: string;
  qty: number;
  unit_price_paise?: number;
  thumbnail?: { secure_url?: string; alt?: string };
};

export type Order = {
  id: string;
  status: 'placed' | 'shipped' | 'transit' | 'delivered' | string;
  created_at?: string;            // ISO string
  payment_method?: string;        // e.g. 'COD' | 'UPI' | 'CARD'
  items: OrderItem[];
  totals?: {
    subtotal_paise?: number;
    discount_paise?: number;
    shipping_paise?: number;
    total_paise?: number;
  };
};
