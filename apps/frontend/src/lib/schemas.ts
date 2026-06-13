import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export const signupSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])/, {
      message: 'Password must contain at least 1 letter, 1 number, and 1 special character',
    }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

export interface LoginFormProps {
  onNavigateToSignup: () => void
}

export interface SignupFormProps {
  onNavigateToLogin: () => void
}
