import { Feed } from "app/types"
import { Ctx } from "blitz"
import db from "db"
import { guard } from "../util"

export type UpdateFeedInput = Pick<Feed, "id"> & Partial<Pick<Feed, "name" | "query" | "type">>

export default async function updateFeed({ id, name, query, type }: UpdateFeedInput, ctx: Ctx) {
  ctx.session.authorize()
  await guard(id, ctx)

  await db.feed.update({
    where: { id },
    data: { name, query, type },
  })
}
