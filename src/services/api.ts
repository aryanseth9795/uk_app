// // src/services/api.ts
// import axios from 'axios';

// const BASE_URL = 'http://192.168.1.12:3000'; // TODO: replace with your backend

// export const http = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
// });

// // Centralize routes so you can change them easily later
// export const routes = {
//   product:  (id: string) => `/products/${id}`,                           // GET single
//   products: () => `/products`,                                           // GET list  <-- added
//   suggest:  (q: string) => `/search/suggest?q=${encodeURIComponent(q)}`, // GET suggestions
//   search:   (q: string) => `/search?q=${encodeURIComponent(q)}`,         // GET results
// };

// // --- API functions (used by thunks) ---
// export async function apiGetProductById(id: string) {
//   const { data } = await http.get(routes.product(id));
//   return data as {
//     id: string; title: string; price: number; image: string; description?: string; category?: string;
//   };
// }

// export async function apiGetProductsList() {
//   const { data } = await http.get(routes.products());
//   return data as Array<{ id: string; title: string; price: number; image: string; category?: string }>;
// }

// export async function apiGetSuggestions(q: string) {
//   const { data } = await http.get(routes.suggest(q));
//   return data as string[]; // e.g. ["serum", "rose serum", ...]
// }

// export async function apiSearchProducts(q: string) {
//   const { data } = await http.get(routes.search(q));
//   return data as Array<{ id: string; title: string; price: number; image: string; category?: string }>;
// }
// src/services/api.ts
// import axios from 'axios';

// // const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string | undefined;
// // if (!BASE_URL) {
// //   // Fail fast so you see a clear message in the UI/logs
// //   console.error(
// //     '[API] EXPO_PUBLIC_API_URL is not set. Configure it to your backend base URL.'
// //   );
// // }

// // export const http = axios.create({
// //   baseURL: BASE_URL || 'http://localhost:3000', // harmless default; set EXPO_PUBLIC_API_URL for real builds
// //   timeout: 15000,
// // });

// // Centralize routes so swapping paths later is easy
// export const routes = {
//   product:  (id: string) => `/products/${id}`,                           // GET single
//   products: () => `/products`,                                           // GET list (paginated)
//   suggest:  (q: string) => `/search/suggest?q=${encodeURIComponent(q)}`, // GET suggestions
//   search:   (q: string) => `/search?q=${encodeURIComponent(q)}`,         // GET results (may be paginated)
// };

// // ---------- helpers ----------
// export type ProductLite = {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
//   category?: string;
// };

// function toNumber(v: any): number {
//   if (typeof v === 'number') return v;
//   if (typeof v === 'string') {
//     const n = Number(v.replace?.(/[^\d.]/g, '') ?? v);
//     return Number.isFinite(n) ? n : 0;
//   }
//   return 0;
// }

// function mapProduct(x: any): ProductLite {
//   return {
//     id: String(x?.id ?? ''),
//     title: String(x?.title ?? x?.name ?? ''),
//     price: toNumber(x?.price),
//     image: String(x?.image ?? x?.image_url ?? x?.thumbnail ?? x?.thumb ?? ''),
//     category: x?.category ?? x?.type ?? undefined,
//   };
// }

// function normalizeList(raw: any): ProductLite[] {
//   // Support: [ ... ] or { data: [...] } or { items: [...] }
//   const arr = Array.isArray(raw)
//     ? raw
//     : Array.isArray(raw?.data)
//     ? raw.data
//     : Array.isArray(raw?.items)
//     ? raw.items
//     : [];
//   return arr.map(mapProduct);
// }

// // ---------- REAL IMPLEMENTATION ----------
// export async function apiGetProductById(id: string) {
//   const { data } = await http.get(routes.product(id));
//   return mapProduct(data);
// }

// /**
//  * GET /products with optional pagination params.
//  * Returns a **plain array** of normalized products.
//  * If your backend returns { data, meta }, we strip to `data` here.
//  */
// export async function apiGetProductsList(params?: { page?: number; perPage?: number }) {
//   const { page, perPage } = params || {};
//   const { data } = await http.get(routes.products(), {
//     params: { page, per_page: perPage },
//   });
//   return normalizeList(data);
// }

// export async function apiGetSuggestions(q: string) {
//   const { data } = await http.get(routes.suggest(q));
//   // expect string[]; fall back to deriving strings if backend returns objects
//   if (Array.isArray(data) && data.every((s) => typeof s === 'string')) return data as string[];
//   return normalizeList(data).map((p) => p.title);
// }

