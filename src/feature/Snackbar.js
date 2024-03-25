import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const MySnackbar = ({ open, onClose, status }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity ,setSnackbarSeverity] = useState("");
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={setSnackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      >
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
  );
};

export default MySnackbar;
