import React, { Component } from 'react';
import ReactModalLogin from 'react-modal-login';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      loggedIn: null,
      loading: false,
      error: null,
      initialTab: null,
      recoverPasswordSuccess: null,
    };

  }


  onLogin() {
    console.log('__onLogin__');
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!email || !password) {
      this.setState({
        error: true
      })
    } else {
      this.onLoginSuccess('form');
    }
  }

  onRegister() {
    console.log('__onRegister__');
    console.log('login: ' + document.querySelector('#login').value);
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);

    const login = document.querySelector('#login').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!login || !email || !password) {
      this.setState({
        error: true
      })
    } else {
      this.onLoginSuccess('form');
    }
  }

  onRecoverPassword() {
    console.log('__onFotgottenPassword__');
    console.log('email: ' + document.querySelector('#email').value);

    const email = document.querySelector('#email').value;


    if (!email) {
      this.setState({
        error: true,
        recoverPasswordSuccess: false
      })
    } else {
      this.setState({
        error: null,
        recoverPasswordSuccess: true
      });
    }
  }

  openModal(initialTab) {
    this.setState({
      initialTab: initialTab
    }, () => {
      this.setState({
        showModal: true,
      })
    });
  }

  onLoginSuccess(method, response) {

    this.closeModal();
    this.setState({
      loggedIn: method,
      loading: false
    })
  }

  onLoginFail(method, response) {

    this.setState({
      loading: false,
      error: response
    })
  }

  startLoading() {
    this.setState({
      loading: true
    })
  }

  finishLoading() {
    this.setState({
      loading: false
    })
  }

  afterTabsChange() {
    this.setState({
      error: null,
      recoverPasswordSuccess: false,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null
    });
  }


  render() {
    const isLoading = this.state.loading;
    return (
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.title}>NicoReader</div>
        </div>
        <div style={styles.buttonWrapper}>
          <div style={styles.headerButton}>
            <button
              style={styles.headerButtonText}
              onClick={() => this.openModal()}
            >
              Login
            </button>
            <ReactModalLogin
              visible={this.state.showModal}
              onCloseModal={this.closeModal.bind(this)}
              loading={isLoading}
              initialTab={this.state.initialTab}
              error={this.state.error}
              tabs={{
                afterChange: this.afterTabsChange.bind(this)
              }}
              startLoading={this.startLoading.bind(this)}
              finishLoading={this.finishLoading.bind(this)}
              form={{
                onLogin: this.onLogin.bind(this),
                onRegister: this.onRegister.bind(this),
                onRecoverPassword: this.onRecoverPassword.bind(this),

                recoverPasswordSuccessLabel: this.state.recoverPasswordSuccess
                  ? {
                      label: "New password has been sent to your mailbox!"
                    }
                  : null,
                recoverPasswordAnchor: {
                  label: "Forgot your password?"
                },
                loginBtn: {
                  label: "Sign in"
                },
                registerBtn: {
                  label: "Sign up"
                },
                recoverPasswordBtn: {
                  label: "Send new password"
                },
                loginInputs: [
                  {
                    containerClass: 'RML-form-group',
                    label: 'Email',
                    type: 'email',
                    inputClass: 'RML-form-control',
                    id: 'email',
                    name: 'email',
                    placeholder: 'Email',
                  },
                  {
                    containerClass: 'RML-form-group',
                    label: 'Password',
                    type: 'password',
                    inputClass: 'RML-form-control',
                    id: 'password',
                    name: 'password',
                    placeholder: 'Password',
                  }
                ],
                registerInputs: [
                  {
                    containerClass: 'RML-form-group',
                    label: 'Nickname',
                    type: 'text',
                    inputClass: 'RML-form-control',
                    id: 'login',
                    name: 'login',
                    placeholder: 'Nickname',
                  },
                  {
                    containerClass: 'RML-form-group',
                    label: 'Email',
                    type: 'email',
                    inputClass: 'RML-form-control',
                    id: 'email',
                    name: 'email',
                    placeholder: 'Email',
                  },
                  {
                    containerClass: 'RML-form-group',
                    label: 'Password',
                    type: 'password',
                    inputClass: 'RML-form-control',
                    id: 'password',
                    name: 'password',
                    placeholder: 'Password',
                  }
                ],
                recoverPasswordInputs: [
                  {
                    containerClass: 'RML-form-group',
                    label: 'Email',
                    type: 'email',
                    inputClass: 'RML-form-control',
                    id: 'email',
                    name: 'email',
                    placeholder: 'Email',
                  },
                ],
              }}
            />
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
