// src/store/index.ts

import {
  configureStore,
  combineReducers,
  type Action,
  type ThunkAction,
  Reducer,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// ================== SERVICES ==================
import { authApi } from "@/redux/services/auth.services";
import { storeApi } from "@/redux/services/stores.services";
import { productApi } from "@/redux/services/products.services";
import { orderApi } from "@/redux/services/orders.services";
import { customersApi } from "@/redux/services/customer.services";
import { usersApi } from "@/redux/services/user.services";
import { restaurantApi } from "@/redux/services/restaurant.services";
import { inventoryApi } from "./services/inventory.services";
import { promotionsApi } from "./services/promotions.services";
import { analyticsApi } from "./services/analytics.services";

// ================== SLICES ==================
import authReducer from "./slices/authSlice";
import leadReducer from "./slices/leadSlice";

// ================== PERSIST CONFIG ==================
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "lead"],
};

// ================== ROOT REDUCER ==================
const rootReducer = combineReducers({
  auth: authReducer,
  lead: leadReducer,
  [authApi.reducerPath]: authApi.reducer,
  [storeApi.reducerPath]: storeApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [customersApi.reducerPath]: customersApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [restaurantApi.reducerPath]: restaurantApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [promotionsApi.reducerPath]: promotionsApi.reducer,
  [analyticsApi.reducerPath]: analyticsApi.reducer,
});

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
) as unknown as Reducer<ReturnType<typeof rootReducer>>;

// ================== STORE ==================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      authApi.middleware,
      storeApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      customersApi.middleware,
      usersApi.middleware,
      restaurantApi.middleware,
      inventoryApi.middleware,
      promotionsApi.middleware,
      analyticsApi.middleware,
    ]),
});

// Enable refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// ================== TYPES ==================
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// ================== EXPORTS ==================
export const persistor = persistStore(store);
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
