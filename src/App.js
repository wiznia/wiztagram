import React, { Component } from 'react';
import firebase from 'firebase';
import base, { firebaseApp } from './base';
import './App.scss';
import samplePhotos from './sample-photos';
import Post from './components/Post';
import Modals from './components/Modals';

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
      photos: samplePhotos
    },
    signupPopup: false,
    loginPopup: false,
    resetPasswordPopup: false
  }

  goToProfile = () => {
    this.props.history.push({pathname:`/profile/${this.state.app.uid}`});
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

    if (authData.additionalUserInfo.isNewUser) {
      authData.user.sendEmailVerification().then(() => {
        this.setState({
          info: 'We sent you an email to confirm your account.'
        });

        setTimeout(() => {
          this.setState({
            signupPopup: false
          });
        }, 3000);
      });
    }
    
    if (authData.operationType === 'signIn') {
      authData.user.updateProfile({
        displayName: fullName
      }).then(() => {
        this.setState({
          app: {
            username: fullName
          }
        });
      });
    }

    if (!login.app.owner) {
      await base.post('/app/owner', {
        data: authData.user.uid
      });
    }

    this.setState({
      app: {
        uid: authData.user.uid,
        owner: login.app.owner || authData.user.uid
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
    if (this.signupEmail.current || this.signupPassword.current !== null) {
      const email = this.signupEmail.current.value;
      const password = this.signupPassword.current.value;
      
      this.authenticate(email, password, 'createUserWithEmailAndPassword');
    }
    
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
        info: "A password reset email has been sent to the address provided."
      });
    }).catch((error) => {
      this.setState({
        error: error.message
      });
    });
  }

  showModal = (method) => {
    this.setState({
      [method]: !this.state[method]
    });
  }

  componentDidMount() {
    this.ref = base.syncState('/app', {
      context: this,
      state: 'app'
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  
  render() {
    return (
      <React.Fragment>
        { !this.state.app.uid ? (
          <React.Fragment>
            <button className="button" onClick={() => this.showModal('signupPopup')}>Sign up</button>
            <button className="button" onClick={() => this.showModal('loginPopup')}>Login</button>
          </React.Fragment>
          ) : (
          <React.Fragment>
            <span className="username"><span className="button" onClick={this.goToProfile}>My account</span></span>
            <button className="button" onClick={this.logout}>Logout</button>
          </React.Fragment>
          )
        }
        <Modals error={this.state.error} info={this.state.info} showModal={this.showModal} handleSubmit={this.handleSubmit} signupPopup={this.state.signupPopup} loginPopup={this.state.loginPopup} resetPasswordPopup={this.state.resetPasswordPopup} showResetPassword={this.showResetPassword} fullName={this.fullName} signupEmail={this.signupEmail} signupPassword={this.signupPassword} loginEmail={this.loginEmail} loginPassword={this.loginPassword} resetPasswordEmail={this.resetPasswordEmail} resetPassword={this.resetPassword} />
        <ul className="photo-stream">
          {
            Object.keys(this.state.app.photos).map(post => <Post key={post} index={post} details={this.state.app.photos[post]} addComment={this.addComment} removeComment={this.removeComment} uid={this.state.app.uid} owner={this.state.app.owner} likePhoto={this.likePhoto} username={this.state.app.username} />)
          }
        </ul>
      </React.Fragment>
    );
  }
}

export default App;
