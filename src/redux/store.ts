import { combineReducers, configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { authApi } from "./services/auth.services";
import { storeApi } from "./services/stores.services";
import { productApi } from "./services/products.services";
import { orderApi } from "./services/orders.services";
import { customersApi } from "./services/customer.services";
import { usersApi } from "./services/user.services";
import { inventoryApi } from "./services/inventory.services";
import { promotionsApi } from "./services/promotions.services";
import { analyticsApi } from "./services/analytics.services";
import authReducer, { signedOut } from "./slices/authSlice";
import cartReducer, { cartCleared } from "./slices/cartSlice";

const apis = [authApi, storeApi, productApi, orderApi, customersApi, usersApi, inventoryApi, promotionsApi, analyticsApi] as const;

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  [authApi.reducerPath]: authApi.reducer,
  [storeApi.reducerPath]: storeApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [customersApi.reducerPath]: customersApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [promotionsApi.reducerPath]: promotionsApi.reducer,
  [analyticsApi.reducerPath]: analyticsApi.reducer,
});

// Only the session and the till's open cart survive a reload; API data is always refetched.
const persistedReducer = persistReducer(
  { key: "vendli", version: 1, storage, whitelist: ["auth", "cart"] },
  rootReducer
) as unknown as typeof rootReducer;

const listener = createListenerMiddleware();

// Nothing cached for one user may be visible to the next person who signs in on this device.
listener.startListening({
  actionCreator: signedOut,
  effect: (_, api) => {
    apis.forEach((a) => api.dispatch(a.util.resetApiState()));
    api.dispatch(cartCleared());
  },
});

// Separate API slices don't share tags, so bridge the invalidations that cross them.
listener.startListening({
  matcher: isAnyOf(
    orderApi.endpoints.createOrder.matchFulfilled,
    orderApi.endpoints.reverseOrder.matchFulfilled,
    orderApi.endpoints.updateOrderStatus.matchFulfilled,
    inventoryApi.endpoints.createTransactions.matchFulfilled,
    productApi.endpoints.restockProduct.matchFulfilled,
    productApi.endpoints.unstockProduct.matchFulfilled,
    productApi.endpoints.bulkProductStockAdjustment.matchFulfilled,
  ),
  effect: (_, api) => {
    api.dispatch(productApi.util.invalidateTags([{ type: "Products", id: "LIST" }, { type: "Products", id: "INVENTORY_LIST" }, { type: "Products", id: "TRANSACTIONS_LIST" }]));
    api.dispatch(inventoryApi.util.invalidateTags([{ type: "Transaction", id: "LIST" }]));
    api.dispatch(storeApi.util.invalidateTags(["Statistics", "SalesStatistics", "Store"]));
    api.dispatch(customersApi.util.invalidateTags(["Customer"]));
  },
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } })
      .prepend(listener.middleware)
      .concat(
        authApi.middleware,
        storeApi.middleware,
        productApi.middleware,
        orderApi.middleware,
        customersApi.middleware,
        usersApi.middleware,
        inventoryApi.middleware,
        promotionsApi.middleware,
        analyticsApi.middleware
      ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
