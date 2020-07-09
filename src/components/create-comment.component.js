import React, { Component } from 'react';
import axios from 'axios';

// This component contains the form for submitting comments for a specific task.
// The form will also include an input for updating the task status, if either:
//    - current user == task creator, or
//    - current user == task assignee
export default class CreateComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      status: this.props.status
    }

    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // This function sets status to the correct value
  componentDidUpdate(prevProps) {
    if (this.props.status !== prevProps.status) {
      this.setState({
        status: this.props.status
      })
    }
  }

  onChangeComment(e) {
    this.setState({
      comment: e.target.value
    })
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value
    })
  }
  
  onSubmit(e){
    // e.preventDefault(e);

    const commentInfo = {
      username: this.props.username,
      comment: this.state.comment,
      taskId: this.props.taskId,
    }

    // Submit the comment
    axios.post("http://localhost:5000/api/tasks/submit-comment", commentInfo)
      .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,
          comment: '',
        })
      });

    const newStatus = { status: this.state.status };

    // Update task status if the form has a different status
    if(this.state.status != this.props.status) {
      axios.post("http://localhost:5000/api/tasks/update-status/" + this.props.taskId, newStatus)
      .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,
          comment: '',
        })
      });
    }
  }

  render() {
    return(
      <div>
        <form>
          <div className="form-group"> 
             <label for="commentInput">Comment</label>
             <input ref="commentInput"
                id="commentInput"
                required
                className="form-control"
                value={this.state.comment}
                onChange={this.onChangeComment}
                placeholder="Add a comment..."
                className="form-control"
                >
             </input>
          </div>
          {/* Add "Update Status" field if the currently logged in user is 'privileged' */}
          {
           (this.props.username == this.props.creator || this.props.username == this.props.assignee) ?
           (
            <div className="form-group">
            <label for="statusInput">Status</label>
            <select ref="statusInput"
                    id="statusInput"
                    className="form-control"
                    value={this.state.status}
                    onChange={this.onChangeStatus}
                    className="form-control form-control-sm col-md-2">
              <option key="In Progress" value="In Progress">In Progress</option>
              <option key="Resolved" value="Resolved">Resolved</option>
            </select>
            </div>
           ) : null
          }
          <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Comment</button>
        </form>
      </div>
    )
  }
}