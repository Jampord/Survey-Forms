import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    toggle: false,
  },
  reducers: {
    setSidebarToggle: (state, action) => {
      state.toggle = action.payload;
    },
  },
});

export const { setSidebarToggle } = sidebarSlice.actions;
export default sidebarSlice.reducer;
