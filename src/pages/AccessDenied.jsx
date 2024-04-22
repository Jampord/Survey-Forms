import { Box, Button } from "@mui/material";
import React from "react";
import accessDenied from "../assets/access-denied.jpg";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <img src={accessDenied} alt="Error 404" width="50%" height="80%" />
      <Button onClick={() => navigate("/")} variant="contained">
        Go to Home
      </Button>
    </Box>
  );
};

export default AccessDenied;
