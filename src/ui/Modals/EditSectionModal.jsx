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
import { AddSection } from "../../utils/validation";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store/snackbarSlice";
import { supabase } from "../../utils/supabase";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function EditSectionModal({
  open,
  handleClose,
  section,
  onSectionUpdated,
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
      title: section?.title || "",
    },
  });
  const handleModalClose = () => {
    reset(); // Reset form state when closing the dialog
    handleClose();
  };

  const onSubmit = async (dataForm) => {
    try {
      const { data: updatedSection, error } = await supabase
        .from("modules")

        .update({
          title: dataForm?.title,
        })
        .eq("id", section?.id)
        .select()
        .single();

      if (error) throw error;

      onSectionUpdated(updatedSection);

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
      aria-describedby="edit-section-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="edit-section-dialog-title">Edit Section</DialogTitle>
      <Box
        component="form"
        id="edit-section-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please Edit the title for the section. This will be visible to your
            students.
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
            {isSubmitting ? "Editing..." : "Edit Section"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
