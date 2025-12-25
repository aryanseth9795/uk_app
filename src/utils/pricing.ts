// Pricing Utilities
// Handles quantity-based dynamic pricing

import { SellingPrice } from "@api/types";

/**
 * Get the correct price for a variant based on quantity
 * Prices are tiered based on minQuantity
 * Example: [{minQuantity: 1, price: 100}, {minQuantity: 10, price: 90}, {minQuantity: 50, price: 80}]
 *
 * @param sellingPrices Array of selling prices sorted by minQuantity
 * @param quantity The quantity being purchased
 * @returns The price in rupees
 */
export function getPriceForQuantity(
  sellingPrices: SellingPrice[],
  quantity: number
): number {
  if (!sellingPrices || sellingPrices.length === 0) {
    return 0;
  }

  // Sort by minQuantity descending to find the highest applicable tier
  const sorted = [...sellingPrices].sort(
    (a, b) => b.minQuantity - a.minQuantity
  );

  // Find the first tier where quantity >= minQuantity
  const applicableTier = sorted.find((tier) => quantity >= tier.minQuantity);

  if (applicableTier) {
    return applicableTier.price;
  }

  // Fallback to the lowest tier (minQuantity = 1)
  const lowestTier = sellingPrices.sort(
    (a, b) => a.minQuantity - b.minQuantity
  )[0];
  return lowestTier?.price || 0;
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
 * Calculate total price for quantity using tiered pricing
 * @param sellingPrices Array of selling prices with quantity tiers
 * @param quantity Quantity being purchased
 * @returns Object with price per unit and total
 */
export function calculateItemTotal(
  sellingPrices: SellingPrice[],
  quantity: number,
  mrp?: number // Keep for backward compatibility but don't use
) {
  const pricePerUnit = getPriceForQuantity(sellingPrices, quantity);
  const total = pricePerUnit * quantity;

  return {
    pricePerUnit, // Price for one unit at this quantity tier
    total, // Total price for all units
  };
}
