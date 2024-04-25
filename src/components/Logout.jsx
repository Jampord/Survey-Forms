import { Button } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { clearToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import useDisclosure from "../hooks/useDisclosure";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearToken());
    localStorage.removeItem("encryptedToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("permissions");
    navigate("/login");
  };

  const {
    isOpen: isConfirmDialogOpen,
    onOpen: onConfirmDialogOpen,
    onClose: onConfirmDialogClose,
  } = useDisclosure();
  return (
    <>
      <Button
        id="addButton"
        variant="contained"
        onClick={onConfirmDialogOpen}
        // color="error"
        sx={{ height: "25px", marginBottom: "5px", color: "white" }}
      >
        Logout
      </Button>

      <Dialog open={isConfirmDialogOpen} onClose={onConfirmDialogClose}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLogout}
            variant="contained"
            autoFocus
            color={"error"}
            sx={{
              display: "inline-flex",
              width: 80,
              marginRight: 0,
              fontSize: 12,
            }}
          >
            Yes
          </Button>
          <Button
            onClick={onConfirmDialogClose}
            variant="contained"
            color="primary"
            sx={{
              display: "inline-flex",
              width: 80,
              fontSize: 12,
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Logout;
