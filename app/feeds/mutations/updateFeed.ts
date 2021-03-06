import { Feed } from "app/types"
import { Ctx } from "blitz"
import db from "db"
import { guard } from "../util"
import { User } from "@prisma/client";

export type UpdateFeedInput = Pick<Feed, "id"> & Partial<Pick<Feed, "name" | "query" | "type">>

export default async function updateFeed({ id, name, query, type }: UpdateFeedInput, ctx: Ctx):Promise<Feed & {owner: User["id"]}> {
  ctx.session.authorize()
  await guard(id, ctx)

  const newFeed = await db.feed.update({
    where: { id },
    data: { name, query, type },
  })

  return {
    id: newFeed.id,
    name: newFeed.name || undefined,
    query: newFeed.query,
    type: newFeed.type,
    zindex: newFeed.zindex,
    owner: newFeed.userId,
  }
}
