import { Box } from "@mui/material";
import React from "react";
import accessDenied from "../assets/access-denied.jpg";

const AccessDenied = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <img src={accessDenied} alt="Error 404" width="50%" height="80%" />
    </Box>
  );
};

export default AccessDenied;
