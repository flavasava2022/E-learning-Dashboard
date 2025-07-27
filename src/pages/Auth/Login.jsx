import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../../utils/validation";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(signinSchema),
    mode: "onChange", // validate as user types
  });
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    await dispatch(loginUser({ formData: data }));
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
      <TextField
        autoFocus
        label="Email"
        fullWidth
        margin="normal"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        required
      />

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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4, py: 1.5 }}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </Box>
  );
}
