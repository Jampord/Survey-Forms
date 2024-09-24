import { createSlice } from "@reduxjs/toolkit";
import { decryptToken } from "../tokenService";

const storedToken = localStorage.getItem("encryptedToken") || "";
// const storedToken = decryptToken(localStorage.getItem("encryptedToken")) || "";
const storedFullname = localStorage.getItem("fullName") || "";
const storedUserId = localStorage.getItem("id") || "";
const storedUpdatePass = localStorage.getItem("UpdatePass") || "";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    fullName: storedFullname || "",
    token: storedToken || "",
    id: storedUserId || "",
    UpdatePass: storedUpdatePass || "",
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
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("id", action.payload);
    },
    setChangePasswordModalPopup: (state, action) => {
      state.UpdatePass = action.payload;
      localStorage.setItem("updatePass", action.payload);
    },
  },
});

export const {
  setToken,
  clearToken,
  setFullName,
  setRoleName,
  setUserName,
  setUserId,
  setChangePasswordModalPopup,
} = authSlice.actions;
export default authSlice.reducer;
