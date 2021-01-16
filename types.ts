import { DefaultCtx, SessionContext, DefaultPublicData } from "blitz"
import { User } from "db"
import { PrismaClient } from "@prisma/client"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface PublicData extends DefaultPublicData {
    userId: User["id"]
  }
}

declare global {
  var prisma: PrismaClient
}
