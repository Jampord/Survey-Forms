import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    fullName: "",
    userName: "",
    roleName: "",
    status: true,
    page: 0,
    rowsPerPage: 10,
    search: "",
  },
  reducers: {
    setUser: (state, action) => {
      const { fullName, userName, roleName } = action.payload;

      state.fullName = fullName;
      state.userName = userName;
      state.roleName = roleName;
    },
    setUserStatus: (state, action) => {
      state.status = action.payload;
    },
    setUserSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setUser, setUserStatus, setUserSearch } = userSlice.actions;
export default userSlice.reducer;
