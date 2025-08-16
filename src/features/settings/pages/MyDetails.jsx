import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  InputLabel,
  TextareaAutosize,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { changeUSerData } from "../../../utils/validation";
import { useState } from "react";
import { uploadFile } from "../../../utils/supabase";
import { changeUserData } from "../../../store/userSlice";

export default function MyDetails() {
  const user = useSelector((state) => state?.auth?.user);
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar_url || undefined);
  const [avatarDirty, setAvatarDirty] = useState(false);
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result);
        setAvatarDirty(true); // Mark the avatar as dirty to indicate it has been changed
      };
      reader.readAsDataURL(file);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(changeUSerData),
    mode: "onChange",
    defaultValues: {
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone_number: user?.phone_number || "",
      bio: user?.bio || "",
    },
  });
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    if (avatarDirty) {
      const fileName = `${data.email}_profile-pic`;
      const url = await uploadFile(avatarSrc, fileName);
      data.avatar_url = url; // Add the avatar URL to the form data
    }
    await dispatch(
      changeUserData({
        formData: data,
        id: user.id,
      })
    );
  };
  return (
    <div className="bg-white w-full p-4 h-full rounded-xl shadow flex flex-col gap-6 ">
      <div className="flex flex-col gap-2">
        <p className="text-[1.5rem] font-semibold text-primary">My Details</p>
        <span className="font-semibold">
          Please fill full details about yourself
        </span>
      </div>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%", // <-- key if you want full height
          width: "100%",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 3, // add margin for button spacing if needed
          }}
          className="overflow-auto"
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 4 },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              {...register("first_name")}
              error={!!errors?.first_name}
              helperText={errors?.first_name?.message}
              required
            />

            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              required
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 4 },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled
            />

            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 8 },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "start" },
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "center",
                height: "100%",
                width: "150px",
              }}
            >
              <InputLabel
                htmlFor="avatar-upload"
                sx={{ fontWeight: "700", color: "#333" }}
              >
                Your Photo
              </InputLabel>
              <ButtonBase
                component="label"
                role={undefined}
                tabIndex={-1} // prevent label from tab focus
                aria-label="Avatar image"
                sx={{
                  borderRadius: "40px",
                  "&:has(:focus-visible)": {
                    outline: "2px solid",
                    outlineOffset: "2px",
                  },
                }}
              >
                <Avatar
                  alt="Upload new avatar"
                  src={avatarSrc}
                  sx={{ width: "90px", height: "90px", cursor: "pointer" }}
                />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{
                    border: 0,
                    clip: "rect(0 0 0 0)",
                    height: "1px",
                    margin: "-1px",
                    overflow: "hidden",
                    padding: 0,
                    position: "absolute",
                    whiteSpace: "nowrap",
                    width: "1px",
                  }}
                  onChange={handleAvatarChange}
                />
              </ButtonBase>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "center",
                flex: 1,
                width: "100%",
                "& .bio-textarea": {
                  width: "100%",
                  borderRadius: "8px",
                  resize: "none",
                  border: "1px solid #ccc",
                  padding: "12px",
                  boxSizing: "border-box",
                  overflow: "auto",
                  "&:focus": {
                    borderColor: "#1976d2",
                    outline: "none",
                  },
                },
              }}
            >
              <InputLabel
                htmlFor="bio-textarea"
                sx={{ fontWeight: "700", color: "#333" }}
              >
                Bio
              </InputLabel>
              <TextareaAutosize
                id="bio-textarea"
                className="bio-textarea"
                {...register("bio")}
                minRows={4}
                placeholder="Type your message..."
              />
            </Box>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4, py: 1.5, width: "150px", marginLeft: "auto" }}
          disabled={(!isDirty && !avatarDirty) || isSubmitting || !isValid}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </div>
  );
}
