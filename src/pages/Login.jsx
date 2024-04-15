import "./Login.scss";
import email_icon from "../assets/email-icon.png";
import password_icon from "../assets/password-icon.png";
import { useState } from "react";
import { useUserLoginMutation } from "../redux/api/authAPI";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginYup } from "../schema/Schema";
import {
  Alert,
  IconButton,
   InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useDisclosure from "../hooks/useDisclosure";
import {
  setSnackbarMessage,
  setSnackbarSeverity,
} from "../redux/reducers/snackbarSlice";
import { clearToken, setToken } from "../redux/reducers/authSlice";
import { encryptToken } from "../features/tokenService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [userLogin, { isLoading, isError, error }] = useUserLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const snackbarMessage = useSelector((state) => state.snackbar.message);
  const snackbarSeverity = useSelector((state) => state.snackbar.severity);
  const {
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginYup.schema),
    mode: "onSubmit",
    defaultValues: loginYup.defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      await userLogin(data).unwrap();
      reset();
      const encryptedToken = encryptToken(data.token);
      dispatch(setToken(encryptedToken));
      localStorage.setItem("encryptedToken", encryptedToken);
      navigate("/");
      dispatch(setSnackbarSeverity("success"));
      dispatch(setSnackbarMessage("Logged in successfully!"));
      onSnackbarOpen();
      console.log(encryptedToken);
    } catch (err) {
      console.log(err);
      dispatch(clearToken());
      localStorage.removeItem("encryptedToken");
      dispatch(setSnackbarSeverity("error"));
      dispatch(setSnackbarMessage(err.message));
      onSnackbarOpen();
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="inputs">
          <div className="header">
            <div className="text">
              <h1>Login</h1>
            </div>
          </div>

          <div className="underline"></div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="login-input">
              <img src={email_icon} alt="email icon" />
              <Controller
                name="userName"
                control={control}
                defaultValue={loginYup.defaultValues}
                render={({ field }) =>
                  !errors.userName ? (
                    <TextField
                      {...field}
                      label="Username"
                      variant="outlined"
                      type="text"
                    />
                  ) : (
                    <TextField
                      {...field}
                      error
                      label="Username"
                      variant="outlined"
                      helperText={errors.userName.message}
                    />
                  )
                }
              />
            </div>

            <div className="login-input">
              <img src={password_icon} alt="password icon" />
              <Controller
                name="password"
                control={control}
                // defaultValue={loginYup.defaultValues}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    helperText={errors?.password?.message}
                    error={!!errors?.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

            <button className="login" type="submit">
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={onSnackbarClose}
      >
        <Alert
          onClose={onSnackbarClose}
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
