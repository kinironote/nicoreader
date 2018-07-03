import React, { Component } from 'react';
import TimeLine from './timeline.js'

export default class Body extends Component {
  render() {
    return (
      <div style={styles.body}>
          {[0,1,2,3,4,5,6,7,8,9].map((i)=>(
            <div style={styles.timeline}>
                <TimeLine style={styles.timeline}/>
            </div>
          ))}
      </div>
    )
  }
}

const styles = {
  body:{
      backgroundColor: '#1A1A1A',
      height: 'calc(100% - 40px)',
      minWidth: '100%',
      'overflow-x': 'auto',
      'display': 'flex',
  },
  timeline:{
      display: 'inline-block',
      paddingTop: 12,
      paddingLeft: 9,
      paddingRight: 9,
  }
}
