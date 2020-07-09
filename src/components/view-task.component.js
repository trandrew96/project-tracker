import React, { Component } from 'react';
import { getFromStorage } from '../utils/storage';
import axios from 'axios';
import CreateComment from './create-comment.component';
import CommentList from './view-comments.component';

export default class ViewTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: '',
      type: '',
      subject: '',
      description: '',
      creator: '',
      assignee: '',
      taskId: '',
      status: '',
      isLoading: true
    }
  }

  componentDidMount() {
    // Verify that the user is logged in, and get the user's username.
    // This function is duplicated in home, create-project, create-task
    const obj = getFromStorage('project_tracker');
    if (obj && obj.token) {
      // Verify token
      axios.get('http://localhost:5000/api/account/verify?token=' + obj.token)
        .then(res => {
          const data = res.data;
          console.log(data);
          if(data.success) {
            this.setState({
              username: obj.username,
              token: obj.token,
            });
          }
        })
    } 

    // Grab data for the current task
    axios.get('http://localhost:5000/api/tasks/'+this.props.match.params.id) // we are getting the taskId directly from the URL. See App.js and notice :id
      .then(response => {
        this.setState({
          project: response.data.project,
          type: response.data.type,
          subject: response.data.subject,
          description: response.data.description,
          creator: response.data.creator,
          assignee: response.data.assignee,
          taskId: this.props.match.params.id,
          status: response.data.status
        })   
      })
      .catch(function (error) {
        console.log(error);
      })

    this.setState({
      isLoading: false
    })
  }

  render() {

    if(this.state.isLoading){
      return null
    }

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <h3>{this.state.subject}</h3>
            <p>{this.state.project}</p>
            <p>{this.state.type} | created by {this.state.creator} | assigned to {this.state.assignee} </p>
            <p>{this.state.description}</p>
            <p>Status: {this.state.status}</p>
          </div>
        </div>
        <br/>
        <CommentList taskId={this.props.match.params.id}></CommentList>
        <br/>
        <CreateComment 
          taskId={this.state.taskId} 
          username={this.state.username} 
          creator={this.state.creator} 
          assignee={this.state.assignee}
          status={this.state.status}/>
        <br/>
      </div>
    )
  }
}