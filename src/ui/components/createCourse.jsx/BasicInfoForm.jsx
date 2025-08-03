import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  ButtonBase,
  InputLabel,
  TextareaAutosize,
  TextField,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import UploadIcon from "@mui/icons-material/Upload";
import { Controller, useForm } from "react-hook-form"; // Import Controller
import { useDispatch, useSelector } from "react-redux";
import { createCourseData } from "../../../utils/validation";
import { useEffect, useState } from "react";

import LevelSelector from "./LevelSelector";
import CategoriesSelector from "./CategoriesSelector";
import TagsSelector from "./TagsSelector";
import DescriptionInput from "./DescriptionInput";
import ImageUploader from "./ImageUploader";
import PriceInput from "./PriceInput";

export default function BasicInfoForm({ onTitleChange }) {
  const user = useSelector((state) => state?.auth?.user);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(createCourseData),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      course_level: "beginner", // Correct
      category_id: "5a279548-eee0-4c10-96f2-ca2be70a277f",
      tags: [],
    },
  });
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    console.log(data);
    // await dispatch();
  };

  const handleTitleBlur = () => {
    if (onTitleChange) {
      const currentTitle = getValues("title");
      onTitleChange(currentTitle);
    }
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
