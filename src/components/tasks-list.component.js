import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Task = props => (
  <tr>
    <td>{props.task.project}</td>
    <td>{props.task.subject}</td>
    <td>{props.task.type}</td>
    <td>
      <Link to={"/tasks/"+props.task._id}>view</Link>
    </td>
  </tr>
)

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = { tasks : [] }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/api/tasks")
      .then(response => {
        this.setState( { tasks: response.data } )
      })
      .catch((error) => {
        console.log(error);
      })
  }

  taskList() {
    return this.state.tasks.map(currenttask => {
      return <Task task={currenttask} key={currenttask._id}></Task>;
    })
  }

  render() {
    return (
      <div>
        <h3>Current Tasks</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Project</th>
              <th>Subject</th>
              <th>Type</th>
              <th></th>
              {/* TODO: Add button for viewing specific task */}
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            { this.taskList() }
          </tbody>
        </table>
      </div>
    )
  }
}