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

const DragHandle = SortableHandle(({ feed }: { feed: Feed }) => (
  <div style={styles.dragHandle}>
    <span style={styles.feedName}>{feed.name ?? feed.query}</span>
  </div>
))

type FeedHeaderPropType = {
  feed: Feed
  settingOpened: boolean
  setSettingOpened: (opened: boolean) => void
  refetch: () => void
}

const FeedHeader = memo(
  ({ feed: _feed, settingOpened, setSettingOpened, refetch }: FeedHeaderPropType) => {
    const [formFeed, setFormFeed] = useState(_feed)
    const { updateFeed, deleteFeed } = useContext(NicoReaderContext)

    const toggleSetting = () => {
      setSettingOpened(!settingOpened)
    }

    return (
      <div style={styles.timelineHeader}>
        <div style={styles.timelineHeaderHeader}>
          <DragHandle feed={_feed} />
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
              await updateFeed(formFeed)
              refetch()
            }}
          >
            <div style={styles.fieldWrapper}>
              <TextField
                label="タイトル"
                defaultValue=""
                style={styles.textField}
                helperText=""
                value={formFeed.name}
                onChange={(e) => setFormFeed({ ...formFeed, name: e.target.value })}
              />
            </div>

            <div style={styles.fieldWrapper}>
              <TextField
                id="select-currency"
                select
                label="検索タイプ"
                value={formFeed.type}
                onChange={(e) => setFormFeed({ ...formFeed, type: e.target.value as FeedType })}
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
                placeholder={feedQueryHelp[formFeed.type]}
                defaultValue=""
                style={styles.textField}
                helperText=""
                value={formFeed.query}
                onChange={(e) => setFormFeed({ ...formFeed, query: e.target.value })}
              />
            </div>
            <Button variant="contained" style={{ marginRight: 5 }} color="primary" type="submit">
              更新
            </Button>
            <Button variant="contained" onClick={() => deleteFeed(formFeed)}>
              削除
            </Button>
          </form>
        )}
      </div>
    )
  }
)

export type FeederPropType = {
  feed: Feed
  settingDefaultOpened: boolean
}

const Feeder = ({ feed, settingDefaultOpened }: FeederPropType) => {
  const [contentsSequence, contentsOps] = useInfiniteQuery(
    fetchFeedContents,
    // Compiler don't infer
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    (offset: number = 0) => ({ id: feed.id, offset: offset }),
    {
      staleTime: 1000 * 60 * 30,
      getFetchMore: (prev) => prev.nextOffset,
      suspense: false,
    }
  )
  const [settingOpened, setSettingOpened] = useState(settingDefaultOpened)

  return (
    <div style={styles.body}>
      <FeedHeader
        feed={feed}
        settingOpened={settingOpened}
        setSettingOpened={setSettingOpened}
        refetch={contentsOps.refetch}
      />
      {contentsOps.isLoading ? (
        <Progress />
      ) : (
        <div style={settingOpened ? styles.contentListWhenSettingOpened : styles.contentList}>
          <Timeline contentsSequence={contentsSequence} fetchMoreContents={contentsOps.fetchMore} />
        </div>
      )}
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
