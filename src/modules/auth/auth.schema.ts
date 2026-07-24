import { z } from "zod";

export const signupSchema = z.object({
  userName: z.string().trim().min(3).max(30),

  email: z.email(),

  password: z
    .string()
    .min(8)
    .max(100),
  
  mobNo:z
  .string()
  .min(10)
  .max(10)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
  
});