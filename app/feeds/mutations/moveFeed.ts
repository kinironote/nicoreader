import { Feed } from "app/types"
import { Ctx } from "blitz"
import db from "db"
import { guard } from "../util"

export type MoveFeedInput = {
  id: Feed["id"]
  newZIndex: Feed["zindex"]
}

export default async function moveFeed({ id, newZIndex }: MoveFeedInput, ctx: Ctx) {
  ctx.session.authorize()
  const feed = await guard(id, ctx)

  // Shift feed greate then or equal to new zIndex
  const shiftZIndexCond = feed.zindex < newZIndex ? { gt: newZIndex } : { gte: newZIndex }
  await db.feed.updateMany({
    where: { userId: ctx.session.userId, zindex: shiftZIndexCond },
    data: { zindex: { increment: 1 } },
  })

  // And set new zIndex
  await db.feed.update({
    where: { id },
    data: { zindex: newZIndex },
  })
}
