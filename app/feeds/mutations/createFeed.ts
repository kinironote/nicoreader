import { Ctx } from "blitz"
import db from "db"
import { Feed } from "app/types"

export type CreateFeedInput = Pick<Feed, "name" | "type" | "query">

export default async function createFeed({ name, type, query }: CreateFeedInput, ctx: Ctx) {
  ctx.session.authorize()

  const agg = await db.feed.aggregate({
    max: { zindex: true },
    where: { userId: ctx.session.userId },
  })

  const feed = await db.feed.create({
    data: {
      name,
      type,
      query,
      zindex: agg.max.zindex + 1,
      user: { connect: { id: ctx.session.userId } },
    },
  })

  return feed
}
