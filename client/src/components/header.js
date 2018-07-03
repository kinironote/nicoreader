import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.title}>NicoReader</div>
        </div>
        <div style={styles.buttonWrapper}>
          <div style={styles.headerButton}>
            <div style={styles.headerButtonText}>Signup</div>
          </div>
          <div style={styles.headerButton}>
            <div style={styles.headerButtonText}>Login</div>
          </div>
          <div style={styles.headerButton}>
            <div style={styles.headerButtonText}>Logout</div>
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  header:{
    backgroundColor: '#292929',
    height: 40,
    color: '#CECECE',
    fontFamily: ['PT Sans', 'sans-serif'],
    '-webkit-font-smoothing': 'antialiased',
    position: 'relative',
  },
  titleWrapper:{
    margin: 'auto',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  title:{
    fontSize: 20,
  },
  buttonWrapper:{
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  headerButton:{
    width: 80,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    float: 'right',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText:{
    fontSize: 15,
  }
}
