import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../../utils/validation";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { signupUser } from "../../../store/userSlice";
export default function Signup() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    dispatch(signupUser({ formData: data }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: {
          xs: "100%",
          sm: "80%",
          md: "80%",
        },
        mx: "auto",
        padding: { md: 10, xs: 4, sm: 6 },
      }}
    >
      <div className="flex justify-between gap-4">
        <TextField
          label="First Name"
          margin="normal"
          autoFocus
          fullWidth
          {...register("FirstName")}
          error={!!errors.name}
          helperText={errors.name?.message}
          required
        />
        <TextField
          label="Last Name"
          margin="normal"
          fullWidth
          {...register("lastName")}
          error={!!errors.name}
          helperText={errors.name?.message}
          required
        />
      </div>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        required
      />
      <FormControl fullWidth margin="normal" error={!!errors.role}>
        <InputLabel id="role-label">Role</InputLabel>
        <Controller
          name="role"
          control={control}
          defaultValue="student"
          render={({ field }) => (
            <Select labelId="role-label" label="Role" {...field}>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.role?.message}</FormHelperText>
      </FormControl>
      <div className="flex justify-between gap-4">
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          required
        />

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("passwordConfirm")}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
          required
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </Button>
    </Box>
  );
}
