import React, { Component } from 'react';
import TimeLine from './timeline.js'
import Button from '@material-ui/core/Button';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

export default class Body extends Component {
  constructor(props){
    super(props);
    this.state = {
      order: [],
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      order: nextProps.feeds.map((feed, i)=>(String(i))),
    });
  }
  
  render() {
    const SortableItem = SortableElement(({value,index}) => {
      return (
        <div style={styles.timeline} key={value.timelineId}>
          <TimeLine
            id={value['index']}
            timelineId={index}
            feed = {value}
            updateFeed = {this.props.updateFeed}
            deleteFeed = {this.props.deleteFeed}
            loadNewContents = {this.props.loadNewContents}
            openPopupMovie = {this.props.openPopupMovie}
          />
        </div>
      );
    });

    const SortableList = SortableContainer(({items}) => {
      return (
        <div style={{display: 'flex'}}>
          {items.map((value, index) => {
            value['index'] = index;
            return <SortableItem key={`item-${index}`} index={index} value={value} />
          })}
        </div>
      );
    });

    return (
      <div style={styles.body}>
        <SortableList
          items={this.props.feeds}
          onSortEnd={this.props.moveFeed}
          useDragHandle={true}
          axis='x'
          lockAxis='x'
        />
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
