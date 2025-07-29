import { z } from "zod";

export const signupSchema = z
  .object({
    FirstName: z.string().min(1, "First Name is required").max(70),
    lastName: z.string().min(1, "Last Name is required").max(70),
    email: z.string().min(1, "Email is required").email("Email is invalid"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
    role: z
      .enum(["student", "instructor"], {
        required_error: "Role is required",
      })
      .default("student"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(32, "Password must be less than 32 characters"),
});
export const changeUSerData = z.object({
  first_name: z.string().min(1, "First Name is required").max(70),
  last_name: z.string().min(1, "Last Name is required").max(70),
  phone_number: z.string().max(20).optional(),
  bio: z.string().max(500, "Bio too long!").optional(),
  email: z.string().email(), // if you want
});
