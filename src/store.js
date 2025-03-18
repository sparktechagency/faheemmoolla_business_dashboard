import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import idReducer from "./features/ids/idSlice"; // Import the ID slice
import { authApi } from "./features/auth/authApi";
import { shopApi } from "./features/shop/shopApi";
import { mealApi } from "./features/meal/mealApi";
import { offerApi } from "./features/offer/offerApi";

const apis = [authApi, shopApi, mealApi, offerApi];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ids: idReducer, // Add the ID slice to store
    ...Object.fromEntries(apis.map((api) => [api.reducerPath, api.reducer])),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.map((api) => api.middleware)),
});
