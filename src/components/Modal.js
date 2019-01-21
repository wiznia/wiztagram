import React from 'react';

const Modal = (props) => (
  <div className="modal">
    <div className="modal__inner">
      <h2>{props.title}</h2>
      { props.info &&
        <div className="info">{props.info}</div>
      }
      { props.error &&
        <div className="error">{props.error}</div>
      }
      {props.children}
    </div>
  </div>
);

export default Modal;
