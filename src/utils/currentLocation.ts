import * as Location from "expo-location";
import { mapGeocodeToFields, type GeocodeFields } from "./geocodeFields";

export type LatLng = { lat: number; lng: number };

export type CurrentAddressResult =
  | { ok: true; location: LatLng; fields: GeocodeFields }
  | { ok: false; message: string };

/**
 * Reads the phone's position and turns it into address fields, at no cost:
 * GPS/Wi-Fi/cell positioning is on the device, and reverse geocoding uses
 * Android's built-in geocoder (no API key, no Google Maps billing).
 *
 * Asks for foreground permission only, and only when the customer taps
 * "Use current location". Never throws: every failure becomes a message the
 * form can show while manual entry keeps working.
 */
export async function getCurrentAddress(): Promise<CurrentAddressResult> {
  try {
    const { status, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return {
        ok: false,
        message: canAskAgain
          ? "Location permission was not given. You can type the address instead."
          : "Location is turned off for UR Shop. Allow it in your phone's Settings, or type the address instead.",
      };
    }

    if (!(await Location.hasServicesEnabledAsync())) {
      return {
        ok: false,
        message: "Your phone's location is switched off. Turn it on and try again.",
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    // The geocoder can fail offline or on devices without it; the position is
    // still useful on its own for the delivery check and for the shop.
    let fields: GeocodeFields = {};
    try {
      const [first] = await Location.reverseGeocodeAsync({
        latitude: location.lat,
        longitude: location.lng,
      });
      fields = mapGeocodeToFields(first);
    } catch {
      fields = {};
    }

    return { ok: true, location, fields };
  } catch {
    return {
      ok: false,
      message: "Couldn't get your location. Please try again or type the address.",
    };
  }
}
