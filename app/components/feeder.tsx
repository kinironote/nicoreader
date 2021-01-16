import { Feed } from "app/types"
import { FeedType } from "@prisma/client"
import React, { memo, Suspense, useContext, useState } from "react"
import { Button, MenuItem, TextField } from "@material-ui/core"
import { SortableHandle } from "react-sortable-hoc"
import { createStyle, FEED_TYPE_LIST } from "app/utils"
import Timeline from "app/components/timeline"
import Progress from "./progress"
import { NicoReaderContext } from "app/pages"
import { useInfiniteQuery } from "blitz"
import fetchFeedContents from "app/feeds/queries/fetchFeedContents"

export type FeederPropType = {
  feed: Feed
  settingDefaultOpened: boolean
}

const feedTypeLabel: Record<FeedType, string> = {
  Search: "文字列",
  Tags: "タグ",
  User: "ユーザーID",
  Mylist: "マイリストID",
}

const feedQueryHelp: Record<FeedType, string> = {
  Search: "例：少年 or 少女",
  Tags: "例：ゲーム or VOCAROID",
  Mylist: "マイリストのID",
  User: "ユーザーのID",
}

const Feeder = ({ feed: _feed, settingDefaultOpened }: FeederPropType) => {
  const { updateFeed, deleteFeed } = useContext(NicoReaderContext)
  const [feed, setFeed] = useState(_feed)
  const [contentsSequence, contentsOps] = useInfiniteQuery(
    fetchFeedContents,
    (offset = 0) => ({ id: feed.id, offset: offset }),
    {
      staleTime: 1000 * 60 * 30,
      getFetchMore: (prev) => prev.nextOffset,
    }
  )
  const [settingOpened, setSettingOpened] = useState(settingDefaultOpened)
  const toggleSetting = () => {
    setSettingOpened(!settingOpened)
  }
  const DragHandle = SortableHandle(() => (
    <div style={styles.dragHandle}>
      <span style={styles.feedName}>{_feed.name ?? _feed.query}</span>
    </div>
  ))

  return (
    <div style={styles.body}>
      <div style={styles.timelineHeader}>
        <div style={styles.timelineHeaderHeader}>
          <DragHandle />
          <div
            role="button"
            tabIndex={0}
            style={styles.settingIcon}
            onClick={(e) => {
              e.preventDefault()
              toggleSetting()
            }}
            onKeyDown={(e) => {
              e.preventDefault()
              toggleSetting()
            }}
          >
            {">>"}
          </div>
        </div>
        {settingOpened && (
          <form
            style={styles.timelineHeaderSettings}
            onSubmit={async (e) => {
              e.preventDefault()
              await updateFeed(feed)
              contentsOps.refetch()
            }}
          >
            <div style={styles.fieldWrapper}>
              <TextField
                label="タイトル"
                defaultValue=""
                style={styles.textField}
                helperText=""
                value={feed.name}
                onChange={(e) => setFeed({ ...feed, name: e.target.value })}
              />
            </div>

            <div style={styles.fieldWrapper}>
              <TextField
                id="select-currency"
                select
                label="検索タイプ"
                value={feed.type}
                onChange={(e) => setFeed({ ...feed, type: e.target.value as FeedType })}
                helperText=""
              >
                {FEED_TYPE_LIST.map((feedType) => (
                  <MenuItem key={feedType} value={feedType}>
                    {feedTypeLabel[feedType]}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div style={styles.fieldWrapper}>
              <TextField
                label="クエリ"
                placeholder={feedQueryHelp[feed.type]}
                defaultValue=""
                style={styles.textField}
                helperText=""
                value={feed.query}
                onChange={(e) => setFeed({ ...feed, query: e.target.value })}
              />
            </div>
            <Button variant="contained" style={{ marginRight: 5 }} color="primary" type="submit">
              更新
            </Button>
            <Button variant="contained" onClick={() => deleteFeed(feed)}>
              削除
            </Button>
          </form>
        )}
      </div>
      <Suspense fallback={<Progress />}>
        <div style={settingOpened ? styles.contentListWhenSettingOpened : styles.contentList}>
          <Timeline contentsSequence={contentsSequence} fetchMoreContents={contentsOps.fetchMore} />
        </div>
      </Suspense>
    </div>
  )
}

export default memo(Feeder)

const styles = createStyle({
  textField: {},
  fieldWrapper: {
    paddingBottom: 20,
  },
  body: {
    backgroundColor: "#292929",
    height: "100%",
    width: 260,
  },
  timelineHeader: {
    border: "solid",
    borderWidth: 0,
    borderColor: "#3b3b3b",
    borderBottomWidth: 1,
  },
  timelineHeaderHeader: {
    height: 34,
    flexWrap: "nowrap",
    display: "flex",
    justifyContent: "space-between",
  },
  dragHandle: {
    width: "100%",
  },
  feedName: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingLeft: 8,
    color: "#BCBCBC",
    fontSize: 16,
    fontFamily: "Helvetica",
  },
  settingIcon: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingRight: 10,
    color: "#3b3b3b",
    fontSize: 15,
    fontFamily: "Helvetica",
    cursor: "pointer",
  },
  timelineHeaderSettings: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  contentList: {
    overflowX: "auto",
    height: "calc(100% - 35px)",
  },
  contentListWhenSettingOpened: {
    overflowX: "auto",
    height: "calc(100% - 315px)",
  },
})
