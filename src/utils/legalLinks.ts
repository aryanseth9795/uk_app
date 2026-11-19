import { Alert, Linking } from "react-native";

/**
 * The policy pages live on the website so the app, the site and the Google
 * Play listing all point at one copy. Google Play requires the privacy policy
 * to be reachable inside the app as well as from the store listing.
 */
export const WEB_BASE_URL =
  process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://urshop.aryantechie.in";

export const LEGAL_LINKS = {
  privacy: `${WEB_BASE_URL}/privacy`,
  terms: `${WEB_BASE_URL}/terms`,
  returns: `${WEB_BASE_URL}/returns`,
  shipping: `${WEB_BASE_URL}/shipping`,
} as const;

export async function openLegalLink(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Couldn't open the page", `Visit ${url} in your browser.`);
  }
}
