import { describe, it, expect } from "vitest";
import { mapGeocodeToFields } from "./geocodeFields";

describe("mapGeocodeToFields", () => {
  it("maps a full Android geocoder result to form fields", () => {
    expect(
      mapGeocodeToFields({
        postalCode: "222002",
        city: "Jaunpur",
        district: "Jagdishpur",
        subregion: "Jaunpur District",
        street: "Station Road",
        name: "12",
      }),
    ).toEqual({
      pincode: "222002",
      city: "Jaunpur",
      area: "12, Station Road, Jagdishpur",
    });
  });

  it("falls back to subregion, then district, for the city", () => {
    expect(mapGeocodeToFields({ subregion: "Jaunpur" }).city).toBe("Jaunpur");
    expect(mapGeocodeToFields({ district: "Sadar" }).city).toBe("Sadar");
  });

  it("drops a postal code that is not six digits", () => {
    expect(mapGeocodeToFields({ postalCode: "22200" }).pincode).toBeUndefined();
    expect(mapGeocodeToFields({ postalCode: "UP 222" }).pincode).toBeUndefined();
  });

  it("does not repeat a name that equals the street", () => {
    expect(
      mapGeocodeToFields({ street: "Shakarmandi", name: "Shakarmandi" }).area,
    ).toBe("Shakarmandi");
  });

  it("returns nothing for a missing result", () => {
    expect(mapGeocodeToFields(undefined)).toEqual({});
  });
});
