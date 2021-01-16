import { Feed } from "app/types"
import { Ctx } from "blitz"
import db from "db"

export default async function getFeeds(_: null, ctx: Ctx): Promise<Feed[]> {
  ctx.session.authorize()

  const feeds = await db.feed.findMany({
    where: { userId: ctx.session.userId },
    orderBy: { zindex: "asc" },
    select: { id: true, name: true, query: true, type: true, zindex: true },
  })

  return feeds.map((feed) => ({
    ...feed,
    name: feed.name || undefined,
  }))
}
