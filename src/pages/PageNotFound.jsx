import { Box } from "@mui/material";
import React from "react";
import pageNotFound from "../assets/page-not-found.jpg";

const PageNotFound = () => {
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
      <img src={pageNotFound} alt="Error 404" width="55%" height="80%" />
    </Box>
  );
};

export default PageNotFound;
