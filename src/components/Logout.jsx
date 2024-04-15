import { Button } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { clearToken } from "../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearToken());
    localStorage.removeItem("encryptedToken");
    navigate("/login");
  };

  return (
    <>
      <Button
        id="addButton"
        variant="contained"
        onClick={handleLogout}
        sx={{ height: "25px", marginBottom: "5px" }}
      >
        Logout
      </Button>
    </>
  );
};

export default Logout;
