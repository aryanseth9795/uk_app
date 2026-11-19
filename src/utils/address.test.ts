import { describe, it, expect } from "vitest";
import { selectDeliveryAddress, toOrderAddress } from "./address";
import type { Address } from "@api/types";

const make = (id: string, extra: Partial<Address> = {}): Address => ({
  _id: id,
  Receiver_Name: `Receiver ${id}`,
  Receiver_MobileNumber: "9876543210",
  Address_Line1: `House ${id}`,
  City: "Jaunpur",
  pincode: "222001",
  label: id,
  ...extra,
});

describe("selectDeliveryAddress", () => {
  const home = make("home");
  const office = make("office");

  it("returns the address the customer chose in the cart", () => {
    expect(selectDeliveryAddress([home, office], "office")).toBe(office);
  });

  it("falls back to the first address when the choice is stale or missing", () => {
    expect(selectDeliveryAddress([home, office], "deleted-id")).toBe(home);
    expect(selectDeliveryAddress([home, office], null)).toBe(home);
  });

  it("returns undefined when there are no addresses", () => {
    expect(selectDeliveryAddress([], "home")).toBeUndefined();
    expect(selectDeliveryAddress(undefined, null)).toBeUndefined();
  });
});

describe("toOrderAddress", () => {
  it("copies the delivery fields and the shared location, without the id", () => {
    const order = toOrderAddress(
      make("home", { Address_Line2: "Near temple", location: { lat: 25.75, lng: 82.69 } }),
    );
    expect(order).toEqual({
      Receiver_Name: "Receiver home",
      Receiver_MobileNumber: "9876543210",
      Address_Line1: "House home",
      Address_Line2: "Near temple",
      City: "Jaunpur",
      pincode: "222001",
      label: "home",
      location: { lat: 25.75, lng: 82.69 },
    });
    expect(order).not.toHaveProperty("_id");
  });

  it("leaves location out when none was shared", () => {
    expect(toOrderAddress(make("home"))).not.toHaveProperty("location");
  });
});
