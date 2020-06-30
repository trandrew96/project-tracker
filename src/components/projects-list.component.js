import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Project = props => (
  <tr>
    <td>{props.project.title}</td>
    <td>{props.project.description}</td>
    <td>{props.project.username}</td>
  </tr>
)

export default class ProjectsList extends Component {
  constructor(props) {
    super(props);

    this.state = { projects: [] }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/api/projects")
      .then(response => {
        this.setState( { projects: response.data } )
      })
      .catch((error) => {
        console.log(error);
      })
  }

  projectList() {
    return this.state.projects.map(currentproject => {
      return <Project project={currentproject} key={currentproject._id}></Project>;
    })
  }

  render() {
    return (
      <div>
        <h3>Logged Exercises</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Creator</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            { this.projectList() }
          </tbody>
        </table>
      </div>
    )
  }
}