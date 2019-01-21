import React from 'react';

class Profile extends React.Component {
  render() {
    const { username } = this.props.state.app;
    return(
      <div className="profile">Hello {username}!</div>
    );
  }
}

export default Profile;
