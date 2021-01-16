import { CSSProperties } from "react"

export const FEED_TYPE_LIST = ["User", "Mylist", "Search", "Tags"] as const

export function createStyle<T extends { [attribute: string]: CSSProperties }>(style: T): T {
  return style
}
