import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../redux/reducers/userSlice";
import { api } from "../redux/api/API";
import roleSlice from "../redux/reducers/roleSlice";
import departmentSlice from "../redux/reducers/departmentSlice";
import branchSlice from "../redux/reducers/branchSlice";
import selectedRowSlice from "../redux/reducers/selectedRowSlice";
import groupSlice from "../redux/reducers/groupSlice";
import categorySlice from "../redux/reducers/categorySlice";
import snackbarSlice from "../redux/reducers/snackbarSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    role: roleSlice,
    department: departmentSlice,
    branch: branchSlice,
    group: groupSlice,
    selectedRow: selectedRowSlice,
    category: categorySlice,
    snackbar: snackbarSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([api.middleware]),
});

export default store;
