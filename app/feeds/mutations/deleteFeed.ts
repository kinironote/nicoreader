import { Feed } from "app/types"
import { Ctx } from "blitz"
import db from "db"
import { guard } from "../util"

export type DeleteFeedInput = Pick<Feed, "id">

export default async function deleteFeed({ id }: DeleteFeedInput, ctx: Ctx): Promise<void> {
  ctx.session.authorize()
  await guard(id, ctx)

  await db.feed.delete({ where: { id } })
}
