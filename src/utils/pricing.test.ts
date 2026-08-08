import { describe, it, expect } from "vitest";
import { getPriceForQuantity, calculateItemTotal } from "./pricing";

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
