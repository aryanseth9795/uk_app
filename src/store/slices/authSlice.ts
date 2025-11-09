// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// // ---- Define a type for User ----
// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address?: string[];
// };

// // ---- Define the auth slice state ----
// export interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   refreshToken: null,
//   status: 'idle',
//   error: null,
// };

// // ---- Async thunks ----
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (payload: { email: string; password: string }, thunkAPI) => {
//     try {
//       // Simulate API call
//       const res = await axios.post('https://dummyapi.com/auth/login', payload);
//       const data = res.data;
//       await AsyncStorage.setItem('accessToken', data.accessToken);
//       await AsyncStorage.setItem('refreshToken', data.refreshToken);
//       await AsyncStorage.setItem('user', JSON.stringify(data.user));
//       return data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.response?.data || { message: 'Login failed' });
//     }
//   }
// );

// export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
//   await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
//   return true;
// });

// // ---- Slice ----
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials(state, action) {
//       const { user, accessToken, refreshToken } = action.payload;
//       state.user = user;
//       state.accessToken = accessToken;
//       state.refreshToken = refreshToken;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = (action.payload as any)?.message;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.accessToken = null;
//         state.refreshToken = null;
//         state.status = 'idle';
//       });
//   },
// });

// export const { setCredentials } = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// // ======================
// // TYPES
// // ======================
// export interface User {
//   id?: string;
//   name?: string;
//   email?: string;
//   phone?: string;
// }

// export interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// // ======================
// // INITIAL STATE
// // ======================
// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   refreshToken: null,
//   status: 'idle',
//   error: null,
// };

// // ======================
// // API BASE URL
// // ======================
// const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api-url.com';

// // ======================
// // REGISTER USER
// // ======================
// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async (
//     payload: {
//       name: string;
//       email: string;
//       phone: string;
//       password: string;
//       confirm_password: string;
//     },
//     thunkAPI
//   ) => {
//     try {
//       const res = await axios.post(`${BASE_URL}/auth/register`, payload);
//       const data = res.data;

//       await AsyncStorage.multiSet([
//         ['accessToken', data.access_token],
//         ['refreshToken', data.refresh_token],
//       ]);

//       return {
//         user: { name: payload.name, email: payload.email, phone: payload.phone },
//         accessToken: data.access_token,
//         refreshToken: data.refresh_token,
//       };
//     } catch (err: any) {
//       console.error('Register Error:', err.response?.data || err.message);
//       return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Register failed');
//     }
//   }
// );

// // ======================
// // LOGIN USER
// // ======================
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (payload: { email: string; password: string }, thunkAPI) => {
//     try {
//       const res = await axios.post(`${BASE_URL}/auth/login`, payload);
//       const data = res.data;

//       await AsyncStorage.multiSet([
//         ['accessToken', data.access_token],
//         ['refreshToken', data.refresh_token],
//       ]);

//       // Optionally fetch user profile using access token
//       const me = await axios.get(`${BASE_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${data.access_token}` },
//       });

//       await AsyncStorage.setItem('user', JSON.stringify(me.data));

//       return {
//         user: me.data,
//         accessToken: data.access_token,
//         refreshToken: data.refresh_token,
//       };
//     } catch (err: any) {
//       console.error('Login Error:', err.response?.data || err.message);
//       return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Login failed');
//     }
//   }
// );

// // ======================
// // LOGOUT USER
// // ======================
// export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
//   await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
//   return true;
// });

// // ======================
// // LOAD STORED USER (PERSISTED LOGIN)
// // ======================
// export const loadStoredUser = createAsyncThunk('auth/loadStoredUser', async () => {
//   const [accessToken, refreshToken, userStr] = await AsyncStorage.multiGet([
//     'accessToken',
//     'refreshToken',
//     'user',
//   ]);

//   if (accessToken[1] && refreshToken[1]) {
//     return {
//       user: userStr[1] ? JSON.parse(userStr[1]) : null,
//       accessToken: accessToken[1],
//       refreshToken: refreshToken[1],
//     };
//   }

//   return { user: null, accessToken: null, refreshToken: null };
// });

// // ======================
// // SLICE
// // ======================
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (
//       state,
//       action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
//     ) => {
//       state.user = action.payload.user;
//       state.accessToken = action.payload.accessToken;
//       state.refreshToken = action.payload.refreshToken;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         Object.assign(state, initialState);
//       })
//       .addCase(loadStoredUser.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//       });
//   },
// });

// export const { setCredentials } = authSlice.actions;
// export default authSlice.reducer;



// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {  routes } from '@services/api';
import { http } from '@services/http';
import { saveTokens, loadTokens, clearTokens } from '@services/tokenStorage';
import type { RootState } from '@store/index';

type LoginDTO = { email: string; password: string };
type RegisterDTO = { name: string; email: string; phone: string; password: string; confirm_password: string };

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  accessExp: number | null;    // ms epoch
  user: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: any;
  hydrated: boolean;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  accessExp: null,
  user: null,
  status: 'idle',
  error: undefined,
  hydrated: false,
  isAuthenticated: false,
};

// Helpers to parse various backend responses
function parseAuthResponse(data: any) {
  // support multiple shapes
  const access =
    data?.access_token ?? data?.accessToken ?? data?.token ?? data?.data?.access_token ?? null;
  const refresh =
    data?.refresh_token ?? data?.refreshToken ?? data?.data?.refresh_token ?? null;
  // seconds or ms:
  const expiresInSec = data?.expires_in ?? data?.access_token_expires_in ?? null;
  let accessExp: number | null = null;
  if (expiresInSec) {
    const sec = Number(expiresInSec);
    if (Number.isFinite(sec)) accessExp = Date.now() + sec * 1000 - 5_000; // 5s early
  }
  return { accessToken: access, refreshToken: refresh, accessExp };
}

// export const hydrateAuth = createAsyncThunk('auth/hydrate', async (_, { rejectWithValue, dispatch }) => {
//   const t = await loadTokens();
//   // if we have access token but it's expired and refresh exists -> try refresh
//   const now = Date.now();
//   if (t.accessToken && t.accessExp && t.accessExp > now) {
//     return { ...t };
//   }
//   if (t.refreshToken) {
//     try {
//       const r = await dispatch(refreshAccessToken()).unwrap();
//       return { accessToken: r.accessToken, refreshToken: r.refreshToken ?? t.refreshToken, accessExp: r.accessExp ?? null };
//     } catch (e) {
//       await clearTokens();
//       return rejectWithValue('refresh-failed');
//     }
//   }
//   return { accessToken: null, refreshToken: null, accessExp: null };
// });
// src/store/slices/authSlice.ts (only the hydrate part)
export const hydrateAuth = createAsyncThunk('auth/hydrate', async (_, { rejectWithValue, dispatch }) => {
  const t = await loadTokens();
  const now = Date.now();

  // If we have access + not expired → use it
  if (t.accessToken && t.accessExp && t.accessExp > now) {
    return { ...t };
  }

  // If we have refresh → try refresh
  if (t.refreshToken) {
    try {
      const r = await dispatch(refreshAccessToken()).unwrap();
      return { accessToken: r.accessToken, refreshToken: r.refreshToken ?? t.refreshToken, accessExp: r.accessExp ?? null };
    } catch {
      // Be gentle in dev: keep the old access token (let interceptor handle 401 later)
      if (t.accessToken) return { ...t };
      // Otherwise, nothing usable
      return rejectWithValue('refresh-failed');
    }
  }

  // No refresh token. Keep access if present and let interceptor handle 401.
  if (t.accessToken) return { ...t };
  return { accessToken: null, refreshToken: null, accessExp: null };
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginDTO, { rejectWithValue }) => {
    try {
      const { data } = await http.post(routes.auth.login, payload);
      const parsed = parseAuthResponse(data);
      if (!parsed.accessToken) throw new Error('No access token received');
      await saveTokens(parsed);
      return parsed;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? e?.message ?? e);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterDTO, { rejectWithValue }) => {
    try {
      const { data } = await http.post(routes.auth.register, payload);
      // Often we don't auto-login on register; change if your API returns tokens
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? e?.message ?? e);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const rt = state.auth.refreshToken;
      if (!rt) throw new Error('No refresh token');

      const { data } = await http.post(routes.auth.refresh, { refresh_token: rt });
      const parsed = parseAuthResponse(data);
      if (!parsed.accessToken) throw new Error('No access token (refresh)');
      await saveTokens(parsed);
      return parsed;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? e?.message ?? e);
    }
  }
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.accessExp = null;
      state.user = null;
      state.isAuthenticated = false;
      clearTokens();
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload ?? null;
    },
  },
  extraReducers: (b) => {
    b.addCase(hydrateAuth.fulfilled, (state, action) => {
      const { accessToken, refreshToken, accessExp } = action.payload as any;
      state.accessToken = accessToken ?? null;
      state.refreshToken = refreshToken ?? null;
      state.accessExp = accessExp ?? null;
      state.isAuthenticated = !!accessToken;
      state.hydrated = true;
    });
    b.addCase(hydrateAuth.rejected, (state) => {
      state.hydrated = true;
      state.isAuthenticated = false;
    });

    b.addCase(loginUser.pending, (state) => {
      state.status = 'loading';
      state.error = undefined;
    });
    b.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.error = undefined;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      state.accessExp = action.payload.accessExp ?? null;
      state.isAuthenticated = true;
    });
    b.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? action.error;
      state.isAuthenticated = false;
    });

    b.addCase(registerUser.pending, (state) => {
      state.status = 'loading';
      state.error = undefined;
    });
    b.addCase(registerUser.fulfilled, (state) => {
      state.status = 'succeeded';
      state.error = undefined;
    });
    b.addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? action.error;
    });

    b.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      state.accessExp = action.payload.accessExp ?? null;
      state.isAuthenticated = true;
    });
    b.addCase(refreshAccessToken.rejected, (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    });
  },
});

export const { logout, setUser } = slice.actions;
export default slice.reducer;
