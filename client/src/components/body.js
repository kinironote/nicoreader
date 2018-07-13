import React, { Component } from 'react';
import TimeLine from './timeline.js'
import Button from '@material-ui/core/Button';

export default class Body extends Component {
  render() {
    return (
      <div style={styles.body}>
        {console.log(this.props.feeds)}
          {this.props.feeds.map((feed, i)=>(
            <div style={styles.timeline} key={feed.timelineId}>
              <TimeLine
                timelineId={i}
                style={styles.timeline}
                feed = {feed}
                updateFeed = {this.props.updateFeed}
                deleteFeed = {this.props.deleteFeed}
              />
            </div>
          ))}
          {this.props.loggedIn &&
            <div style={styles.timeline}>
              <span>
                <Button style={styles.addButton} onClick={()=>this.props.addNewFeed()}> + </Button>
              </span>
            </div>
          }
      </div>
    )
  }
}

const styles = {
  body:{
      backgroundColor: '#1A1A1A',
      height: 'calc(100% - 40px)',
      minWidth: '100%',
      'overflowX': 'auto',
      'display': 'flex',
  },
  timeline:{
      display: 'inline-block',
      paddingTop: 12,
      paddingLeft: 9,
      paddingRight: 9,
  },
  addButton:{
    backgroundColor: '#292929',
    height: '100%',
    width: 260,
    fontSize: '50px',
  }
}
