import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

/*
  This component contains the form for:
    - submitting comments on task
    - changing the status of a task
    - assigning the task to a user
*/
export default class CreateComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      status: this.props.status,
      assignee: this.props.assignee,
      usernames: []
    }

    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeAssignee = this.onChangeAssignee.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount(){
    // get a list of existing usernames for the assignee field
    axios.get('http://localhost:5000/api/users')
    .then(res => {
      if (res.data.length > 0) {
        this.setState({
          usernames: res.data.map(user => user.username),
        })
      } else {
        this.setState({
          usernames: ['(blank)'],
        })
      }
    })
  }

  // This function sets status to the correct value
  componentDidUpdate(prevProps) {
    if (this.props.status !== prevProps.status) {
      this.setState({
        status: this.props.status,
        assignee: this.props.assignee
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

  onChangeAssignee(e) {
    this.setState({
      assignee: e.target.value
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
    if(this.state.comment != ''){
      axios.post("http://localhost:5000/api/tasks/submit-comment", commentInfo)
      .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,
          comment: '',
        })
      });
    }

    const newTaskData = { 
      status: this.state.status,
      assignee: this.state.assignee
    };

    // Update Task if Status or Assignee has changed
    if(this.state.status !== this.props.status || this.state.assignee != this.props.assignee) {
      console.log('trying to update task');
      console.log(newTaskData);
      axios.post("http://localhost:5000/api/tasks/update/" + this.props.taskId, newTaskData)
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
      <Form>
        <Row form>
          <Col md={12}>
            <FormGroup> 
              <Label for="commentInput">Comment</Label>
              <Input ref="commentInput"
                id="commentInput"
                type="textarea"
                value={this.state.comment}
                onChange={this.onChangeComment}
                placeholder="Add a comment..."
                className="form-control"
                >
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={3}>
            <FormGroup>
              <Label for="statusInput">Change Status</Label>
              <Input type="select" 
                      ref="statusInput"
                      id="statusInput"
                      value={this.state.status}
                      onChange={this.onChangeStatus}
                      className="form-control">
                <option key="In Progress" value="In Progress">In Progress</option>
                <option key="In QA" value="In QA">In QA</option>
                <option key="Resolved" value="Resolved">Resolved</option>
              </Input>
            </FormGroup>
            </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="assigneeInput">Assign To</Label>
              <Input type="select" 
                      ref="assigneeInput"
                      id="assigneeInput"
                      value={this.state.assignee}
                      onChange={this.onChangeAssignee}
                      className="form-control">
                  <option key="no one" value="(no one)">(no one)</option>
                  {
                    this.state.usernames.map(username => {
                      return <option 
                        key={username}
                        value={username}>{username}
                        </option>;
                    })
                  }
              </Input>
            </FormGroup>
            </Col>
        </Row>


        <Button type="submit" color="primary" onClick={this.onSubmit}>Comment</Button>
      </Form>
    )
  }
}