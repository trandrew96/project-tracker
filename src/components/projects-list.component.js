import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Project = props => (
  <tr>
    <td>{props.project.title}</td>
    <td>{props.project.description}</td>
    <td>{props.project.username}</td>
    {/* <td>{props.project.userId}</td> */}
    {/* <td>{props.project.date.substring(0, 10)}</td> */}
    {/* <td>
      <Link to={"/edit/"+props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id)}}>delete</a>
    </td> */}
  </tr>
)

export default class ProjectsList extends Component {
  constructor(props) {
    super(props);

    // this.deleteExercise = this.deleteExercise.bind(this);

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

  // deleteExercise(id) {
  //   axios.delete('http://localhost:5000/exercises/' + id)
  //     .then(res => console.log(res.data));

  //   // automatically update state when exercise is deleted
  //   this.setState({
  //     exercises: this.state.exercises.filter(el => el._id !== id)
  //   })
  // }

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