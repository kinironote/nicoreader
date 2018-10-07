import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: this.props.loggedIn,
      popupSignin: false,
      popupSignup: false,
      popupMessage: null,
      username: "",
      email: "",
      password: "",
    };

  }

  signin = async ()=>{
    const res = await this.props.signin(this.state.username, this.state.password)
    if(res.status === 'success')
      this.setState({popupSignin: false, loggedIn: true});
    else
      this.setState({popupMessage: res.message});
  }

  signup = async ()=>{
    const res = await this.props.signup(this.state.username, this.state.password, this.state.email)
    if(res.status === 'success')
      this.setState({popupSignup: false, loggedIn: true});
    else
      this.setState({popupMessage: res.message});
  }

  logout = () =>{
    console.log("lgout");
    this.props.logout();
    this.setState({loggedIn: false, username: '', password: '', email: ''});
  }

  render() {
    return (
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.title}>NicoReader</div>
        </div>
        <div style={styles.buttonWrapper}>
          {!this.state.loggedIn &&
            <div style={styles.headerButton}>
              <div style={styles.headerButtonText} onClick={()=>this.setState({popupSignup: true})}>Signup</div>
            </div>
          }
          {!this.state.loggedIn &&
            <div style={styles.headerButton}>
              <div style={styles.headerButtonText} onClick={()=>this.setState({popupSignin: true})}>Signin</div>
            </div>
          }
          {this.state.loggedIn &&
            <div style={styles.headerButton}>
              <div style={styles.headerButtonText} onClick={this.logout}>Logout</div>
            </div>
          }
        </div>
        {this.state.popupSignin &&
          <div className='popup'>
            <div className='popup_inner'>
              <h1>サインイン</h1>
              {this.state.popupMessage != null &&
                <span style={{color: 'red', fontSize: 10}}>{this.state.popupMessage}</span>
              }
              <form onSubmit={(e)=>{this.signin(); e.preventDefault();}}>
                <TextField
                  type='text'
                  label="ユーザー名"
                  defaultValue=""
                  value={this.state.username}
                  onChange={(e)=>this.setState({username:e.target.value})}
                />
                <br />
                <TextField
                  type='password'
                  label="パスワード"
                  value={this.state.password}
                  onChange={(e)=>this.setState({password:e.target.value})}
                />
                <br />
                <Button type="submit">ログイン</Button>
                <Button onClick={()=>this.setState({popupSignin: false})}>閉じる</Button>
              </form>
            </div>
          </div>
        }
        {this.state.popupSignup &&
          <div className='popup'>
            <div className='popup_inner'>
              <h1>サインアップ</h1>
              {this.state.popupMessage != null &&
                <span style={{color: 'red', fontSize: 10}}>{this.state.popupMessage}</span>
              }
              <form onSubmit={(e)=>{this.signup(); e.preventDefault();}}>
                <TextField
                  type='text'
                  label="ユーザー名"
                  defaultValue=""
                  value={this.state.username}
                  onChange={(e)=>this.setState({username:e.target.value})}
                />
                <br />
                <TextField
                  type='password'
                  label="パスワード"
                  value={this.state.password}
                  onChange={(e)=>this.setState({password:e.target.value})}
                />
                <br />
                <TextField
                  type='email'
                  label="メールアドレス"
                  defaultValue=""
                  value={this.state.email}
                  onChange={(e)=>this.setState({email:e.target.value})}
                />
                <br />
                <br />
                <Button type="submit">登録</Button>
                <Button onClick={()=>this.setState({popupSignup: false})}>閉じる</Button>
              </form>
            </div>
          </div>
        }
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
    'WebkitFontSmoothing': 'antialiased',
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
    cursor: 'pointer',
  }
}
