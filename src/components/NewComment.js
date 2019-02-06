import React from 'react';
import { Link } from 'react-router-dom';

const NewComment = (props) => (
  <div className="photo-stream__new-comment">
    { props.profileLink ? (
      <div className="photo-stream__new-comment-by"><Link to={props.profileLink}>{props.username}</Link>:</div>
    ) : (
      <div className="photo-stream__new-comment-by">{props.username}:</div>
    )}
    { props.uid === props.owner &&
      <span onClick={props.removeComment}>&times;</span>
    }
    <div className="photo-stream__new-comment-text">{props.comment}</div>
  </div>
);

export default NewComment;
