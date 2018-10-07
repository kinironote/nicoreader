import React, { Component } from 'react';
import Header from './components/header.js';
import Body from './components/body.js';
import axios from 'axios';
import { withCookies } from 'react-cookie';

class App extends Component {
  constructor(props){
    super(props);
    this.apiURL = 'http://localhost:3000/api'
    this.state = {
      username: '',
      token: this.props.cookies.get('token') || '',
      userid: this.props.cookies.get('userid') || '',
      feeds: []
    }
  }
  signin = async (username, password) => {
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
    try {
      const response = await axios.post(this.apiURL+'/Accounts', {
        username: username,
        email: email,
        password: password
      })
      console.log(response)
    }catch(error){
      return {status:'error', message:'そのユーザー名またはメールアドレスはすでに登録されています'}
    }
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
  logout = async () => {
    this.setState({username: '', password: '', token: '',feeds: []})
    this.props.cookies.set('token', null);
    this.props.cookies.set('userid', null);
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
  componentWillMount(){
    axios.defaults.headers.common['Authorization'] = this.state.token;
    this.fetchAllContents();
  }
  render() {
    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet"></link>
        <Header
          signin = {this.signin}
          signup = {this.signup}
          logout = {this.logout}
          loggedIn = {this.state.token != null}
        />
        <Body
          loggedIn = {this.state.token !== ''}
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
