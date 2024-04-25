import { Box, Button } from "@mui/material";
import React from "react";
import pageNotFound from "../assets/page-not-found.jpg";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
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
      <img src={pageNotFound} alt="Error 404" width="55%" height="80%" />
      <Button onClick={() => navigate("/")} variant="contained">
        Go to Home
      </Button>
    </Box>
  );
};

export default PageNotFound;
