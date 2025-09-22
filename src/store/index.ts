import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "./api/auth-api";
import { teacherApi } from "./api/teacher-api";
import authReducer from "./slices/auth-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware, teacherApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
