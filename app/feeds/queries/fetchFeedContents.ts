import { Content } from "app/types"
import axios from "axios"
import { Ctx } from "blitz"
import { Feed } from "db"
import feedparser from "feedparser-promised"
import { guard } from "../util"

export type FetchFeedContentsInput = {
  id: Feed["id"]
  offset: number
}

export default async function fetchFeedContents(
  { id, offset }: FetchFeedContentsInput,
  ctx: Ctx
): Promise<{
  data: Content[]
  nextOffset: number
}> {
  ctx.session.authorize()
  const feed = await guard(id, ctx)
  if (!feed.query)
    return {
      data: [],
      nextOffset: 0,
    }
  return {
    data: await _fetchContents(feed, offset),
    nextOffset: offset + 1,
  }
}

type NicoVideoSearchApiReturnType = {
  data: {
    contentId: string
    title: string
    viewCounter: string
    thumbnailUrl: string
    startTime: string
  }[]
}

export async function _fetchContents(feed: Feed, offset: number): Promise<Content[]> {
  switch (feed.type) {
    case "User":
    case "Mylist":
    case "Tags": {
      const requestUrl = (() => {
        switch (feed.type) {
          case "User":
            return `https://www.nicovideo.jp/user/${encodeURIComponent(
              feed.query
            )}/video?rss=2.0&page=${offset}`
          case "Mylist":
            return `https://www.nicovideo.jp/mylist/${encodeURIComponent(
              feed.query
            )}/video?rss=2.0&page=${offset}`
          case "Tags":
            return `https://www.nicovideo.jp/tag/${encodeURIComponent(
              feed.query
            )}?sort=f&order=d&rss=2.0&page=${offset}`
        }
      })()

      const items = await feedparser.parse(requestUrl)

      return items.map(
        (item): Content => {
          return {
            id: item.link.replace("https://www.nicovideo.jp/watch/", ""),
            title: item.title,
            thumbnailUrl: /src="(.*?)"/.exec(item.description)?.[1] ?? "",
            viewCounter: "",
            startTime:
              /<strong class="nico-info-date">(.*?)<\/strong>/.exec(item.description)?.[1] ?? "",
          }
        }
      )
    }
    case "Search": {
      return []
    }
  }
}
