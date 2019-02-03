import React from 'react';
import firebase from 'firebase';
import Loader from './Loader';

class Profile extends React.Component {
  emailRef = React.createRef();
  passwordRef = React.createRef();

  handleClick = (e) => {
    const input = e.currentTarget.previousSibling;

    input.removeAttribute('disabled');
    input.focus();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const ref = e.currentTarget.dataset.ref;
    const newProp = this[ref].current.value;

    this.props[e.currentTarget.dataset.method](newProp);
  }

  updatePhoto = (e) => {
    const selectedPic = e.currentTarget.files[0];
    const folder = `${this.props.state.uid}/profilePicture/${selectedPic.name}`;
    const storageRef = firebase.storage().ref(folder);

    this.props.checkPic(true);

    storageRef.put(selectedPic).then((pic) => {
      storageRef.getDownloadURL().then(url => {
        this.props.checkPic(false);
        this.props.showNewProfilePicture(url);
      });
    });
  }

  renderOwnProfile = () => {
    const { username, user, email, picUploading } = this.props.state;
    return( 
      <div className="profile">
        <div className="profile__photo">
          { picUploading &&
            <Loader />
          }
          { user && user.photoURL ? (
            <>
              <input onChange={(e) => this.updatePhoto(e)} type="file" />
              <img src={user.photoURL} alt={username} />
            </>
          ) : (
            <>
              <input onChange={(e) => this.updatePhoto(e)} type="file" />
              <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="#bcbcbc"/><path d="M77.4 75.3c-2-.3-3.4-1.9-3.4-3.9v-5.8c2.1-2.3 3.5-5.3 3.8-8.7l.2-3.2c1.1-.6 2.2-2 2.7-3.8.7-2.5.1-4.7-1.5-4.9h-.7l.4-5.9c.7-8.2-5.6-15.1-13.6-15.1h-2.5c-8 0-14.3 6.9-13.8 15.1l.4 6c-.2-.1-.4-.1-.6-.1-1.6.2-2.2 2.4-1.5 4.9.5 1.9 1.7 3.3 2.8 3.9l.2 3.1c.2 3.4 1.6 6.4 3.7 8.7v5.8c0 2-1.4 3.6-3.4 3.9C41.8 76.8 27 83.2 27 90v14h74V90c0-6.8-14.8-13.2-23.6-14.7z" fill="#fff"/></svg>
            </>
          )}
        </div>
        <div className="profile__info">
          Hello {username}!
        </div>
        <div className="error">
          { this.props.error }
        </div>
        <div className="info">
          { this.props.info }
        </div>
        <div className="input-container">
          <form onSubmit={(e) => this.handleSubmit(e)} data-method="updateEmail" data-ref="emailRef">
            <input disabled className="input input_small" ref={this.emailRef} type="text" placeholder={email} />
            <div className="button" onClick={this.handleClick}>Update email address</div>
            <button className="button" type="submit">Save</button>
          </form>
        </div>
        <div className="input-container">
          <form onSubmit={(e) => this.handleSubmit(e)} data-method="updatePassword" data-ref="passwordRef">
            <input disabled className="input input_small" ref={this.passwordRef} type="password" placeholder="Password" />
            <div className="button" onClick={this.handleClick}>Update password</div>
            <button className="button" type="submit">Save</button>
          </form>
        </div>
        <div className="input-container">
          <div className="button" onClick={this.props.deleteAccount}>Delete account</div>
        </div>
      </div>
    );
  }

  renderPublicProfile = () => {
    const { users, uid, photos } = this.props.state;
    const profileId = this.props.match.params.profileId;
    const currentUser = users ? users[profileId] : '';
    return(
      <>
        <div className="profile">
          <div className="profile__photo">
            { currentUser && currentUser.photoURL ? (
              <>
                <img src={currentUser.photoURL} alt={currentUser.name} />
              </>
            ) : (
              <>
                <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="#bcbcbc"/><path d="M77.4 75.3c-2-.3-3.4-1.9-3.4-3.9v-5.8c2.1-2.3 3.5-5.3 3.8-8.7l.2-3.2c1.1-.6 2.2-2 2.7-3.8.7-2.5.1-4.7-1.5-4.9h-.7l.4-5.9c.7-8.2-5.6-15.1-13.6-15.1h-2.5c-8 0-14.3 6.9-13.8 15.1l.4 6c-.2-.1-.4-.1-.6-.1-1.6.2-2.2 2.4-1.5 4.9.5 1.9 1.7 3.3 2.8 3.9l.2 3.1c.2 3.4 1.6 6.4 3.7 8.7v5.8c0 2-1.4 3.6-3.4 3.9C41.8 76.8 27 83.2 27 90v14h74V90c0-6.8-14.8-13.2-23.6-14.7z" fill="#fff"/></svg>
              </>
            )}
          </div>
          <div className="profile__info">{currentUser.name}</div>
          { uid &&
            <button className="button" onClick={() => this.props.followUnfollowUser(profileId)}>{users && users[profileId].followers && users[profileId].followers[uid] ? 'Unfollow' : 'Follow'}</button>
          }
          <div className="user-info">
            <span className="user-info__text">Posts: {Object.keys(photos).filter((key, photo) => photos[key].owner === profileId).length}</span>
            <span className="user-info__text">Followers: {users && users[profileId].followers ? Object.keys(users[profileId].followers).length : '0'}</span>
            <span className="user-info__text">Following: {users ? Object.keys(users).filter(user => users[user].followers && users[user].followers[profileId]).length : 0}</span>
          </div>
        </div>
      </>
    );
  }

  render() {
    const { uid } = this.props.state;
    const profileId = this.props.match.params.profileId;
    return(
      <>
        { uid === profileId ? (
            this.renderOwnProfile()
          ) : (
            this.renderPublicProfile()
          )
        }
      </>
    );
  }
}

export default Profile;
