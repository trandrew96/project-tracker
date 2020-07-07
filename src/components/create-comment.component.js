import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class CreateComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
    }

    this.onChangeComment = this.onChangeComment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeComment(e) {
    this.setState({
      comment: e.target.value
    })
  }
  
  onSubmit(e){
    // e.preventDefault(e);

    const commentInfo = {
      username: this.props.username,
      comment: this.state.comment,
      taskId: this.props.taskId,
    }

    axios.post("http://localhost:5000/api/tasks/submit-comment", commentInfo)
      .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,
          comment: '',
        })
      });
  }

  render() {
    return(
      <div>
         <form>
           <div className="form-group"> 
             <input ref="commentInput"
                required
                className="form-control"
                value={this.state.comment}
                onChange={this.onChangeComment}
                placeholder="Add a comment..."
                >
             </input>
           </div>
           <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Comment</button>
         </form>
      </div>
    )
  }
}