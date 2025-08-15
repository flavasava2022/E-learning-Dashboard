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
  duration,
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { AddLesson, AddSection } from "../../../utils/validation";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../store/snackbarSlice";
import { supabase } from "../../../utils/supabase";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function EditLessonModal({
  open,
  handleClose,
  lesson,
  onUpdateLesson,
}) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(AddLesson),
    mode: "onChange",
    defaultValues: {
      title: lesson?.title || "",
      lessonUrl: lesson?.content_url || "",
      duration: lesson?.duration_minutes || 1,
    },
  });
  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const onSubmit = async (dataForm) => {
    try {
      const { data: updatedLesson, error } = await supabase
        .from("lessons")
        .update({
          title: dataForm?.title,
          content_url: dataForm?.lessonUrl,
          duration_minutes: dataForm?.duration,
        })
        .eq("id", lesson.id)
        .select()
        .single();

      if (error) throw error;
      onUpdateLesson(updatedLesson);

      dispatch(
        showSnackbar({
          message: "Lesson successfully added!",
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
      aria-describedby="Edit-lesson-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="Edit-lesson-dialog-title">Edit Lesson</DialogTitle>
      <Box
        component="form"
        id="Edt-lesson-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Edit the lesson details. This will be visible to your students.
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              autoFocus
              id="title"
              label="Lesson Title"
              type="text"
              fullWidth
              variant="outlined"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              id="lessonUrl"
              label="Video URL"
              type="url"
              fullWidth
              variant="outlined"
              {...register("lessonUrl")}
              error={!!errors.lessonUrl}
              helperText={errors.lessonUrl?.message}
            />
            <TextField
              id="duration"
              label="Video Duration (in minutes)"
              type="number"
              fullWidth
              variant="outlined"
              {...register("duration")}
              error={!!errors.duration}
              helperText={errors.duration?.message}
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
          </Stack>
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
            {isSubmitting ? "Editing..." : "Edit Lesson"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
