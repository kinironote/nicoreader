import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InfiniteScroll from 'react-infinite-scroller';
import {
  SortableHandle,
} from 'react-sortable-hoc';

const currencies = [
  {
    value: 'search',
    label: '文字列'
  },
  {
    value: 'tags',
    label: 'タグ'
  },
  {
    value: 'user',
    label: 'ユーザーID'
  },
  {
    value: 'mylist',
    label: 'マイリストID'
  }
];

const helpEachType = {
  search: "例：少年 or 少女",
  tags: "例：ゲーム or VOCAROID",
  mylist: "マイリストのID",
  user: "ユーザーのID"
}

export default class TimeLine extends Component {
  constructor(props){
    super(props);
    this.state = {
      feed: this.props.feed,
      openSetting: ('data' in this.props.feed.contents) ? false : true,
      now: new Date()
    }
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  calcDateDiff = (date) => {
    const SECOND_MILLISECOND = 1000,
    MINUTE_MILLISECOND = 60 * SECOND_MILLISECOND,
    HOUR_MILLISECOND = 60 * MINUTE_MILLISECOND,
    DAY_MILLISECOND = 24 * HOUR_MILLISECOND,
    WEEK_MILLISECOND = 7 * DAY_MILLISECOND,
    YEAR_MILLISECOND = 365 * DAY_MILLISECOND;

    const options = {
      weekday: "narrow", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };

    const diff = this.state.now.getTime() - date.getTime();
    if(diff < MINUTE_MILLISECOND) return Math.floor(diff / SECOND_MILLISECOND) + "秒前"
    else if(diff < HOUR_MILLISECOND) return Math.floor(diff / MINUTE_MILLISECOND) + "分前"
    else if(diff < DAY_MILLISECOND) return Math.floor(diff / HOUR_MILLISECOND) + "時間前"
    else return date.toLocaleTimeString("ja-JP", options);
  }

  render() {
    const DragHandle = SortableHandle(() => (
      <div>
                <span style={styles.feedName}>{this.props.feed.feedName}</span>
                <span style={styles.settingIcon} onClick={()=>this.setState({openSetting: !this.state.openSetting})}>>></span>
                </div>
    )); // This can be any component you want
    return (
      <div style={styles.body}>
          <div style={styles.timelineHeader}>
              <DragHandle style={styles.timelineHeaderHeader}/>
              {this.state.openSetting &&
                <form style={styles.timelineHeaderSettings} onSubmit={async () => {await this.setState({feed:{...this.state.feed, feedName: this.state.feed.feedName || this.state.feed.query}}); this.props.updateFeed(this.state.feed)}}>
                  {this.state.feed.feedName != null &&
                    <div style={styles.fieldWrapper}>
                    <TextField
                      label="タイトル"
                      defaultValue=""
                      className={styles.textField}
                      helperText=""
                      value={this.state.feed.feedName}
                      onChange={(e)=>this.setState({feed:{...this.state.feed, feedName: e.target.value}})}
                    />
                    </div>
                  }
                  <div style={styles.fieldWrapper}>
                  <TextField
                    id="select-currency"
                    select
                    label="検索タイプ"
                    value={this.state.feed.feedType}
                    onChange={(e)=>this.setState({feed:{...this.state.feed, feedType: e.target.value}})}
                    helperText=""
                  >
                    {currencies.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  </div>
                  <div style={styles.fieldWrapper}>
                  <TextField
                    label="クエリ"
                    placeholder={helpEachType[this.state.feed.feedType]}
                    defaultValue=""
                    className={styles.textField}
                    helperText=""
                    value={this.state.feed.query}
                    onChange={(e)=>this.setState({feed:{...this.state.feed, query: e.target.value}})}
                  />
                  </div>
                  <Button variant="contained" style={{marginRight: 5}} color="primary" type="submit">更新</Button>
                  <Button variant="contained" onClick={()=>this.props.deleteFeed(this.state.feed)}>削除</Button>
                </form>
              }
          </div>
          {('contents' in this.props.feed) && ('data' in this.props.feed.contents) &&
            <div style={this.state.openSetting ? styles.contentListWhenOpenSetting : styles.contentList}>
              <InfiniteScroll
                pageStart={0}
                loadMore={() => this.props.loadNewContents(this.props.feed, this.props.id)}
                hasMore={true}
                loader={<div key={-1} className="loader">Loading ...</div>}
                useWindow={false}
              >
              {this.props.feed.contents.data.map((c, i)=>(
                <div style={styles.content} key={i}>
                    <div href={'https://www.nicovideo.jp/watch/'+c.contentId} target='_blank' style={{textDecoration: 'none'}}>
                      <img style={styles.thumbnail} src={c.thumbnailUrl} alt="サムネイル" onClick={()=>this.props.openPopupMovie(c.contentId)}/>
                      <span style={styles.contentTitle}>{c.title}</span>
                    </div>
                    <span style={styles.viewCount}>{c.viewCounter}</span>
                    <span style={styles.date}>{this.calcDateDiff(new Date(c.startTime.replace(/[年月日]/g,"/").replace(/：/g,":")))}</span>
                </div>
              ))}
              </InfiniteScroll>
            </div>
          }
      </div>
    )
  }
}

const styles = {
  textField:{
  },
  fieldWrapper:{
    paddingBottom: 20,
  },
  body:{
    backgroundColor: '#292929',
    height: '100%',
    width: 260,
  },
  timelineHeader:{
    border: 'solid',
    borderWidth: 0,
    borderColor: '#3b3b3b',
    borderBottomWidth: 1,
  },
  timelineHeaderHeader:{
    height: 34,
    flexWrap: 'nowrap',
    display: 'flex',
    justifyContent: 'space-between',
  },
  feedName:{
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 8,
    color: '#BCBCBC',
    fontSize: 16,
    fontFamily: 'Helvetica',
  },
  settingIcon:{
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingRight: 10,
    color: '#3b3b3b',
    fontSize: 15,
    fontFamily: 'Helvetica',
    cursor: 'pointer',
  },
  timelineHeaderSettings:{
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  contentList:{
    'overflowX': 'auto',
    height: 'calc(100% - 35px)',
  },
  contentListWhenOpenSetting:{
    'overflowX': 'auto',
    height: 'calc(100% - 353px)',
  },
  content:{
    height: 170,
    border: 'solid',
    borderWidth: 0,
    borderColor: '#1a1a1a',
    borderBottomWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    position: 'relative',
    overflow: 'hidden'
  },
  thumbnail:{
    width: 230,
    height: 130,
    objectFit: 'cover',
  },
  viewCount:{
    position: 'absolute',
    top: 129,
    right: 34,
    fontSize: 13,
    color: '#d5d5d5DA',
    fontFamily: 'Helvetica',
    textShadow: '1px 1px 0 #000'
  },
  date:{
    position: 'absolute',
    top: 127,
    left: 16,
    fontSize: 13,
    color: '#d5d5d5DA',
    fontFamily: 'Helvetica',
    textShadow: '1px 1px 0 #000'
  },
  contentTitle:{
    position: 'relative',
    color: '#DEDEDE',
    top: -3,
    display: 'block',
    lineHeight: '18px',
    fontSize: 13,
    display: '-webkit-box',
    'WebkitBoxOrient': 'vertical',
    'WebkitLineClamp': '2'
  }
}
