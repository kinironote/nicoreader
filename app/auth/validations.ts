import * as z from "zod"

export const SignupInput = z.object({
  email: z.string().email({ message: "メールアドレスが無効です" }),
  password: z
    .string()
    .min(10, { message: "パスワードは10文字以上にしてください" })
    .max(100, { message: "パスワードは100文字以下にしてください" }),
})
export type SignupInputType = z.infer<typeof SignupInput>

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string(),
})
export type LoginInputType = z.infer<typeof LoginInput>
