import React, { Component } from 'react';
import axios from 'axios';
import Alert from './alert.component';

import {
  getFromStorage,
  setInStorage,
} from '../utils/storage';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpMessage: '',
      signInMessage: '',
      signInEmail: '',
      signInPassword: '',
      signUpUserName: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpUserName = this.onTextboxChangeSignUpUserName.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // Verify that the user is logged in, and get the user's username.
    // This function is duplicated in home, create-project, create-task
    const obj = getFromStorage('project_tracker');
    if (obj && obj.token) {
      // Verify token
      axios.get('http://localhost:5000/api/account/verify?token=' + obj.token)
        .then(res => {
          const data = res.data;
          console.log(data);
          if(data.success) {
            this.setState({
              username: obj.username,
              token: obj.token,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            })
          }
        })
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    })
  }
  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    })
  }
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    })
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    })
  }
  onTextboxChangeSignUpUserName(event) {
    this.setState({
      signUpUserName: event.target.value
    })
  }
  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value
    })
  }
  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value
    })
  }

  onSignUp() {
    // Grab state
    const signUpInfo = {
      username: this.state.signUpUserName,
      firstName: this.state.signUpFirstName,
      lastName: this.state.signUpLastName,
      email: this.state.signUpEmail,
      password: this.state.signUpPassword,
    }

    this.setState({
      isLoading: true,
    });

    axios.post('http://localhost:5000/api/account/signup', signUpInfo)
      .then(res => {
        this.setState({
          success: res.data.success,
          signUpMessage: res.data.message,
          isLoading: false,
          signUpFirstName: '',
          signUpLastName: '',
          signUpEmail: '',
          signUpPassword: '',
          signInMessage: null,
        })
      });
  }

  onSignIn() {
    // Grab state
    const signInInfo = {
      email: this.state.signInEmail,
      password: this.state.signInPassword,
    }

    this.setState({
      isLoading: true,
    });

    axios.post('http://localhost:5000/api/account/signin', signInInfo)
    .then(res => {
      let data = res.data;
      console.log(data);
      if(data.success) {
        console.log("user successfully signed in as " + data.username + " aka " + data.userId);
        setInStorage('project_tracker', { token: data.token, username: data.username, userId: data.userId });
        this.setState({
          token: data.token,
          username: data.username,
          signInEmail: '',
          signInPassword: '',
        })
      }
      this.setState({
        success: res.data.success,
        signInMessage: res.data.message,
        signUpMessage: null,
        isLoading: false,
      })
    });
  }

  logout() {
    this.setState({
      isLoading: true
    })
    const obj = getFromStorage('project_tracker');
    if (obj && obj.token) {
      // Verify token
      axios.get('http://localhost:5000/api/account/logout?token=' + obj.token)
        .then(res => {
          if(res.data.success) {
            this.setState({
              token: '', // reset the token, the use is now logged out
            });
          }
          this.setState({isLoading: false})
        });
    } else {
      this.setState({isLoading: false})
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInMessage,
      signInEmail,
      signInPassword,
      signUpUserName,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpMessage,
      success,
    } = this.state;
    
    if (isLoading) {
      return(<div><p></p></div>)
    }

    if (!token) {
      return (
        <div>
          <div>
          <div>
            <Alert message={signInMessage} success={success}></Alert>
          </div>
          </div>
          {/* Sign In Form */}
          <div>
            <p>Sign in</p>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br/>
          <br/>
          {/* Sign Up Success/Error message */}
          <div>
            <Alert message={signUpMessage} success={success}></Alert>
          </div>
          <div>
            {
              (signUpMessage && success) ? (
                <div className="alert alert-success">
                  <p>{signUpMessage}</p>
                </div>
              ) : (null)
            }
          </div>
          {/* Sign Up Form */}
          <div>
            <p>Sign Up</p>
            <input 
              type="text" 
              placeholder="Username" 
              value={signUpUserName}
              onChange={this.onTextboxChangeSignUpUserName}
            /><br/>
            <input 
              type="text" 
              placeholder="First Name" 
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            /><br/>
            <input 
              type="text" 
              placeholder="Last Name" 
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
            /><br/>
            <input 
              type="email" 
              placeholder="Email" 
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            /><br/>
            <input 
              type="password" 
              placeholder="Password" 
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            /><br/>
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p>Welcome {this.state.username}!</p>
        <button onClick={this.logout} className="btn btn-primary">Log Out</button>
      </div>
    );
  }
}
