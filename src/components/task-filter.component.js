import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

export default class TaskFilter extends Component {

  constructor(props){
    super(props);

    this.state = {
      projectTitles: [],
      usernames: [],
    }
  }

  componentDidMount() {

    // Get Project Titles
    axios.get('http://localhost:5000/api/projects')
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            projectTitles: res.data.map(project => project.title)
          })
        } else {
          this.setState({ projectTitles: [] })
        }
      });

    // Get usernames
    axios.get('http://localhost:5000/api/users')
    .then(res => {
      if (res.data.length > 0) {
        this.setState({
          usernames: res.data.map(user => user.username),
        })
      } 
    })
  }

  render(){
    return(
      <div className="mb-3">
        <form>
          <div className="form-row">
            <div className="col-md-2">
              <label for="projectFilter">Project</label>
              <select 
                      ref="projectFilter"
                      id="projectFilter"
                      value={this.props.project}
                      onChange={this.props.onChangeProject}
                      className="form-control form-control-sm">
                <option key="None Project" value="">None</option>
                {
                  this.state.projectTitles.map(title => {
                    return <option key={title} value={title}>{title}</option>;
                  })
                }
              </select>
            </div>
            <div className="col-md-2">
              <label for="assigneeFilter">Assigned User</label>
              <select ref="assigneeFilter"
                      id="assigneeFilter"
                      value={this.props.assignee}
                      onChange={this.props.onChangeAssignee}
                      className="form-control form-control-sm">
                <option key="None Assignee" value="">None</option>
                <option key="None Assignee" value="(no one)">(no one)</option>
                {
                  this.state.usernames.map(username => {
                    return <option key={username} value={username}>{username}</option>;
                  })
                }
              </select>
            </div>
            <div className="col-md-2">
              <label for="typeFilter">Type</label>
              <select ref="typeFilter"
                      id="typeFilter"
                      value={this.props.type}
                      onChange={this.props.onChangeType}
                      className="form-control form-control-sm">
                <option key="None Type" value="">None</option>
                <option key="Bug Type" value="bug">Bug</option>
                <option key="Feature Type" value="feature">Feature</option>
              </select>
            </div>
            <div className="col-md-2">
              <label for="statusFilter">Status</label>
              <select ref="statusFilter"
                      id="statusFilter"
                      value={this.props.status}
                      onChange={this.props.onChangeStatus}
                      className="form-control form-control-sm">
                <option key="None Status" value="">None</option>
                <option key="In Progress" value="In Progress">In Progress</option>
                <option key="Resolved" value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="col-md-2">
              <label for="creatorFilter">Creator</label>
              <select ref="creatorFilter"
                      id="creatorFilter"
                      value={this.props.creator}
                      onChange={this.props.onChangeCreator}
                      className="form-control form-control-sm">
                <option key="None Creator" value="">None</option>
                {
                  this.state.usernames.map(username => {
                    return <option key={username} value={username}>{username}</option>;
                  })
                }
              </select>
            </div>
            <div className="col-md-2 d-flex justify-content-center">
              <button className="btn btn-primary margin-top-31 btn-sm mx-auto" onClick={this.props.handleReset}>reset all</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}