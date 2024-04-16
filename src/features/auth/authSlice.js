import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    fullName: "",
    userName: "",
    roleName: "",
    token: "",
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state, action) => {
      state.token = null;
    },
    setFullName: (state, action) => {
      state.fullName = action.payload;
      localStorage.setItem("fullName", action.payload);
    },
    setRoleName: (state, action) => {
      state.roleName = action.payload;
      localStorage.setItem("roleName", action.payload);
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
      localStorage.setItem("userName", action.payload);
    },
  },
});

export const { setToken, clearToken, setFullName, setRoleName, setUserName } =
  authSlice.actions;
export default authSlice.reducer;
