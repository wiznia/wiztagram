import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import firebase from 'firebase';
import base, { firebaseApp } from './base';
import './App.scss';
import samplePhotos from './sample-photos';
import Post from './components/Post';
import Modals from './components/Modals';
import Profile from './components/Profile';

class App extends Component {
  fullName = React.createRef();
  signupEmail = React.createRef();
  signupPassword = React.createRef();
  loginEmail = React.createRef();
  loginPassword = React.createRef();
  resetPasswordEmail = React.createRef();
  state = {
    app: {
      uid: null,
      owner: null,
      photos: samplePhotos,
      user: null,
      loading: true
    },
    signupPopup: false,
    loginPopup: false,
    resetPasswordPopup: false
  }

  addComment = (comment, key, username) => {
    const photos = {...this.state.app.photos};
    let timeStamp = (new Date()).getTime();
   
    if (!photos[key].comments) {
      photos[key]['comments'] = [];
    }

    photos[key].comments[`comment-id${timeStamp}`] = {
      user: username,
      comment
    };

    this.setState({
      app: {
        photos
      }
    });
  }

  removeComment = (comment, key) => {
    const photos = {...this.state.app.photos};
    
    photos[key].comments[comment] = null;
    this.setState({
      app: {
        photos
      }
    });
  }

  authHandler = async (authData) => {
    const fullName = authData.user.displayName || this.fullName.current.value;
    const login = await base.fetch('/', { context: this });
    const photoURL = authData.user.photoURL;

    // Sends email verification for new users only
    if (authData.additionalUserInfo.isNewUser) {
      authData.user.sendEmailVerification().then(() => {
        this.setState({
          error: null,
          info: 'We sent you an email to confirm your account.'
        });

        setTimeout(() => {
          this.setState({
            signupPopup: false
          });
        }, 3000);
      });
    }

    // Sets the username provided by the user on the sign in popup
    if (authData.operationType === 'signIn') {
      authData.user.updateProfile({
        displayName: fullName
      }).then((res) => {
        this.setState({
          app: {
            username: fullName
          }
        });
      });
    }

    // If no owner was found, claim the app ownership and post it to Firebase
    if (!login.app.owner) {
      await base.post('/app/owner', {
        data: authData.user.uid
      });
    }

    this.setState({
      app: {
        uid: authData.user.uid,
        owner: login.app.owner || authData.user.uid,
        email: authData.user.email,
        photoURL
      }
    });
  }
  
  authenticate = (email, password, method) => {
    firebaseApp.auth()[method](email, password)
    .then((user) => {
      this.authHandler(user);
      this.setState({
        loginPopup: false
      });
    }).catch(err => {
      this.setState({
        error: err.message
      });
    });
  }