// export async function apiSearchProducts(q: string) {
//   const { data } = await http.get(routes.search(q));
//   return normalizeList(data);
// }
// src/services/api.ts
// src/services/api.ts
import axios from 'axios';

// const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string | "http://192.168.1.13:3000";
const BASE_URL="http://192.168.1.13:3000"
console.log(BASE_URL)
if (!BASE_URL) {
  console.error('[API] EXPO_PUBLIC_API_URL is not set. Configure it to your backend base URL.');
}

export const http = axios.create({
  baseURL: BASE_URL || 'http://192.168.1.13:3000',
  timeout: 15000,
});

// Centralize routes
export const routes = {
  product:  (id: string) => `/products/${id}`,                           // GET single product
  products: () => `/products`,                                           // GET list (may be paginated)
  suggest:  (q: string) => `/search/suggest?q=${encodeURIComponent(q)}`, // GET suggestions
  search:   (q: string) => `/search?q=${encodeURIComponent(q)}`,         // GET results (may be paginated)
};

// ---------- helpers ----------
export type ProductLite = {
  id: string;
  title: string;
  price: number;   // rupees as number
  image: string;   // absolute URL
  category?: string;
};

function paiseToRupees(v: any): number {
  const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n / 100 : 0;
}

function pickPriceRupees(x: any): number {
  // Prefer unit price where min_qty === 1, else smallest tier, else MRP, else 0
  const tiers = Array.isArray(x?.pricing_tiers) ? x.pricing_tiers : [];
  const tier1 = tiers.find((t: any) => t?.min_qty === 1)?.unit_price_paise;
  const minTier = tiers.reduce((acc: number | null, t: any) => {
    const v = Number(t?.unit_price_paise ?? NaN);
    if (!Number.isFinite(v)) return acc;
    return acc === null ? v : Math.min(acc, v);
  }, null);

  const raw =
    tier1 ??
    minTier ??
    x?.mrp_paise ??
    // last resort: parse "₹399.00"
    (typeof x?.mrp_inr === 'string' ? Number(x.mrp_inr.replace(/[^\d.]/g, '')) * 100 : undefined);

  return paiseToRupees(raw);
}

function pickImageUrl(x: any): string {
  // thumbnail.secure_url → images[0].secure_url → common fallbacks
  const t = x?.thumbnail;
  if (t?.secure_url) return String(t.secure_url);
  const firstImg = Array.isArray(x?.images) && x.images.length > 0 ? x.images[0] : null;
  if (firstImg?.secure_url) return String(firstImg.secure_url);
  if (x?.image_url) return String(x.image_url);
  if (x?.image) return String(x.image);
  if (x?.thumbnail?.url) return String(x.thumbnail.url);
  return ''; // handled in ProductCard with a placeholder
}

function mapProduct(x: any): ProductLite {
  return {
    id: String(x?.id ?? x?.slug ?? x?.id_or_slug ?? ''),
    title: String(x?.name ?? x?.title ?? ''),
    price: pickPriceRupees(x),
    image: pickImageUrl(x),
    category: (Array.isArray(x?.categories) ? x.categories[0] : x?.category) ?? undefined,
  };
}

function normalizeList(raw: any): ProductLite[] {
  // Accept [ ... ] or { data: [...] } or { items: [...] }
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : [];
  return arr.map(mapProduct);
}

// ---------- APIs ----------
export async function apiGetProductById(id: string) {
  const { data } = await http.get(routes.product(id));
  return mapProduct(data);
}

export async function apiGetProductsList(params?: { page?: number; perPage?: number }) {
  const { page, perPage } = params || {};
  const { data } = await http.get(routes.products(), { params: { page, per_page: perPage } });
  return normalizeList(data);
}

// suggestions returns string[] (labels only)
type SuggestionDTO = { type?: string; label?: string; id_or_slug?: string };

export async function apiGetSuggestions(q: string) {
  const { data } = await http.get(routes.suggest(q));
  if (Array.isArray(data) && data.every((s) => typeof s === 'string')) return data as string[];
  if (Array.isArray(data)) {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const it of data as SuggestionDTO[]) {
      const lbl = String(it?.label ?? '').trim();
      if (!lbl || seen.has(lbl)) continue;
      seen.add(lbl);
      out.push(lbl);
      if (out.length >= 10) break;
    }
    return out;
  }
  return [];
}

export async function apiSearchProducts(q: string) {
  const { data } = await http.get(routes.search(q));
  return normalizeList(data);
}
