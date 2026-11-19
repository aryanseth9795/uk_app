// Pure mapping from the device geocoder's result to the address form's fields.
// Kept free of native imports so it can be unit-tested in Node.

export type GeocodeLike = {
  postalCode?: string | null;
  city?: string | null;
  district?: string | null;
  subregion?: string | null;
  street?: string | null;
  name?: string | null;
};

export type GeocodeFields = { pincode?: string; city?: string; area?: string };

const clean = (s?: string | null) => (s ?? "").trim();

export function mapGeocodeToFields(g: GeocodeLike | undefined): GeocodeFields {
  if (!g) return {};

  const fields: GeocodeFields = {};

  const postal = clean(g.postalCode);
  if (/^\d{6}$/.test(postal)) fields.pincode = postal;

  const city = clean(g.city) || clean(g.subregion) || clean(g.district);
  if (city) fields.city = city;

  // Most specific first; skip blanks and repeats (Android often returns the
  // street again as `name`).
  const parts: string[] = [];
  for (const part of [g.name, g.street, g.district].map(clean)) {
    if (part && !parts.includes(part) && part !== fields.city) parts.push(part);
  }
  if (parts.length) fields.area = parts.join(", ");

  return fields;
}