  logout = async() => {
    await firebase.auth().signOut();

    this.setState({
      app: {
        uid: null,
        username: null
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // New users
    if (this.signupEmail.current || this.signupPassword.current !== null) {
      const email = this.signupEmail.current.value;
      const password = this.signupPassword.current.value;
      
      this.authenticate(email, password, 'createUserWithEmailAndPassword');
    }
    
    // Already registered users
    if (this.loginEmail.current || this.loginPassword.current !== null) {
      const email = this.loginEmail.current.value;
      const password = this.loginPassword.current.value;

      this.authenticate(email, password, 'signInWithEmailAndPassword');
    }
  }

  likePhoto = (key, likeCount, ref) => {
    const photos = {...this.state.app.photos};

    if (!photos[key].liked) {
      photos[key]['liked'] = [];
    }

    if (photos[key].liked[this.state.app.uid]) {
      photos[key].liked[this.state.app.uid] = null; 
      ref.current.classList.remove('like_active');
      photos[key].likes--;
    } else {
      photos[key].liked[this.state.app.uid] = this.state.app.username;
      ref.current.classList.add('like_active');
      photos[key].likes++;
    }

    this.setState({
      app: {
        photos
      }
    });
  }

  showResetPassword = () => {
    this.setState({
      loginPopup: false,
      resetPasswordPopup: true
    });
  }

  resetPassword = (e, email) => {
    e.preventDefault();
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      this.setState({
        error: null,
        info: "A password reset email has been sent to the address provided."
      });
    }).catch((error) => {
      this.setState({
        error: error.message
      });
    });
  }

  showModal = (method) => {
    // Hide all errors when closing the popup
    if (this.state.signupPopup === false || this.state.loginPopup === false) {
      this.setState({
        error: null
      });
    }
    this.setState({
      error: null,
      info: null,
      [method]: !this.state[method]
    });
  }

  updateEmail = (email) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user.updateEmail(email).then(() => {
          this.setState({
            info: `Your email address was updated. Your new email is ${email}`
          });
        }).catch((error) => {
          this.setState({
            error: error.message,
            info: null
          });
        });
      } else {
        this.setState({
          loginPopup: true,
          info: 'Please log in again to save your new email address'
        });
      }
    });
  }

  updatePassword = (password) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user.updatePassword(password).then(() => {
          this.setState({
            info: 'Your password was successfully updated.',
            error: null
          });
        }).catch((error) => {
          this.setState({
            error: error.message,
            info: null
          });
        });
      } else {
        this.setState({
          loginPopup: true,
          info: 'Please log in again to save your new password.'
        });
      }
    });
  }

  deleteAccount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user.delete().then(() => {
          this.logout();
        }).catch((error) => {
          console.log('fail');
          this.setState({
            error: error.message,
            info: null,
            loginPopup: true
          });
        });
      }
    });
  }

  showNewProfilePicture = (url) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.auth().currentUser.updateProfile({
          photoURL: url
        }).then(() => {
          const photoURL = user.photoURL;
          this.setState({
            app: {
              user: {
                photoURL
              }
            }
          });
        }).catch((error) => {
          this.setState({
            error: error.message
          });
        });
      }
    });
  }

  componentDidMount() {
    this.ref = base.syncState('/app', {
      context: this,
      state: 'app',
      then() {
        this.setState({
          app: {
            loading: false
          }
        });
      }
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  
  render() {
    const profileId = this.state.app ? this.state.app.uid : '';
    return (
      <BrowserRouter>
        <div className="wiztagram">
          <header className="wiztagram__header">
            <Link to="/"><h2 className="title">Wiztagram</h2></Link>
            { !this.state.app.uid ? (
              <React.Fragment>
                <button className="button" onClick={() => this.showModal('signupPopup')}>Sign up</button>
                <button className="button" onClick={() => this.showModal('loginPopup')}>Login</button>
              </React.Fragment>
              ) : (
              <React.Fragment>
                <Link to={`/profile/${profileId}`}><span className="username"><span className="button">My account</span></span></Link>
                <Link to="/"><button className="button" onClick={this.logout}>Logout</button></Link>
              </React.Fragment>
              )
            }
            <Modals error={this.state.error} info={this.state.info} showModal={this.showModal} handleSubmit={this.handleSubmit} signupPopup={this.state.signupPopup} loginPopup={this.state.loginPopup} resetPasswordPopup={this.state.resetPasswordPopup} showResetPassword={this.showResetPassword} fullName={this.fullName} signupEmail={this.signupEmail} signupPassword={this.signupPassword} loginEmail={this.loginEmail} loginPassword={this.loginPassword} resetPasswordEmail={this.resetPasswordEmail} resetPassword={this.resetPassword} />
          </header>
          <Switch>
            <Route exact path="/">
              <ul className="photo-stream">
                {
                  Object.keys(this.state.app.photos).map(post => <Post key={post} index={post} details={this.state.app.photos[post]} addComment={this.addComment} removeComment={this.removeComment} uid={this.state.app.uid} owner={this.state.app.owner} likePhoto={this.likePhoto} username={this.state.app.username} />) }
              </ul>
            </Route>
            <Route path="/profile/:profileId" render={() => <Profile state={{...this.state.app}} user={this.state.app.user} deleteAccount={this.deleteAccount} updateEmail={this.updateEmail} updatePassword={this.updatePassword} error={this.state.error} info={this.state.info} showNewProfilePicture={this.showNewProfilePicture} />}>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
