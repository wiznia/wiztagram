import React from 'react';
import Modal from './Modal';

class Modals extends React.Component {
  render() {
    const signupPopup = this.props.signupPopup;
    const loginPopup = this.props.loginPopup;
    const resetPasswordPopup = this.props.resetPasswordPopup;
    return(
      <React.Fragment>
        { signupPopup &&
          <Modal error={this.props.error} info={this.props.info} title="Sign up">
            <div className="close-modal" onClick={() => this.props.showModal('signupPopup')}>&times;</div>
            <form onSubmit={this.props.handleSubmit}>
              <input className="input" type="text" required pattern=".{3,}" title="3 characters minimum" placeholder="Fullname" ref={this.props.fullName} />
              <input className="input" type="text" placeholder="Email" ref={this.props.signupEmail} />
              <input className="input" type="password" placeholder="Password" ref={this.props.signupPassword} />
              <button className="button-modal" type="submit">Sign up</button>
            </form>
          </Modal>
        }
        { loginPopup &&
          <Modal error={this.props.error} info={this.props.info} title="Login">
            <div className="close-modal" onClick={() => this.props.showModal('loginPopup')}>&times;</div>
            <form onSubmit={this.props.handleSubmit}>
              <input className="input" type="text" placeholder="Enter your email" ref={this.props.loginEmail} />
              <input className="input" type="password" placeholder="Enter your password" ref={this.props.loginPassword} />
              <button className="button" type="button" onClick={this.props.showResetPassword}>Forgot your password?</button>
              <button className="button-modal" type="submit">Login</button>
            </form>
          </Modal>
        }
        { resetPasswordPopup &&
          <Modal error={this.props.error} info={this.props.info} title="Reset password">
            <div className="close-modal" onClick={() => this.props.showModal('resetPasswordPopup')}>&times;</div>
            <form onSubmit={(e) => this.props.resetPassword(e, this.props.resetPasswordEmail.current.value)}>
              <input className="input" type="email" required  placeholder="Enter your email" ref={this.props.resetPasswordEmail} />
              <button className="button-modal" type="submit">Reset password</button>
            </form>
          </Modal>
        }
      </React.Fragment>
    );
  }
};

export default Modals;
