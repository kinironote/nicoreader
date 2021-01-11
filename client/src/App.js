import React, { Component } from 'react';
import Header from './components/header.js';
import Body from './components/body.js';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import Popup from "reactjs-popup";

class App extends Component {
  constructor(props){
    super(props);
    this.apiURL = 'api/api'
    const cook = (key) => this.props.cookies.get(key) && JSON.parse(this.props.cookies.get(key).slice(1,-1));
    this.state = {
      username: null,
      token: cook('token'),
      userId: cook('userId'),
      feeds: [],
      isGuest: cook('isGuest') || false,
      isAuthorized: cook('isAuthorized') || false,
      movieOpened: false,
      movieContentId: null,
      loadingMovie: false,
    }
    console.log("constructor");
    console.log(this.state);
    window.addEventListener('message', (e) => {
      if(e.origin === 'https://embed.nicovideo.jp'){
        if(e.data.eventName === 'loadComplete'){
          this.setState({loadingMovie: false})
        }
      }
    });
  }
  update = async (data) => {
    await this.setState(data);
    const cookie_list = {
      token: this.state.token,
      userId: this.state.userId,
      isGuest: this.state.isGuest,
      isAuthorized: this.state.isAuthorized
    }
    for(let [key, value] of Object.entries(cookie_list)){
      if(value == null) await this.props.cookies.remove(key);
      else await this.props.cookies.set(key, "'"+JSON.stringify(value)+"'");
      console.log('set'+JSON.stringify(value));
    }
    if(this.state.isAuthorized){
      axios.defaults.headers.common['Authorization'] = this.state.token;
    }else{
      delete axios.defaults.headers.common['Authorization'];
    }
  }
  signin = async (username, password, isGuest = false) => {
    try {
      const response = await axios.post(this.apiURL+'/Accounts/login', {
        username: username,
        password: password
      })
      const user = response.data;
      console.log(user)
      axios.defaults.headers.common['Authorization'] = user.id;
      this.update({token: user.id, userId: user.userId, username: username, isGuest: false})
      const feeds = await this.fetchAllContents();
      this.setState({feeds: feeds});
      return {status:'success'}
    }catch(error){
      return {status:'error', message:'ユーザー名またはパスワードが違います'}
    }
  }
  signup = async (username, password, email) => {
    try {
      const response = await axios.put(this.apiURL+'/Accounts/'+this.state.userId, {
        username: username,
        email: email,
        password: password
      })
      console.log(response)
    }catch(error){
      return {status:'error', message:'そのユーザー名またはメールアドレスはすでに登録されています'}
    }
    this.update({isGuest: false});
    // Todo: メールアドレス認証
    try {
      const response = await axios.post(this.apiURL+'/Accounts/login', {
        username: username,
        password: password
      })
      console.log(response)
      axios.defaults.headers.common['Authorization'] = response.data.id;
      this.update({token: response.data.id, userId: response.data.userId, username: username})
      const feeds = await this.fetchAllContents();
      this.setState({feeds: feeds});
      return {status:'success'}
    }catch(error){
      return {status:'error', message:'そのユーザー名またはメールアドレスはすでに登録されています'}
    }
  }
  guestLogin = async () => {
    let username = null;
    let password = null;
    try {
      const response = await axios.get(this.apiURL+'/Accounts/spawn-guest')
      console.log(response);
      username = response.data.response.username;
      password = response.data.response.password;
    }catch(error){
      return {status:'error', message:'unknown error occured.'}
    }
    console.log("set isGuest");
    this.update({isGuest: true});
    try {
      const response = await axios.post(this.apiURL+'/Accounts/login', {
        username: username,
        password: password
      })
      console.log(response)
      axios.defaults.headers.common['Authorization'] = response.data.id;
      this.update({token: response.data.id, userId: response.data.userId, username: username, isAuthorized: true})
      const feeds = await this.fetchAllContents();
      this.setState({feeds: feeds});
      return {status:'success'}
    }catch(error){
      return {status:'error', message:'unknown error occured.'}
    }
  }
  logout = async () => {
    await this.update({
      username: null,
      token: null,
      userId: null,
      feeds: [],
      isGuest: false,
      isAuthorized: false
    })
    await this.guestLogin();
  }
  updateFeedState = (feed) => {
    const index = this.state.feeds.findIndex((e)=>e.timelineId === feed.timelineId);
    if(index === -1){
      this.setState({feeds: [...this.state.feeds, feed]})
    }else{
      var newFeeds = this.state.feeds;
      newFeeds[index] = feed;
      this.setState({feeds: newFeeds})
    }
  }
  deleteFeedState = (feed) => {
    const index = this.state.feeds.findIndex((e)=>e.timelineId === feed.timelineId);
    if(index === -1){
    }else{
      var newFeeds = this.state.feeds;
      newFeeds.splice(index, 1);
      this.setState({feeds: newFeeds})
    }
  }
  fetchContents = async (feed) => {
    console.log("fetch contents");
    console.log(feed);
    const raw_contents = await axios.get(this.apiURL+'/Feeds/'+feed.id+'/request-feed', {});
    const contents = JSON.parse(raw_contents.data.response);
    if (feed.feedType === 'user' || feed.feedType === 'mylist') {
      feed['contents'] = {data:contents,meta:{}};
    } else if (feed.feedType === 'search' || feed.feedType === 'tags') {
      feed['contents'] = contents;
    }else{
    }
    console.log(feed)
    this.updateFeedState(feed);
  }
  fetchAllContents = async () => {
    console.log("fetch all contents");
    this.setState({feeds:[]})
    const raw_feed_list = await axios.get(this.apiURL+'/Feeds', {
      params: {
        filter: {
          where: {
            ownerId: this.state.userId
          },
          order: 'timelineId ASC'
        }
      }
    });
    const feed_list = raw_feed_list.data;
    const raw_contents_list = await Promise.all(
      feed_list.map((feed)=>{
        const res = axios.get(this.apiURL+'/Feeds/'+feed.id+'/request-feed', {
          // no params
        });
        return res;
      })
    );
    const contents_list = raw_contents_list.map((raw_contents, i)=>{
      if (feed_list[i].feedType === 'user' || feed_list[i].feedType === 'mylist') {
        return JSON.parse(raw_contents.data.response);
      } else if (feed_list[i].feedType === 'search' || feed_list[i].feedType === 'tags') {
        return JSON.parse(raw_contents.data.response);
      }else{
        return "";
      }
    })
    const feeds = feed_list.map((feed, i)=>{
      if (feed_list[i].feedType === 'user' || feed_list[i].feedType === 'mylist') {
        feed['contents'] = {data:contents_list[i],meta:{}};
      } else if (feed_list[i].feedType === 'search' || feed_list[i].feedType === 'tags') {
        feed['contents'] = contents_list[i];
      }else{
      }
      return feed;
    })
    return feeds
  }
  fetchNewContents = async (feed) => {
    const raw_contents = await axios.get(this.apiURL+'/Feeds/'+feed.id+'/request-feed', {
      params: {
        offset: feed['offset']
      }
    });
    const contents = (() => {
      if (feed.feedType === 'user' || feed.feedType === 'mylist') {
        return JSON.parse(raw_contents.data.response);
      } else if (feed.feedType === 'search' || feed.feedType === 'tags') {
        return JSON.parse(raw_contents.data.response);
      }else{
        return "";
      }
    })();
    if (feed.feedType === 'user' || feed.feedType === 'mylist') {
      return {data:contents,meta:{}};
    } else if (feed.feedType === 'search' || feed.feedType === 'tags') {
      return contents;
    }else{
    }
  }
  loadNewContents = async (feed, i) => {
    if(!('offset' in feed)) feed['offset'] = 0;
    feed['offset'] += 1;
    const new_contents = await this.fetchNewContents(feed);
    var new_feeds = this.state.feeds;
    new_feeds[i]['contents']['data'] = new_feeds[i]['contents']['data'].concat(new_contents['data']);
    new_feeds[i]['offset'] = feed['offset'];
    this.setState({feeds: new_feeds});
  }
  deleteFeed = async (feed) => {
    if('id' in feed){
      await axios.delete(this.apiURL+'/Feeds/'+feed.id);
    }else{
      // pass
    }
    this.deleteFeedState(feed);
  }
  updateFeed = async (feed) => {
    console.log("update feed");
    console.log(feed);
    if('id' in feed){
      // update
      console.log("update feed");
      console.log(feed);
      const response = await axios.put(this.apiURL+'/Feeds',{
        id: feed.id,
        feedName: feed.feedName,
        feedType: feed.feedType,
        query: feed.query
      })
      console.log(response);
      const newFeed = response.data;
      this.fetchContents(newFeed);
    }else{
      // create
      console.log("create feed");
      console.log(feed);
      const response = await axios.post(this.apiURL+'/Feeds',{
        feedName: feed.feedName,
        feedType: feed.feedType,
        query: feed.query,
        timelineId: feed.timelineId
      })
      console.log(response);
      const newFeed = response.data;
      this.fetchContents(newFeed);
    }
  }
  addNewFeed = ()=>{
    console.log(this.state.feeds);
    const feed = {
      feedName: "",
      feedType: "tags",
      query: "",
      timelineId: this.state.feeds.length === 0 ? 0 : this.state.feeds[this.state.feeds.length - 1].timelineId + 1
    };
    this.updateFeed(feed);
  }
  moveFeed = async ({oldIndex, newIndex}) => {
    console.log("move feed",oldIndex,newIndex,this.state.feeds[newIndex].timelineId)

    const fromTimelineId = this.state.feeds[oldIndex].timelineId;
    const toTimelineId = this.state.feeds[newIndex].timelineId;
    await axios.put(this.apiURL+'/Feeds', {
      fromTimelineId,
      toTimelineId
    })

    const feeds = await this.fetchAllContents();
    this.setState({feeds: feeds});
  };
  openPopupMovie = (contentId)=>{
    this.setState({
      movieOpened: true,
      movieContentId: contentId,
      loadingMovie: true,
    })
  }
  closePopupMovie = ()=>{
    this.setState({movieOpened: false})
  }
  async componentWillMount(){
    if(this.state.isAuthorized){
      this.update();
      const feeds = await this.fetchAllContents();
      this.setState({feeds: feeds});
    }else{
      console.log("guestLogin");
      console.log(this.state);
      this.guestLogin();
    }
  }
  render() {
    console.log(this.props.cookies.cookies);
    console.log(this.state);
    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet"></link>
        <Header
          signin = {this.signin}
          signup = {this.signup}
          logout = {this.logout}
          loggedIn = {this.state.isAuthorized === true && this.state.isGuest === false}
        />
        <Body
          loggedIn = {this.state.isAuthorized}
          feeds = {this.state.feeds}
          updateFeed = {this.updateFeed}
          addNewFeed = {this.addNewFeed}
          deleteFeed = {this.deleteFeed}
          loadNewContents = {this.loadNewContents}
          openPopupMovie = {this.openPopupMovie}
          moveFeed = {this.moveFeed}
        />
        <Popup
          modal
          closeOnDocumentClick
          open={this.state.movieOpened}
          onClose={this.closePopupMovie}
          contentStyle={{display: this.state.loadingMovie ? 'none' : '',...styles.moviePopup, ...(()=>{
            const ratio = 0.7
            if(window.innerWidth < window.innerHeight){
              return {
                width: window.innerWidth * ratio,
                height: window.innerWidth * ratio * (130 / 230),
              }
            }else{
              return {
                width: window.innerHeight * ratio * (230 / 130),
                height: window.innerHeight * ratio,
              }
            }
          })()}}
        >
          <iframe
            src={"https://embed.nicovideo.jp/watch/"+this.state.movieContentId+"?jsapi=1"}
            title="movie"
            frameBorder="0"
            allowFullScreen
            style={styles.movie}
          >
          </iframe>
        </Popup>
      </div>
    );
  }
}

export default withCookies(App);

const styles = {
  moviePopup:{
    border: 'none',
    padding: 'none',
  },
  movie:{
    height: '100%',
    width: '100%',
  }
}
