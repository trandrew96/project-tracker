import React, { Component } from 'react';
import axios from 'axios';

const Comment = (props) => {
  return(
    <div>
      <div>
        <strong>{props.username}</strong>
        <p>{props.comment}</p>
      </div>
    </div>
  )
}

export default class CommentList extends Component {
  constructor(props){
    super(props);

    this.state = {
      comments: []
    }

    this.commentList = this.commentList.bind(this);
  }

  componentDidMount() {
    const comments_url = 'http://localhost:5000/api/tasks/get-comments/' + this.props.taskId;
    axios.get(comments_url)
      .then(res => {
        this.setState({
          comments: res.data
        })
      })
      .catch(err => console.log(err))
  }

  commentList(){
    return this.state.comments.map(currentComment => {
      return <Comment username={currentComment.username} comment={currentComment.comment}></Comment>
    })
  }

  render() {
    return(
      <div>
        <h5>{this.state.comments.length} Comments</h5>
        {
          this.commentList()
        }
      </div>
    )
  }
}