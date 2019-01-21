import React from 'react';
import NewComment from './NewComment';

class Post extends React.Component {
  formRef = React.createRef();
  textareaRef = React.createRef();
  heartRef = React.createRef();

  addComment = (e) => {
    e.preventDefault();
    const username = this.props.username || 'Anonymous';
    this.props.addComment(this.textareaRef.current.value, this.props.index, username);
    this.formRef.current.reset();
  }

  focusComment = () => {
    this.textareaRef.current.focus();
  }

  componentDidUpdate() {
    if (this.props.details.liked) {
      const alreadyLiked = Object.keys(this.props.details.liked).filter(user => user === this.props.uid); 
      if (alreadyLiked.length > 0) {
        this.heartRef.current.classList.add('like_active');
      }
    }
  }

  render() {
    const { image, name, desc, comments, likes } = this.props.details;
 
    return(
      <li className="photo-stream__item">
        <img src={image} alt={name} />
        <div className="photo-stream__bar">
          { this.props.uid &&
          <button className="photo-stream__like" onClick={() => this.props.likePhoto(this.props.index, likes, this.heartRef)}>
          <svg ref={this.heartRef} className="like" width="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 346"><path d="M276.8 15.4c50.7 0 91.9 41.3 91.9 92.3 0 26.2-10.9 49.8-28.3 66.6L192 324.1 41 171.6c-15.8-16.6-25.6-39.1-25.6-63.9 0-51 41.1-92.3 91.9-92.3 38.2 0 70.9 23.4 84.8 56.8 13.7-33.3 46.5-56.8 84.7-56.8m0-15.4C243 0 212 15.8 192 41.8 172 15.8 141 0 107.2 0 48.1 0 0 48.3 0 107.7c0 27.9 10.6 54.4 29.9 74.6L181.1 335l10.9 11 10.9-11 148.3-149.8c21-20.3 32.8-47.9 32.8-77.5C384 48.3 335.9 0 276.8 0z"/><path d="M276.8 15.4c50.7 0 91.9 41.3 91.9 92.3 0 26.2-10.9 49.8-28.3 66.6L192 324.1 41 171.6c-15.8-16.6-25.6-39.1-25.6-63.9 0-51 41.1-92.3 91.9-92.3 38.2 0 70.9 23.4 84.8 56.8 13.7-33.3 46.5-56.8 84.7-56.8" fill="#fff"/></svg>
          </button>
          }
          <button className="photo-stream__comment" onClick={this.focusComment}>
            <svg width="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1536"><path d="M1672 318.5c-80-98.3-188.7-176-326-233S1058.7 0 896 0 583.3 28.5 446 85.5s-246 134.7-326 233C40 416.8 0 524 0 640c0 100 30.2 193.7 90.5 281s142.8 160.7 247.5 220c-7.3 26.7-16 52-26 76s-19 43.7-27 59-18.8 32.3-32.5 51-24 31.8-31 39.5-18.5 20.3-34.5 38-26.3 29.2-31 34.5l-8 9-7 8.5-6 9c-3.3 5-4.8 8.2-4.5 9.5s-.3 4.7-2 10-1.5 9.3.5 12v1c2.7 11.3 8 20.5 16 27.5s17 10.5 27 10.5h5c43.3-5.3 81.3-12.7 114-22 174.7-44.7 328-125.3 460-242 50 5.3 98.3 8 145 8 162.7 0 312.7-28.5 450-85.5s246-134.7 326-233S1792 756 1792 640s-40-223.2-120-321.5zM1559.5 895c-69.7 78.7-163.7 141.2-282 187.5S1032 1152 896 1152c-40.7 0-84-2.7-130-8l-57-6-43 38c-82 72-173.7 129-275 171 30.7-54 54-111.3 70-172l27-96-87-50c-86.7-49.3-153.8-107.8-201.5-175.5S128 714.7 128 640c0-91.3 34.8-176.3 104.5-255s163.7-141.2 282-187.5C632.8 151.2 760 128 896 128s263.2 23.2 381.5 69.5c118.3 46.3 212.3 108.8 282 187.5S1664 548.7 1664 640s-34.8 176.3-104.5 255z"/></svg>
          </button>
          <div className="photo-stream__like-count">{likes} {likes === 1 ? 'like' : 'likes'}</div>
        </div>
        <div className="photo-stream__description">{desc}</div>
        <div className="comments">
          {
            (comments && Object.keys(comments).length !== 0) &&
              Object.keys(comments).map(commentId => {
                if (comments[commentId]) {
                  return(
                    <NewComment key={commentId} comment={comments[commentId].comment} username={comments[commentId].user} removeComment={() => this.props.removeComment(commentId, this.props.index)} owner={this.props.owner} uid={this.props.uid} />
                  );
                }
                return null;
              })
          }
        </div>
        <form ref={this.formRef} onSubmit={this.addComment}>
          <input className="photo-stream__comment-box" ref={this.textareaRef} placeholder="Add a comment" />
          <input type="submit" hidden />
        </form>
      </li>
    );
  }
}

export default Post;
