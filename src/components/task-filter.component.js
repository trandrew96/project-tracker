import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

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
        <Form>
          <FormGroup row>
            <Col md={2}>
              <Label>Project</Label>
              <Input type="select" 
                      ref="projectFilter"
                      id="projectFilter"
                      value={this.props.project}
                      onChange={this.props.onChangeProject}
                      className="form-control form-control-sm">
                <option value="">None</option>
                {
                  this.state.projectTitles.map(title => {
                    return <option key={title} value={title}>{title}</option>;
                  })
                }
              </Input>
            </Col>
            {/* Conditionally show Assignee filter */}
            {
              !(this.props.excludeAssignee) && (
                <Col md={2}>
                  <Label>Assigned User</Label>
                  <Input type="select" ref="assigneeFilter"
                          id="assigneeFilter"
                          value={this.props.assignee}
                          onChange={this.props.onChangeAssignee}
                          className="form-control form-control-sm">
                    <option key="None Assignee" value="">None</option>
                    <option key="No one Assignee" value="(no one)">(no one)</option>
                    {
                      this.state.usernames.map(username => {
                        return <option key={username} value={username}>{username}</option>;
                      })
                    }
                  </Input>
                </Col>
              )
            }

            <Col md={2}>
              <Label>Type</Label>
              <Input type="select"
                      value={this.props.type}
                      onChange={this.props.onChangeType}
                      className="form-control form-control-sm">
                <option key="None Type" value="">None</option>
                <option key="Bug Type" value="bug">Bug</option>
                <option key="Feature Type" value="feature">Feature</option>
              </Input >
            </Col>
            <Col md={2}>
              <Label>Status</Label>
              <Input type="select"
                      value={this.props.status}
                      onChange={this.props.onChangeStatus}
                      className="form-control form-control-sm">
                <option key="None Status" value="">None</option>
                <option key="In Progress" value="In Progress">In Progress</option>
                <option key="Resolved" value="Resolved">Resolved</option>
              </Input>
            </Col>
            <Col md={2}>
              <Label>Creator</Label>
              <Input type="select"
                      value={this.props.creator}
                      onChange={this.props.onChangeCreator}
                      className="form-control form-control-sm">
                <option key="None Creator" value="">None</option>
                {
                  this.state.usernames.map(username => {
                    return <option key={username} value={username}>{username}</option>;
                  })
                }
              </Input>
            </Col>
            <Col md={2} className="d-flex justify-content-center">
              <button className="btn btn-primary margin-top-31 btn-sm mx-auto" onClick={this.props.handleReset}>reset all</button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}