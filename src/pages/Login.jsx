import "./Login.scss";
import user_icon from "../assets/user-icon.png";
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
import { clearToken, setFullName, setToken } from "../features/auth/authSlice";
import { encryptToken } from "../features/tokenService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setPermissions } from "../redux/reducers/permissionsSlice";

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
      const res = await userLogin(data).unwrap();
      const encryptedToken = encryptToken(res?.token);
      dispatch(setToken(encryptedToken));
      dispatch(setFullName(res?.fullName));
      dispatch(setPermissions(res?.permission));

      reset();
      navigate("/");
    } catch (err) {
      console.log(err);
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
              <img src={user_icon} alt="user icon" />
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
                      fullWidth
                    />
                  ) : (
                    <TextField
                      {...field}
                      error
                      label="Username"
                      variant="outlined"
                      helperText={errors.userName.message}
                      fullWidth
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
                    fullWidth
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
