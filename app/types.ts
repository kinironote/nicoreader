import { FeedType } from "@prisma/client"
import { MutateFunction, PromiseReturnType } from "blitz"

export type Feed = {
  id: number
  name?: string
  query: string
  type: FeedType
  zindex: number
}

export type Content = {
  id: string
  title: string
  thumbnailUrl: string
  viewCounter: string
  startTime: string
}

type ServerMutateFunc = (variables: any, ctx?: any) => Promise<any>
export type MutateFunc<T extends ServerMutateFunc> = MutateFunction<
  PromiseReturnType<T>,
  unknown,
  Parameters<T>["0"]
>

export type Callback<Input> = (variables: Input) => Promise<unknown>
