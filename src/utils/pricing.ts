// Pricing Utilities
// Handles quantity-based dynamic pricing.
//
// NOTE: this logic is duplicated in Consumer/Web/lib/pricing.ts and, in a third
// form, in the backend's order controller. Three implementations of one money
// rule already disagreed in production — see
// review/phase-3-consumer-app/RECOMMENDATION.md for the proposed fix.

import { SellingPrice } from "@api/types";

/**
 * Price per unit for a given quantity, or null when no tier applies.
 *
 * Returns null rather than guessing. The previous fallback was commented
 * "Fallback to the lowest tier (minQuantity = 1)" but actually took the tier
 * with the smallest minQuantity, *whatever that was* — so a bulk-only variant
 * (tiers at 5 and 10) ordered singly displayed the ₹400 five-plus discount
 * while the backend charged MRP. The comment described an assumption the code
 * didn't enforce and the data doesn't guarantee.
 *
 * The backend now rejects an unpriced quantity outright (BE-33). The client's
 * job is to display the price the server will charge; when it can't determine
 * one, it must say so.
 *
 * See review/phase-3-consumer-app/BUG-REPORT.md CA-02.
 *
 * @param sellingPrices Tiered prices for the variant
 * @param quantity The quantity being purchased
 * @returns Price in rupees, or null if no tier covers this quantity
 */
export function getPriceForQuantity(
  sellingPrices: SellingPrice[],
  quantity: number
): number | null {
  if (!sellingPrices || sellingPrices.length === 0) {
    return null;
  }

  // Spread before sorting: sort() is in-place, and this array is owned by the
  // TanStack Query cache — reordering it corrupts data other screens are still
  // reading, and the symptom surfaces far from the cause (CA-03).
  const applicableTier = [...sellingPrices]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((tier) => quantity >= tier.minQuantity);

  return applicableTier ? applicableTier.price : null;
}

/**
 * Format price in Indian Rupees
 * @param priceInRupees Price in rupees
 * @returns Formatted string like ₹1,299
 */
export function formatINR(priceInRupees: number): string {
  return `₹${priceInRupees.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Line total for a quantity. Both fields are null when no tier applies, so
 * callers must render an unavailable state rather than a number.
 */
export function calculateItemTotal(
  sellingPrices: SellingPrice[],
  quantity: number
): { pricePerUnit: number | null; total: number | null } {
  const pricePerUnit = getPriceForQuantity(sellingPrices, quantity);

  return {
    pricePerUnit,
    total: pricePerUnit === null ? null : pricePerUnit * quantity,
  };
}

/**
 * Smallest quantity that can be ordered: the lowest tier's minQuantity.
 *
 * Admin can price a variant in bulk only (e.g. a single "3+ → ₹38" tier). Such
 * a variant has no price at quantity 1 and the backend rejects an order for 1,
 * so its real offer is "₹38 each, minimum 3".
 */
export function getMinOrderQty(sellingPrices: SellingPrice[]): number {
  if (!sellingPrices || sellingPrices.length === 0) return 1;
  return Math.max(1, Math.min(...sellingPrices.map((t) => t.minQuantity)));
}

/**
 * What a product card shows: the per-unit price at the minimum order quantity,
 * plus that minimum so the card can say "Min 3" and Add to Cart can add 3.
 * This is a price the server will actually charge, unlike asking for qty 1.
 */
export function getStartingPrice(sellingPrices: SellingPrice[]): {
  price: number | null;
  minQty: number;
} {
  const minQty = getMinOrderQty(sellingPrices);
  return { price: getPriceForQuantity(sellingPrices, minQty), minQty };
}
