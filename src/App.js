import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { setSnackbarClose } from "./redux/reducers/snackbarSlice.js";

function App() {
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);
  const snackbarToggle = useSelector((state) => state.snackbar.isSnackOpen);
  const dispatch = useDispatch();

  const closeSnackbar = () => {
    dispatch(setSnackbarClose());
  };

  return (
    <>
      <RouterProvider router={router} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarToggle}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
export default App;
