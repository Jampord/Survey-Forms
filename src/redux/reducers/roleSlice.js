import { createSlice } from "@reduxjs/toolkit";

export const roleSlice = createSlice({
  name: "role",
  initialState: { status: true, search: "", role: null },
  reducers: {
    setRoleStatus: (state, action) => {
      state.status = action.payload;
    },
    setRoleSearch: (state, action) => {
      state.search = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },

    // setRolePage: (state, action) => {
    //   state.page = action.payload;
    // },
    // setRoleRowsPerPage: (state, action) => {
    //   state.rowsPerPage = action.payload;
    // },
  },
});

export const { setRoleStatus, setRoleSearch, setRole } = roleSlice.actions;
export default roleSlice.reducer;
