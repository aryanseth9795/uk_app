

// src/services/tokenStorage.ts
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const K = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  accessExp: 'auth.accessExp', // ms epoch
};

let USE_SECURE = true;

async function secureAvailable() {
  try {
    const ok = await SecureStore.isAvailableAsync();
    return !!ok;
  } catch {
    return false;
  }
}

async function setItem(key: string, value: string) {
  try {
    if (USE_SECURE && (await secureAvailable())) {
      return SecureStore.setItemAsync(key, value, { keychainService: 'uk-ecom-auth' });
    }
    return AsyncStorage.setItem(key, value);
  } catch {
    // fallback to AsyncStorage if SecureStore fails
    USE_SECURE = false;
    return AsyncStorage.setItem(key, value);
  }
}

async function getItem(key: string) {
  try {
    if (USE_SECURE && (await secureAvailable())) {
      const v = await SecureStore.getItemAsync(key, { keychainService: 'uk-ecom-auth' });
      if (v != null) return v;
      // If didn’t find anything under SecureStore (e.g. owner/slug changed), try AsyncStorage namespace too
      const alt = await AsyncStorage.getItem(key);
      return alt;
    }
    return AsyncStorage.getItem(key);
  } catch {
    USE_SECURE = false;
    return AsyncStorage.getItem(key);
  }
}

async function delItem(key: string) {
  try {
    if (USE_SECURE && (await secureAvailable())) {
      await SecureStore.deleteItemAsync(key, { keychainService: 'uk-ecom-auth' });
    }
  } finally {
    await AsyncStorage.removeItem(key);
  }
}

export type StoredTokens = {
  accessToken: string | null;
  refreshToken: string | null;
  accessExp: number | null; // ms epoch
};

export async function saveTokens(t: { accessToken: string; refreshToken?: string | null; accessExp?: number | null }) {
  await setItem(K.accessToken, t.accessToken);
  if (t.refreshToken !== undefined && t.refreshToken !== null) await setItem(K.refreshToken, t.refreshToken);
  if (t.accessExp !== undefined && t.accessExp !== null) await setItem(K.accessExp, String(t.accessExp));
}

export async function loadTokens(): Promise<StoredTokens> {
  const [a, r, e] = await Promise.all([getItem(K.accessToken), getItem(K.refreshToken), getItem(K.accessExp)]);
  return {
    accessToken: a ?? null,
    refreshToken: r ?? null,
    accessExp: e ? Number(e) : null,
  };
}

/**
 * Reads the `exp` claim from a JWT, in milliseconds.
 *
 * Replaces trusting a locally computed `Date.now() + 15min`, which was written
 * in four separate places each commented "Assume 15 min expiry" -- a hardcoded
 * mirror of a backend value that has already changed once. It also drifts with
 * the device clock, and mobile clocks are more often wrong than desktop ones.
 *
 * This is still only a hint: a client can never confirm a token is valid, and
 * since Phase 1 added tokenVersion a token can be revoked while its exp is
 * still in the future. Use it to decide when to refresh, never as proof of a
 * live session.
 *
 * Returns null when absent or unparseable; callers must treat null as expired.
 *
 * Note: React Native has no global atob(), so this decodes via Buffer.
 *
 * See review/phase-3-consumer-app/BUG-REPORT.md CA-07.
 */
export function getTokenExpiry(token: string | null): number | null {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const json = Buffer.from(payload, 'base64').toString('utf8');
    const claims = JSON.parse(json) as { exp?: unknown };

    return typeof claims.exp === 'number' ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

export async function clearTokens() {
  await Promise.all([delItem(K.accessToken), delItem(K.refreshToken), delItem(K.accessExp)]);
}
