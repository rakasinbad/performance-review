import { Box, CircularProgress } from "@mui/material";
import React from "react";

function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200, // height of container
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

export default Loading;
