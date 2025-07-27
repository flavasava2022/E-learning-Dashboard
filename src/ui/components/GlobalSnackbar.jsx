// src/components/GlobalSnackbar.jsx

import Snackbar from "@mui/material/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { hideSnackbar } from "../../../src/store/snackbarSlice";
import Alert from "@mui/material/Alert";

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: "100%",
          borderRadius: "8px",
          boxShadow: 3,
          backgroundColor:
            severity === "error"
              ? "#f44336"
              : severity === "success"
                ? "#4caf50"
                : "#2196f3",
          color: "#fff",
        }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
