import React from 'react';

const NewComment = (props) => (
  <div className="photo-stream__new-comment">
    <div className="photo-stream__new-comment-by">{props.username}:</div>
    { props.uid === props.owner &&
      <span onClick={props.removeComment}>&times;</span>
    }
    <div className="photo-stream__new-comment-text">{props.comment}</div>
  </div>
);

export default NewComment;
