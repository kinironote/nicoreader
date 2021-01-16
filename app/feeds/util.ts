import { Feed } from "@prisma/client"
import { AuthenticationError, Ctx, NotFoundError } from "blitz"
import db from "db"

export async function guard(id: Feed["id"], ctx: Ctx) {
  const feed = await db.feed.findUnique({ where: { id } })
  if (feed === null) throw new NotFoundError()
  if (feed.userId !== ctx.session.userId) throw new AuthenticationError()
  return feed
}
