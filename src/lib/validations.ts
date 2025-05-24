import { z } from "zod"

// User schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
})

// Sandwich schemas
export const sandwichSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  type: z.enum(["RESTAURANT", "HOMEMADE"]),
  ingredients: z.array(z.string()).optional(),
  price: z.number().positive().optional(),
  restaurantId: z.string().optional(),
})

export const createSandwichSchema = z.object({
  title: z.string().min(1, "Sandwich name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  type: z.enum(["RESTAURANT", "HOMEMADE"]),
  restaurantName: z.string().optional(),
  ingredients: z.string().optional(),
  overallRating: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 1 && num <= 10;
  }, "Overall rating must be between 1 and 10"),
  tasteRating: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 1 && num <= 10;
  }, "Taste rating must be between 1 and 10"),
  textureRating: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 1 && num <= 10;
  }, "Texture rating must be between 1 and 10"),
  presentationRating: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 1 && num <= 10;
  }, "Presentation rating must be between 1 and 10"),
  images: z.array(z.string()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
})

// Restaurant schema
export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  cuisine: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  description: z.string().max(500).optional(),
})

// Rating schema
export const ratingSchema = z.object({
  taste: z.number().min(1).max(5),
  presentation: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  review: z.string().max(1000).optional(),
})

// Comment schema
export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment must be less than 500 characters"),
  parentId: z.string().optional(),
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(["RESTAURANT", "HOMEMADE", "ALL"]).default("ALL"),
  sortBy: z.enum(["newest", "oldest", "rating", "popular"]).default("newest"),
  cuisine: z.string().optional(),
  city: z.string().optional(),
})

export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
export type ProfileData = z.infer<typeof profileSchema>
export type SandwichData = z.infer<typeof sandwichSchema>
export type RestaurantData = z.infer<typeof restaurantSchema>
export type RatingData = z.infer<typeof ratingSchema>
export type CommentData = z.infer<typeof commentSchema>
export type SearchData = z.infer<typeof searchSchema>
export type CreateSandwichData = z.infer<typeof createSandwichSchema>