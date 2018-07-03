import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';

export default class TimeLine extends Component {
  state = { title: '', phone: '', email: '', hint: '' };

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  render() {
    return (
      <div style={styles.body}>
          <div style={styles.timelineHeader}>
              <div style={styles.timelineHeaderHeader}>
                <span style={styles.feedName}>数学</span>
                <span style={styles.settingIcon}>>></span>
              </div>
              <div style={styles.timelineHeaderSettings}>
                <section>
                    <Input type='text' label='Name' name='name' value={this.state.name} onChange={this.handleChange.bind(this, 'name')} maxLength={16 } />
                    <Input type='text' label='Disabled field' disabled />
                    <Input type='email' label='Email address' icon='email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')} />
                    <Input type='tel' label='Phone' name='phone' icon='phone' value={this.state.phone} onChange={this.handleChange.bind(this, 'phone')} />
                    <Input type='text' value={this.state.hint} label='Required Field' hint='With Hint' required onChange={this.handleChange.bind(this, 'hint')} icon={<span>J</span>} />
                </section>
              </div>
          </div>
          <div style={styles.contentList}>
            {[0,1,2,3,4,5,6,7,8,9].map((i)=>(
                <div style={styles.content}>
                    <img style={styles.thumbnail} src="http://tn.smilevideo.jp/smile?i=33342610" alt="サムネイル"/>
                    <span style={styles.viewCount}>11,600</span>
                    <span style={styles.contentTitle}>Goldbach's partitionで遊ぼう　＠第12回日曜数学会</span>
                </div>
            ))}
          </div>
      </div>
    )
  }
}

const styles = {
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
  },
  timelineHeaderSettings:{

  },
  contentList:{
    'overflow-x': 'auto',
    height: 'calc(100% - 200px)',
  },
  contentList2:{
    'overflow-x': 'auto',
    height: 'calc(100% - 35px)',
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
    fontSize: 13,
  }
}
