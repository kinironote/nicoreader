import React, { Component } from 'react';
import Header from './components/header.js';
import Body from './components/body.js';
import axios from 'axios';
import { withCookies } from 'react-cookie';

class App extends Component {
  constructor(props){
    super(props);
    this.apiURL = 'http://'+(window.location.hostname)+':3000/api'
    this.state = {
      username: null,
      token: this.props.cookies.get('token') || null,
      userid: this.props.cookies.get('userid') || null,
      feeds: [],
      isGuest: this.props.cookies.get('isGuest') === '1'
    }
  }
  signin = async (username, password) => {
    console.log("signin");
    this.setState({isGuest: false});
    this.props.cookies.remove('isGuest');
    try {
      const response = await axios.post(this.apiURL+'/Accounts/login', {
        username: username,
        password: password
      })
      console.log(response)
      axios.defaults.headers.common['Authorization'] = response.data.id;
      this.setState({token: response.data.id, userid: response.data.userId, username: username})
      this.props.cookies.set('token', this.state.token);
      this.props.cookies.set('userid', this.state.userid);
      this.fetchAllContents();
      return {status:'success'}
    }catch(error){
      return {status:'error', message:'ユーザー名またはパスワードが違います'}
    }
  }
  signup = async (username, password, email) => {
    console.log("signup")
    try {
      const response = await axios.put(this.apiURL+'/Accounts/'+this.state.userid, {
        username: username,
        email: email,
        password: password
      })
      console.log(response)
    }catch(error){
      return {status:'error', message:'そのユーザー名またはメールアドレスはすでに登録されています'}
    }
    this.setState({isGuest: false});
    this.props.cookies.remove('isGuest');
    // Todo: メールアドレス認証
    try {
      const response = await axios.post(this.apiURL+'/Accounts/login', {
        username: username,
        password: password
      })
      console.log(response)
      axios.defaults.headers.common['Authorization'] = response.data.id;
      this.setState({token: response.data.id, userid: response.data.userId, username: username})
      this.props.cookies.set('token', this.state.token);
      this.props.cookies.set('userid', this.state.userid);
      this.fetchAllContents();
      return {status:'success'}
    }catch(error){
      return {status:'error', message:'ユーザー名またはパスワードが違います'}
    }
  }
  guestLogin = async () => {
    var username = null;
    var password = null;
    try {
      const response = await axios.get(this.apiURL+'/Accounts/spawn-guest')
      console.log(response);
      username = response.data.response.username;
      password = response.data.response.password;
    }catch(error){
      return {status:'error', message:'unknown error occured.'}
    }
    console.log("set isGuest");
    this.props.cookies.set('isGuest', '1');
    this.setState({isGuest: true});
    try {
      const response = await axios.post(this.apiURL+'/Accounts/login', {
        username: username,
        password: password
      })
      console.log(response)
      axios.defaults.headers.common['Authorization'] = response.data.id;
      this.setState({token: response.data.id, userid: response.data.userId, username: username})
      this.props.cookies.set('token', this.state.token);
      this.props.cookies.set('userid', this.state.userid);
      this.fetchContents();
      return {status:'success'}
    }catch(error){
      return {status:'error', message:'ユーザー名またはパスワードが違います'}
    }
  }
  logout = async () => {
    this.setState({username: null, password: null, token: null, userid: null, feeds: []})
    this.props.cookies.remove('token');
    this.props.cookies.remove('userid');
    delete axios.defaults.headers.common['Authorization'];
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
            ownerId: this.state.userid
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
    const contents_list = raw_contents_list.map((feed, i)=>{
      console.log(feed);
      if (feed_list[i].feedType === 'user' || feed_list[i].feedType === 'mylist') {
        return JSON.parse(feed.data.response);
      } else if (feed_list[i].feedType === 'search' || feed_list[i].feedType === 'tags') {
        return JSON.parse(feed.data.response);
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
    console.log(feeds)
    this.setState({feeds: feeds})
  }
  deleteFeed = async (feed) => {
    console.log(feed);
    if('id' in feed){
      console.log("delete feed");
      console.log(feed);
      const response = await axios.delete(this.apiURL+'/Feeds/'+feed.id);
      console.log(response);
    }else{
    }
    this.deleteFeedState(feed);
  }
  updateFeed = async (feed) => {
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
  async componentWillMount(){
    axios.defaults.headers.common['Authorization'] = this.state.token;
    if(this.state.token == null){
      await this.guestLogin();
    }
    this.fetchContents();
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
          loggedIn = {this.state.token !== null && this.state.isGuest === false}
        />
        <Body
          loggedIn = {this.state.token !== null}
          feeds = {this.state.feeds}
          updateFeed = {this.updateFeed}
          addNewFeed = {this.addNewFeed}
          deleteFeed = {this.deleteFeed}
        />
      </div>
    );
  }
}

export default withCookies(App);
