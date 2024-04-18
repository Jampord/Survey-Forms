import { createSlice } from "@reduxjs/toolkit";
import { decryptToken } from "../tokenService";

const storedToken = decryptToken(localStorage.getItem("encryptedToken"));
const storedFullname = localStorage.getItem("fullName");

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    fullName: storedFullname || "",
    token: storedToken || "",
  },
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem("encryptedToken", action.payload);
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
