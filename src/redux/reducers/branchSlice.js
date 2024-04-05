import { createSlice } from "@reduxjs/toolkit";

export const branchSlice = createSlice({
  name: "branch",
  initialState: {
    status: true,
    search: "",
  },
  reducers: {
    setBranchStatus: (state, action) => {
      state.status = action.payload;
    },

    setBranchSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setBranchStatus, setBranchSearch } = branchSlice.actions;
export default branchSlice.reducer;
