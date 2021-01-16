import { Ctx } from "blitz"
import db, { User } from "db"
import { hashPassword } from "app/auth/auth-utils"
import { randomBytes } from "crypto"

export default async function spawnGuest(
  _: unknown,
  { session }: Ctx
): Promise<Omit<User, "hashedPassword"> & { password: string }> {
  // This throws an error if input is invalid
  const email = randomBytes(20).toString("hex") + "@example.com"
  const password = randomBytes(20).toString("hex")

  const hashedPassword = await hashPassword(password)
  const user = await db.user.create({
    data: { email: email.toLowerCase(), hashedPassword, role: "guest" },
    select: { id: true, name: true, email: true, role: true, updatedAt: true, createdAt: true },
  })

  await session.create({ userId: user.id, roles: [user.role] })

  return { ...user, password }
}
