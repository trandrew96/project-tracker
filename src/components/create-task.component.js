import React, { Component } from 'react';
import axios from 'axios';
import { getFromStorage } from '../utils/storage';
import Alert from './alert.component';

export default class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      project: '',
      subject: '',
      type: 'bug',
      description: '',
      usernames: [],
      creator: '',
      assignee: '(blank)',
      message: '',
      success: false
    }

    this.onChangeProject = this.onChangeProject.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAssignee = this.onChangeAssignee.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    // Verify that the user is logged in, and get the user's username.
    // This function is duplicated in home, create-project, create-task
    const obj = getFromStorage('project_tracker');
    console.log(obj);
    if (obj && obj.token) {
      // Verify token
      axios.get('http://localhost:5000/api/account/verify?token=' + obj.token)
        .then(res => {
          const data = res.data;
          console.log(data);
          if(data.success) {
            // add current username to our state
            this.setState({
              isLoading: false,
              creator: obj.username
            });
          } else {
            this.setState({
              isLoading: false,
            })
          }
        })
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  onChangeProject(e) {
    this.setState({
      project: e.target.value
    })
  }
  onChangeType(e) {
    this.setState({
      type: e.target.value
    })
  }
  onChangeSubject(e) {
    this.setState({
      subject: e.target.value
    })
  }
  onChangeDescription(e){
    this.setState({ 
      description: e.target.value 
    });
  }
  onChangeAssignee(e) {
    this.setState({
      assignee: e.target.value
    })
  }

  // This is automatically called right before this component renders
  componentDidMount() {

    // get a list of existing project names
    axios.get('http://localhost:5000/api/projects')
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            projects: res.data.map(project => project.title),
            project: res.data[0].title,
          })
        } else {
          this.setState({
            projects: ['(blank)'],
            project: '(blank)',
          })
        }
      });

    // get a list of existing usernames for the assignee field
    axios.get('http://localhost:5000/api/users')
    .then(res => {
      if (res.data.length > 0) {
        this.setState({
          usernames: res.data.map(user => user.username),
          assignee: res.data[0].username,
        })
      } else {
        this.setState({
          usernames: ['(blank)'],
          assignee: '(blank)',
        })
      }
    })
  }

  onSubmit(e) {
    e.preventDefault(e);

    const taskInfo = {
      project: this.state.project,
      type: this.state.type,
      subject: this.state.subject,
      description: this.state.description,
      assignee: this.state.assignee,
      creator: this.state.creator,
    }

    axios.post("http://localhost:5000/api/tasks/create", taskInfo)
      .then(res => {
        this.setState({
          success: res.data.success,
          message: res.data.message,
          subject: '',
          description: '',
        })
      });
  }

  render(){

    const {
      message,
      success
    } = this.state;

    return (
      <div>
        <h1>Create a Task</h1>
        <div>
          <Alert message={message} success={success}></Alert>
        </div>
        <form>  
          <div className="form-group"> 
            <label>Project</label>
            <select ref="projectInput"
                required
                className="form-control"
                value={this.state.project}
                onChange={this.onChangeProject}>
                {
                  this.state.projects.map(project => {
                    return <option 
                      key={project}
                      value={project}>{project}
                      </option>;
                  })
                }
            </select>
          </div>
          <div className="form-group"> 
            <label>Type</label>
            <select ref="typeInput"
                required
                className="form-control"
                value={this.state.type}
                onChange={this.onChangeType}>
                <option key="bug" value="bug">Bug</option>
                <option key="feature" value="feature">Feature</option>
            </select>
          </div>
          <div className="form-group"> 
            <label>Subject</label>
            <input ref="subjectInput"
                required
                className="form-control"
                value={this.state.subject}
                onChange={this.onChangeSubject}
                placeholder="Enter a subject">
            </input>
          </div>
          <div className="form-group"> 
            <label>Description</label>
            <input ref="descriptionInput"
                required
                className="form-control"
                value={this.state.description}
                onChange={this.onChangeDescription}
                placeholder="Enter a description">
            </input>
          </div>
          <div className="form-group"> 
            <label>Assign to</label>
            <select ref="assigneeInput"
                required
                className="form-control"
                value={this.state.assignee}
                onChange={this.onChangeAssignee}>
                <option key="no one" value="(no one)">(no one)</option>
                {
                  this.state.usernames.map(username => {
                    return <option 
                      key={username}
                      value={username}>{username}
                      </option>;
                  })
                }
            </select>
          </div>
          <button type="submit" onClick={this.onSubmit} className="btn btn-primary">Submit Task</button>
        </form>
      </div>
    )
  }
}