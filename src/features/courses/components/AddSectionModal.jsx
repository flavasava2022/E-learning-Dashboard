import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { AddSection } from "../../../utils/validation";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../store/snackbarSlice";
import { supabase } from "../../../utils/supabase";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddSectionModal({
  open,
  handleClose,
  courseId,
  position,
  onSectionAdded,
}) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(AddSection),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });
  const handleModalClose = () => {
    reset(); // Reset form state when closing the dialog
    handleClose();
  };

  const onSubmit = async (dataForm) => {
    try {
      const { data: newModule, error } = await supabase
        .from("modules")
        .insert({
          course_id: courseId,
          title: dataForm.title,
          position: position,
        })
        .select()
        .single();

      if (error) throw error;

      onSectionAdded(newModule);

      dispatch(
        showSnackbar({
          message: "Section successfully added!",
          severity: "success",
        })
      );
      handleModalClose();
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error.message || "An unexpected error occurred.",
          severity: "error",
        })
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      slots={{
        transition: Transition,
      }}
      keepMounted
      aria-describedby="add-section-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="add-section-dialog-title">Add New Section</DialogTitle>
      <Box
        component="form"
        id="add-section-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter a title for the new section. This will be visible to
            your students.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Section Title"
            type="text"
            fullWidth
            variant="outlined"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={handleModalClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isDirty || !isValid || isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Adding..." : "Add Section"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
