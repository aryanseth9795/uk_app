// src/utils/productMapper.ts

export type ProductLite = {
  id: string;
  title: string;
  price: number; // selling price (₹)
  mrp: number; // MRP (₹)
  image: string;
  category?: string;
};

function paiseToRupees(v: any): number {
  const n =
    typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n / 100 : 0;
}

function pickPriceRupees(x: any): number {
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
    (typeof x?.mrp_inr === "string"
      ? Number(x.mrp_inr.replace(/[^\d.]/g, "")) * 100
      : undefined);

  return paiseToRupees(raw);
}

function pickMrpRupees(x: any): number {
  if (Number.isFinite(Number(x?.mrp_paise))) return Number(x.mrp_paise) / 100;
  if (typeof x?.mrp_inr === "string") {
    const n = Number(x.mrp_inr.replace(/[^\d.]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return Math.max(0, pickPriceRupees(x));
}

function pickImageUrl(x: any): string {
  const t = x?.thumbnail;
  if (t?.secureUrl) return String(t.secureUrl);
  const firstImg =
    Array.isArray(x?.images) && x.images.length > 0 ? x.images[0] : null;
  if (firstImg?.secureUrl) return String(firstImg.secureUrl);
  if (x?.image_url) return String(x.image_url);
  if (x?.image) return String(x.image);
  if (x?.thumbnail?.secureUrl) return String(x.thumbnail.secureUrl);
  if (x?.thumbnail?.url) return String(x.thumbnail.secureUrl); // Changed .url to .secureUrl
  return "";
}

export function mapProductLite(x: any): ProductLite {
  const price = pickPriceRupees(x);
  const mrp = pickMrpRupees(x);
  return {
    id: String(x?.id ?? x?.slug ?? x?.id_or_slug ?? ""),
    title: String(x?.name ?? x?.title ?? ""),
    price,
    mrp,
    image: pickImageUrl(x),
    category:
      (Array.isArray(x?.categories) ? x.categories[0] : x?.category) ??
      undefined,
  };
}

export function normalizeProductsList(raw: any): ProductLite[] {
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : [];
  return arr.map(mapProductLite);
}
