import type { Address, CreateOrderRequest } from "@api/types";

/**
 * The address the order goes to: the one the customer picked in the cart
 * (primaryAddressId), else the first saved one. Cart and checkout both call
 * this, so what the customer sees is what gets sent. Checkout used to send
 * addresses[0] whatever was picked.
 */
export function selectDeliveryAddress<A extends { _id: string }>(
  addresses: A[] | undefined,
  primaryAddressId: string | null,
): A | undefined {
  if (!addresses || addresses.length === 0) return undefined;
  return addresses.find((a) => a._id === primaryAddressId) ?? addresses[0];
}

/** The address copy stored on the order (no _id; location only if shared). */
export function toOrderAddress(a: Address): CreateOrderRequest["address"] {
  return {
    Receiver_Name: a.Receiver_Name,
    Receiver_MobileNumber: a.Receiver_MobileNumber,
    Address_Line1: a.Address_Line1,
    Address_Line2: a.Address_Line2 || "",
    City: a.City,
    pincode: a.pincode,
    label: a.label,
    ...(a.location ? { location: a.location } : {}),
  };
}
