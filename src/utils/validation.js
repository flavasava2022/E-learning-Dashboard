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
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createCourseData = z.object({
  // --- Text Inputs ---
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),

  // --- File Input ---
  image_url: z
    .any()
    .refine((value) => value, "A cover image is required.") // Check that the value is not null/undefined
    .refine((value) => {
      // If it's a string, it's an existing URL, so it's valid in edit mode.
      if (typeof value === "string") {
        return true;
      }
      // If it's a File object, run the detailed checks.
      if (value instanceof File) {
        return value.size <= MAX_FILE_SIZE_BYTES;
      }
      return false;
    }, `Max file size is ${MAX_FILE_SIZE_MB}MB.`)
    .refine((value) => {
      if (typeof value === "string") {
        return true;
      }
      if (value instanceof File) {
        return ACCEPTED_IMAGE_TYPES.includes(value.type);
      }
      return false;
    }, "Only .jpg, .jpeg, .png, and .webp formats are supported."),

  // --- Selectors ---
  course_level: z.enum(["beginner", "intermediate", "advanced"], {
    errorMap: () => ({ message: "Please select a valid course level." }),
  }),
  category_id: z.string().min(1, { message: "Please select a category." }),
  tags: z
    .array(z.string())
    .nonempty({ message: "Please select at least one tag." }),

  // --- Price Input ---
  price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
});
export const AddSection = z.object({
  // --- Text Inputs ---
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
});

export const AddLesson = z.object({

  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(150, { message: "Title cannot be longer than 150 characters." }),


  lessonUrl: z
    .string()
    .url({ message: "Please enter a valid video URL." }),


  duration: z.coerce 
    .number()
    .int({ message: "Duration must be a whole number." })
    .positive({ message: "Duration must be a positive number." })
    .min(1, { message: "Duration must be at least 1 minute." }),
});