import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

type User = { uid: string; name: string; email: string; isAdmin?: boolean } | null

type AuthState = {
  user: User
}

const initialState: AuthState = { user: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = authSlice.actions

// Use web storage on client; no-op storage on server to avoid SSR warnings
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null as unknown as string)
    },
    setItem(_key: string, _value: string) {
      return Promise.resolve()
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const persistConfig = { key: 'root', storage, whitelist: ['auth'] as const }

const rootReducer = (state: any, action: any) => ({ auth: authSlice.reducer(state?.auth, action) })

const persistedReducer = persistReducer(persistConfig as any, rootReducer as any)

export const store = configureStore({
  reducer: persistedReducer as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types that include functions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


