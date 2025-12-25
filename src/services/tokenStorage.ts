

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

export async function clearTokens() {
  await Promise.all([delItem(K.accessToken), delItem(K.refreshToken), delItem(K.accessExp)]);
}
