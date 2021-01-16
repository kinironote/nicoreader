import { Ctx } from "blitz"

export default async function logout(_: null, { session }: Ctx): Promise<void> {
  return await session.revoke()
}
