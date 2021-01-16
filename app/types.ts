import { FeedType } from "@prisma/client"

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

export type API<ApiType extends (...args: never) => unknown> = (
  args: Parameters<ApiType>[0]
) => ReturnType<ApiType>
