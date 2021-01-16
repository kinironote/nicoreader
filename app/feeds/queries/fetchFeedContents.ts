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
    case "Mylist": {
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
    case "Search":
    case "Tags": {
      const apiCallUrl = (() => {
        switch (feed.type) {
          case "Search":
            return `https://api.search.nicovideo.jp/api/v2/video/contents/search?q=${encodeURIComponent(
              feed.query
            )}&targets=title&fields=title,thumbnailUrl,viewCounter,contentId,startTime&_sort=-startTime&_offset=${
              offset * 20
            }&_limit=20&_context=nicoreader`
          case "Tags":
            return `https://api.search.nicovideo.jp/api/v2/video/contents/search?q=${encodeURIComponent(
              feed.query
            )}&targets=tags&fields=title,thumbnailUrl,viewCounter,contentId,startTime&_sort=-startTime&_offset=${
              offset * 20
            }&_limit=20&_context=nicoreader`
        }
      })()
      const res = await axios.get<NicoVideoSearchApiReturnType>(apiCallUrl)
      return res.data["data"].map(
        (data): Content => ({
          id: data.contentId,
          title: data.title,
          viewCounter: data.viewCounter,
          thumbnailUrl: data.thumbnailUrl,
          startTime: data.startTime,
        })
      )
    }
  }
}
