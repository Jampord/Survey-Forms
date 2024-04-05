import { createSlice } from "@reduxjs/toolkit";

export const groupSlice = createSlice({
  name: "group",
  initialState: {
    status: true,
    page: 0,
    rowsPerPage: 10,
    search: "",
  },
  reducers: {
    setGroupStatus: (state, action) => {
      state.status = action.payload;
    },
    setGroupSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setGroupSearch, setGroupStatus } = groupSlice.actions;
export default groupSlice.reducer;
