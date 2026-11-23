import { describe, it, expect } from "vitest";
import reducer, { addToCart } from "./cartSlice";

const empty = { items: [] };

describe("addToCart respects a minimum order quantity", () => {
  // A bulk-only product (lowest tier at 3) cannot be ordered singly: the
  // backend rejects qty 1. Adding it from a card must put the minimum in.
  it("adds the minimum quantity when it is above the requested qty", () => {
    const s = reducer(empty, addToCart({ id: "p", variantId: "v", minQty: 3 }));
    expect(s.items).toEqual([{ id: "p", variantId: "v", qty: 3 }]);
  });

  it("increments an existing line normally once the minimum is met", () => {
    let s = reducer(empty, addToCart({ id: "p", variantId: "v", minQty: 3 }));
    s = reducer(s, addToCart({ id: "p", variantId: "v", minQty: 3 }));
    expect(s.items[0].qty).toBe(4);
  });

  it("raises an existing below-minimum line to the minimum", () => {
    let s = reducer(empty, addToCart({ id: "p", variantId: "v" }));
    s = reducer(s, addToCart({ id: "p", variantId: "v", minQty: 12 }));
    expect(s.items[0].qty).toBe(12);
  });

  it("keeps qty-1 behaviour when there is no minimum", () => {
    const s = reducer(empty, addToCart({ id: "p", variantId: "v" }));
    expect(s.items[0].qty).toBe(1);
  });
});
