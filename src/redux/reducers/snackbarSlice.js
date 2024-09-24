import { createSlice } from "@reduxjs/toolkit";

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {
    message: "",
    severity: "success",
    isSnackOpen: false,
  },
  reducers: {
    setSnackbar: (state, action) => {
      state.message = action.payload.message;
      state.isSnackOpen = true;
      state.severity = action.payload.severity;
    },
    // setSnackbarSeverity: (state, action) => {
    //   state.severity = action.payload;
    // },
    setSnackbarClose: (state) => {
      state.isSnackOpen = false;
    },
  },
});

export const { setSnackbar, setSnackbarSeverity, setSnackbarClose } =
  snackbarSlice.actions;
export default snackbarSlice.reducer;
