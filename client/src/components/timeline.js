import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

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

export default class TimeLine extends Component {
  constructor(props){
    super(props);
    this.state = {
      feed: this.props.feed,
      openSetting: ('contents' in this.props.feed) ? false : true,
    }
    this.state.feed.feedType = this.state.feed.feedType ? this.state.feed.feedType : "search";
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  render() {
    return (
      <div style={styles.body}>
          <div style={styles.timelineHeader}>
              <div style={styles.timelineHeaderHeader}>
                <span style={styles.feedName}>{this.props.feed.feedName}</span>
                <span style={styles.settingIcon} onClick={()=>this.setState({openSetting: !this.state.openSetting})}>>></span>
              </div>
              {this.state.openSetting &&
                <div style={styles.timelineHeaderSettings}>
                  <div style={styles.fieldWrapper}>
                  <TextField
                    label="タイトル"
                    defaultValue=""
                    className={styles.textField}
                    helperText=""
                    value={this.state.feed.feedName}
                    onChange={(e)=>this.setState({feed:{...this.state.feed, feedName: e.target.value}})}
                  />
                  </div><div style={styles.fieldWrapper}>
                  <TextField
                    id="select-currency"
                    select
                    label="検索タイプ"
                    className={styles.textField}
                    value={this.state.feed.feedType ? this.state.feed.feedType : "search"}
                    onChange={(e)=>this.setState({feed:{...this.state.feed, feedType: e.target.value}})}
                    helperText=""
                  >
                    {currencies.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  </div><div style={styles.fieldWrapper}>
                  <TextField
                    id="multiline-static"
                    multiline
                    rows="3"
                    label="検索文字列"
                    defaultValue=""
                    className={styles.textField}
                    helperText=""
                    value={this.state.feed.query}
                    onChange={(e)=>this.setState({feed:{...this.state.feed, query: e.target.value}})}
                  />
                  </div>
                  <Button variant="contained" style={{marginRight: 5}} color="primary" onClick={()=>this.props.updateFeed(this.state.feed)}>更新</Button>
                  <Button variant="contained" onClick={()=>this.props.deleteFeed(this.state.feed)}>削除</Button>
                </div>
              }
          </div>
          {('contents' in this.props.feed) &&
            <div style={this.state.openSetting ? styles.contentListWhenOpenSetting : styles.contentList}>
              {this.props.feed.contents.data.map((c)=>(
                <div style={styles.content}>
                    <a href={'http://www.nicovideo.jp/watch/'+c.contentId} target='_blank' style={{textDecoration: 'none'}}>
                      <img style={styles.thumbnail} src={c.thumbnailUrl} alt="サムネイル"/>
                      <span style={styles.contentTitle}>{c.title}</span>
                    </a>
                    <span style={styles.viewCount}>{c.viewCounter}</span>
                </div>
              ))}
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
    position: 'relative',
  },
  feedName:{
    height: '100%',
    position: 'absolute',
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
    justifyContent: 'flex-end',
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
    'overflow-x': 'auto',
    height: 'calc(100% - 35px)',
  },
  contentListWhenOpenSetting:{
    'overflow-x': 'auto',
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
  },
  contentTitle:{
    position: 'relative',
    color: '#DEDEDE',
    top: -4,
    display: 'block',
    lineHeight: '18px',
    fontSize: 13
  }
}
