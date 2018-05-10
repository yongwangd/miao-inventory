import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Input, Button, message } from 'antd';
import { signinWithFirebase } from '../../fireQuery/fireConnection';
import { browserHistory } from 'react-router';
import './LoginView.scss';

@connect(state => ({
  isLoggedIn: state.auth.loggedIn,
  user: state.auth.user,
  checkingAuth: state.auth.checkingAuth
}))
class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    const { username, password } = this.state;
    console.log('loginwith', username, password);
    signinWithFirebase(username, password)
      .then(user => {
        console.log('user logged in', user);
        browserHistory.push('/');
      })
      .catch(err => message.error(err.message));
  }
  handleInputChange(field, v) {
    this.setState({
      [field]: v.target.value
    });
  }

  render() {
    const { checkingAuth, isLoggedIn } = this.props;
    const { handleLogin, handleInputChange } = this;
    console.log('username, pass', this.state);
    const { username, password } = this.state;

    if (checkingAuth) {
      return <h3> Checking Login Status </h3>;
    }

    if (isLoggedIn) {
      console.log(' render you already logged in');
      browserHistory.push('/');
      return null;
    }
    return (
      <div style={{ padding: 10 }}>
        <div className="login-page">
          <div className="form">
            <h2 className="login-header">Inventory Management System</h2>
            <p className="login-author">By Yong</p>

            <form className="login-form" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="email"
                onChange={v => handleInputChange('username', v)}
              />
              <input
                type="password"
                placeholder="password"
                onChange={v => handleInputChange('password', v)}
              />
              <button type="submit">login</button>
              <p className="message">
                {' '}
                <a style={{ cursor: 'default' }}>Hope you like it :)</a>
              </p>
            </form>
          </div>
        </div>
        <footer>
          <a href="#">
            <img src={require('./yong-made-logo.png')} />
          </a>
          <p
            style={{
              color: 'whitesmoke',
              marginTop: 15,
              fontSize: 16,
              fontWeight: 'bold'
            }}
          >
            For <a href="#">Miao</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default LoginView;
