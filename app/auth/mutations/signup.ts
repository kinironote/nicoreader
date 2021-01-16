import { Ctx } from "blitz"
import db, { User } from "db"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput, SignupInputType } from "app/auth/validations"

export default async function signup(
  input: SignupInputType,
  { session }: Ctx
): Promise<Omit<User, "hashedPassword">> {
  // This throws an error if input is invalid
  const { email, password } = SignupInput.parse(input)

  const hashedPassword = await hashPassword(password)
  const user = await db.user.create({
    data: { email: email.toLowerCase(), hashedPassword, role: "user" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
  })

  await session.create({ userId: user.id, roles: [user.role] })

  return user
}
