import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    search: "",
    status: true,
  },
  reducers: {
    setCategoryStatus: (state, action) => {
      state.status = action.payload;
    },
    setCategorySearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setCategorySearch, setCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
