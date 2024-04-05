import { createSlice } from "@reduxjs/toolkit";

export const departmentSlice = createSlice({
  name: "department",
  initialState: { status: true, page: 0, rowsPerPage: 10, search: "" },
  reducers: {
    setDepartmentStatus: (state, action) => {
      state.status = action.payload;
    },
    setDepartmentSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setDepartmentSearch, setDepartmentStatus } =
  departmentSlice.actions;
export default departmentSlice.reducer;
