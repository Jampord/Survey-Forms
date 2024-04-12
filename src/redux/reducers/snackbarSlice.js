import { createSlice } from "@reduxjs/toolkit";

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {
    message: "",
    severity: "success",
  },
  reducers: {
    setSnackbarMessage: (state, action) => {
      state.message = action.payload;
    },
    setSnackbarSeverity: (state, action) => {
      state.severity = action.payload;
    },
  },
});

export const { setSnackbarMessage, setSnackbarSeverity } =
  snackbarSlice.actions;
export default snackbarSlice.reducer;
