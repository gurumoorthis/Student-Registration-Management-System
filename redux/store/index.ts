import {
  configureStore,
  combineReducers,
  type AnyAction,
} from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import AuthReducer from "@/redux/slice/AuthSlice";
import DashboardReducer from "@/redux/slice/DashboardSlice";
import PolicyReducer from "@/redux/slice/PolicySlice";
import StudentSlice from "@/redux/slice/StudentSlice";
import UserSlice from "@/redux/slice/UserSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const appReducer = combineReducers({
  AUTH: AuthReducer,
  DASHBOARD: DashboardReducer,
  STUDENT: StudentSlice,
  POLICY: PolicyReducer,
  USERS: UserSlice,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction
) => {
  if (action.type === "RESET_APP") {
    return appReducer(undefined, { type: "@@INIT" });
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
