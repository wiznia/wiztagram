import React from 'react';

class TagForm extends React.Component {
  inputRef = React.createRef();
  state = {
  }
  searchUsers = () => {
    const users = {...this.props.users};
    const inputValue = this.inputRef.current.value;
    const names = Object.keys(users).map(user => users[user].name);
    const filteredNames = names.filter(name => name.match(inputValue));

    if (filteredNames) {
      this.setState({
        filteredNames
      });
    }
  }
  
  renderActiveTags = (tags) => {
    const activeTags = Object.keys(tags).filter(tag => tags[tag].tagActive);
    
    if (activeTags) {
      return activeTags.map(tag => {
        const styles = {
          top: `${tags[tag].y}px`,
          left: `${tags[tag].x}px`
        }
        return(
          <label key={tag} className="tag" style={styles}>{tags[tag].name}</label>
        );
      });
    }
  }

  renderTagForm = (tags) => {
    const tagForm = Object.keys(tags).filter(tag => tags[tag].tagActive === false);
    
    return tagForm.map(tag => {
      const styles = {
        top: `${tags[tag].y}px`,
        left: `${tags[tag].x}px`
      }
      const tagIndex = tag;
      return(
        <div key={tag} index={tagIndex} className="tag-input" style={styles}>
          <input type="text" ref={this.inputRef} onKeyDown={this.searchUsers} />
          <ul className="tag-list">
            {
              this.state.filteredNames &&
                this.state.filteredNames.map(name => {
                  return (
                    <li onClick={() => this.props.tagUser(name, tagIndex, this.props.index)} className="tag-list__item" key={name}>{name}</li>
                  );
                })
            }
          </ul>
        </div>
      );
    });
  }

  render() {
    const { tags } = this.props;
    return(
      <>
        {
          this.renderActiveTags(tags)
        }
        {
          this.renderTagForm(tags)
        }
      </>
    );
  }
}

export default TagForm;
