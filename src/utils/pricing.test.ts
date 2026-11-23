import { describe, it, expect } from "vitest";
import {
  getPriceForQuantity,
  calculateItemTotal,
  getMinOrderQty,
  getStartingPrice,
} from "./pricing";

const tier = (minQuantity: number, price: number, id: string) =>
  ({ minQuantity, price, _id: id }) as any;

describe("CA-02: no invented price when no tier applies", () => {
  it("returns null instead of a bulk discount the customer hasn't earned", () => {
    // Bulk-only pricing: nothing covers a quantity of 1. The old code took the
    // tier with the smallest minQuantity -- 5 -- and showed its discount price.
    const tiers = [tier(10, 350, "a"), tier(5, 400, "b")];

    expect(getPriceForQuantity(tiers, 1)).toBeNull();
  });

  it("returns the best applicable tier when one exists", () => {
    const tiers = [tier(1, 450, "a"), tier(5, 400, "b")];

    expect(getPriceForQuantity(tiers, 1)).toBe(450);
    expect(getPriceForQuantity(tiers, 4)).toBe(450);
    expect(getPriceForQuantity(tiers, 5)).toBe(400);
    expect(getPriceForQuantity(tiers, 50)).toBe(400);
  });

  it("returns null for empty pricing", () => {
    expect(getPriceForQuantity([], 1)).toBeNull();
  });

  it("propagates null through calculateItemTotal", () => {
    const tiers = [tier(5, 400, "a")];

    expect(calculateItemTotal(tiers, 1)).toEqual({
      pricePerUnit: null,
      total: null,
    });
    expect(calculateItemTotal(tiers, 5)).toEqual({
      pricePerUnit: 400,
      total: 2000,
    });
  });

  it("matches the Consumer Web implementation case for case", () => {
    // Parity check: these are the exact cases in Consumer/Web/lib/pricing.test.ts.
    // Until the two clients share one module, this is what keeps them honest.
    const bulkOnly = [tier(10, 350, "a"), tier(5, 400, "b")];
    const normal = [tier(1, 450, "a"), tier(5, 400, "b")];

    expect(getPriceForQuantity(bulkOnly, 1)).toBeNull();
    expect(getPriceForQuantity(normal, 5)).toBe(400);
    expect(getPriceForQuantity([], 1)).toBeNull();
  });
});

describe("CA-03: the input array is not mutated", () => {
  it("leaves the caller's array order untouched", () => {
    // sort() is in-place. This array belongs to the TanStack Query cache, so
    // reordering it corrupts data other screens are still reading.
    const tiers = [tier(10, 350, "a"), tier(5, 400, "b")];
    const before = tiers.map((t) => t.minQuantity);

    getPriceForQuantity(tiers, 1);
    getPriceForQuantity(tiers, 7);

    expect(tiers.map((t) => t.minQuantity)).toEqual(before);
  });
});

describe("bulk-only products: price at the minimum order quantity", () => {
  // Live data: "Nine Dry Comfort" has only a 3+ tier. Cards asked for the
  // qty-1 price, got null, and showed "Price unavailable" although admin had
  // priced it. Same cases as Consumer/Web/lib/pricing.test.ts.
  const bulkOnly = [tier(6, 43.5, "a"), tier(3, 45, "b")];

  it("minimum order quantity is the lowest tier's minQuantity", () => {
    expect(getMinOrderQty(bulkOnly)).toBe(3);
    expect(getMinOrderQty([tier(1, 10, "a")])).toBe(1);
  });

  it("defaults to 1 when there are no tiers", () => {
    expect(getMinOrderQty([])).toBe(1);
  });

  it("starting price is the price charged at the minimum quantity", () => {
    expect(getStartingPrice(bulkOnly)).toEqual({ price: 45, minQty: 3 });
    expect(getStartingPrice([tier(1, 450, "a"), tier(5, 400, "b")])).toEqual({
      price: 450,
      minQty: 1,
    });
  });

  it("starting price is null only when there is no pricing at all", () => {
    expect(getStartingPrice([])).toEqual({ price: null, minQty: 1 });
  });
});
