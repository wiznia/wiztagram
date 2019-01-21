import React from 'react';

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return(
        <h2>Oh no! you fucked up!</h2>
      );
    }
    return this.props.children;
  }
}

export default ErrorHandler;
