import { createSlice } from "@reduxjs/toolkit";

const selectedRowSlice = createSlice({
  name: "selectedRow",
  initialState: { selectedRow: null },
  reducers: {
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
  },
});

export const { setSelectedRow } = selectedRowSlice.actions;
export default selectedRowSlice.reducer;
