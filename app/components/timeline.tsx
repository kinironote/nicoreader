import { Content, Feed } from "app/types"
import React, { CSSProperties, memo, useContext, useEffect, useMemo, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import { useInfiniteQuery } from "blitz"
import fetchFeedContents from "app/feeds/queries/fetchFeedContents"
import { CircularProgress } from "@material-ui/core"
import Progress from "./progress"
import { NicoReaderContext } from "app/pages"
import { createStyle } from "app/utils"

export type TimelinePropType = {
  contentsSequence: { data: Content[] }[]
  fetchMoreContents: (..._: any) => any
}

const calcDateDiff = (now: Date, date: Date) => {
  const SECOND_MILLISECOND = 1000
  const MINUTE_MILLISECOND = 60 * SECOND_MILLISECOND
  const HOUR_MILLISECOND = 60 * MINUTE_MILLISECOND
  const DAY_MILLISECOND = 24 * HOUR_MILLISECOND
  // WEEK_MILLISECOND = 7 * DAY_MILLISECOND,
  // YEAR_MILLISECOND = 365 * DAY_MILLISECOND

  const options = {
    weekday: "narrow",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  const diff = now.getTime() - date.getTime()
  if (diff < MINUTE_MILLISECOND) return Math.floor(diff / SECOND_MILLISECOND) + "秒前"
  else if (diff < HOUR_MILLISECOND) return Math.floor(diff / MINUTE_MILLISECOND) + "分前"
  else if (diff < DAY_MILLISECOND) return Math.floor(diff / HOUR_MILLISECOND) + "時間前"
  else return date.toLocaleTimeString("ja-JP", options)
}

const ContentInner = ({ now, content }: { now: Date; content: Content }) => {
  const { setMoviePopup } = useContext(NicoReaderContext)

  return (
    <div style={styles.content}>
      <button
        style={styles.thumbnailLink}
        onClick={() =>
          setMoviePopup({
            opened: true,
            contentId: content.id,
            loading: true,
          })
        }
      >
        <img style={styles.thumbnail} src={content.thumbnailUrl} alt="サムネイル" />
      </button>
      <span style={styles.contentTitle}>{content.title}</span>

      <span style={styles.viewCount}>{content.viewCounter}</span>
      <span style={styles.date}>
        {calcDateDiff(
          now,
          new Date(content.startTime.replace(/[年月日]/g, "/").replace(/：/g, ":"))
        )}
      </span>
    </div>
  )
}

const Timeline = ({ contentsSequence, fetchMoreContents }: TimelinePropType) => {
  console.log("render")
  useEffect(() => {
    console.log("componentDidMount")
    // Lifecycle: Mount immediately after render.
    // Purpose: Initialize state that requires DOM nodes, Network requests and side effects.
    return () => {
      console.log("componentWillUnmount")
      // Lifecycle: Unmount.
      // Purpost: Clean up things such as event handlers, cancel network request, etc.
    }
  }, [])

  const [now] = useState(new Date())

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => fetchMoreContents()}
      hasMore={contentsSequence[contentsSequence.length - 1].data.length === 20} // TODO: Calc max offset on server
      loader={
        <div key={-1} className="loader">
          <Progress />
        </div>
      }
      useWindow={false}
      threshold={500}
    >
      {contentsSequence.map((contents) =>
        contents.data.map((content) => (
          <ContentInner now={now} content={content} key={content.id} />
        ))
      )}
    </InfiniteScroll>
  )
}

export default memo(Timeline)

const styles = createStyle({
  content: {
    height: 170,
    border: "solid",
    borderWidth: 0,
    borderColor: "#1a1a1a",
    borderBottomWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    position: "relative",
    overflow: "hidden",
  },
  thumbnailLink: {
    padding: 0,
    border: "none",
    height: 130,
  },
  thumbnail: {
    width: 230,
    height: 130,
    objectFit: "cover",
  },
  viewCount: {
    position: "absolute",
    top: 129,
    right: 34,
    fontSize: 13,
    color: "#d5d5d5DA",
    fontFamily: "Helvetica",
    textShadow: "1px 1px 0 #000",
  },
  date: {
    position: "absolute",
    top: 127,
    left: 16,
    fontSize: 13,
    color: "#d5d5d5DA",
    fontFamily: "Helvetica",
    textShadow: "1px 1px 0 #000",
  },
  contentTitle: {
    position: "relative",
    color: "#DEDEDE",
    top: -3,
    display: "block",
    lineHeight: "18px",
    fontSize: 13,
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  },
})
