import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createCourseData } from "../../../utils/validation";

import LevelSelector from "./LevelSelector";
import CategoriesSelector from "./CategoriesSelector";
import TagsSelector from "./TagsSelector";
import DescriptionInput from "./DescriptionInput";
import ImageUploader from "./ImageUploader";
import { supabase, uploadFile } from "../../../utils/supabase";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { showSnackbar } from "../../../store/snackbarSlice";

export default function BasicInfoForm({
  setBreadcrumbsTitle,
  courseData,
  setValue,
  setCourseData,
}) {
  const user = useSelector((state) => state?.auth?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(createCourseData),
    mode: "onChange",
    defaultValues: courseData || {},
  });
  useEffect(() => {
    if (courseData) {
      reset(courseData);
    }
  }, [courseData, reset]);
  const onSubmit = async (dataForm) => {
    try {
      const { image_url: imageFile, ...formData } = dataForm;

      let imageUrl = courseData?.image_url;

      if (imageFile instanceof File) {
        const fileName = `${user.email}_${formData.title}_course-pic`;
        imageUrl = await uploadFile(imageFile, fileName);
        if (!imageUrl) {
          return;
        }
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
        edit_course_step: 1,
      };

      if (courseData?.id) {
        // --- EDIT MODE ---

        const { data, error } = await supabase
          .from("courses")
          .update(payload)
          .eq("id", courseData.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setCourseData((previousCourseData) => {
            return {
              ...previousCourseData,
              ...data,
            };
          });
          setValue(1);
        }
      } else {
        // --- CREATE MODE ---
        console.log("Creating new course...");
        const { data, error } = await supabase
          .from("courses")
          .insert({ ...payload, instructor_id: user?.id })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setCourseData((previousCourseData) => {
            return {
              ...previousCourseData,
              ...data,
            };
          });
          setValue(1);
          navigate(`/dashboard/mycourses/create/${data.id}`);
        }
      }
    } catch (error) {
      dispatch(showSnackbar({ message: error.message, severity: "error" }));
    }
  };

  const handleTitleBlur = () => {
    const currentTitle = getValues("title");
    setBreadcrumbsTitle(currentTitle);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        gap: 2,
        height: "100%",
        minHeight: "100%",

        boxSizing: "border-box",
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: "100%",
          overflow: "auto",
          p: 2,

          justifyContent: "space-between",
        }}
        className="rounded-xl shadow p-1 bg-white w-[75%]"
      >
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          {...register("title")}
          error={!!errors?.title}
          helperText={errors?.title?.message}
          onBlur={handleTitleBlur}
          required
        />

        <DescriptionInput control={control} errors={errors} />

        <ImageUploader name="image_url" control={control} errors={errors} />
      </Box>
      {/* Right Side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: "100%",
          justifyContent: "space-between",
          gap: 2,
        }}
        className="w-[25%]"
      >
        <LevelSelector control={control} errors={errors} />
        <CategoriesSelector control={control} errors={errors} />
        <TagsSelector control={control} errors={errors} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            gap: 2,
          }}
          className="rounded-xl shadow p-3 bg-white"
        >
          <Typography variant="body" sx={{ fontWeight: "700", color: "#333" }}>
            Pricing
          </Typography>
          <TextField
            {...register("price")}
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors?.price}
            helperText={errors?.price?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">USD</InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4, py: 1.5, width: "150px", marginLeft: "auto" }}
          disabled={!isDirty || isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
