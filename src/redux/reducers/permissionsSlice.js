import { createSlice } from "@reduxjs/toolkit";

const storedPermissions = JSON.parse(localStorage.getItem("permissions"));

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: { permissions: storedPermissions || [] },
  reducers: {
    setPermissions: (state, action) => {
      localStorage.setItem("permissions", JSON.stringify(action.payload));
      state.permissions = action.payload;
    },
  },
});

export const { setPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
