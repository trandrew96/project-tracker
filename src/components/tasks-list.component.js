import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TaskFilter from './task-filter.component';

const Task = props => (
  <tr>
    <td>{props.task.project}</td>
    <td>{props.task.subject}</td>
    <td>{props.task.type}</td>
    <td>{props.task.assignee}</td>
    <td>{props.task.status}</td>
    <td>
      <Link to={"/tasks/comments/"+props.task._id}>view</Link>
    </td>
  </tr>
)

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      tasks : [],
      project: '',
      assignee: '',
      type: '',
      status: '',
      creator: '',
    }

    this.onChangeProject = this.onChangeProject.bind(this);
    this.onChangeAssignee = this.onChangeAssignee.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeCreator = this.onChangeCreator.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    // Grab all data for all tasks
    axios.get("http://localhost:5000/api/tasks")
      .then(response => { this.setState( { tasks: response.data } )})
      .catch((error) => {console.log(error);})

  }

  taskList() {
    return this.state.tasks
      .filter(task => { return (this.state.project !== '') ? (task.project === this.state.project) : true })
      .filter(task => { return (this.state.assignee !== '') ? (task.assignee === this.state.assignee) : true })
      .filter(task => { return (this.state.type !== '') ? (task.type === this.state.type) : true })
      .filter(task => { return (this.state.status !== '') ? (task.status === this.state.status) : true })
      .filter(task => { return (this.state.creator !== '') ? (task.creator === this.state.creator) : true })
      .map(currenttask => {
      return <Task task={currenttask} key={currenttask._id}></Task>;
    })
  }

  onChangeProject(e){
    this.setState({
      project: e.target.value,
    })
  }

  onChangeAssignee(e){
    this.setState({
      assignee: e.target.value,
    })
  }

  onChangeType(e){
    this.setState({
      type: e.target.value,
    })
  }

  onChangeStatus(e){
    this.setState({
      status: e.target.value,
    })
  }

  onChangeCreator(e){
    this.setState({
      creator: e.target.value,
    })
  }

  handleReset(){
    this.setState({
      project: '',
      assignee: '',
      type: '',
      creator: '',
      status: ''
    })
  }

  render() {
    return (
      <div>
        <h3>Current Tasks</h3>
        <TaskFilter 
          onChangeProject={this.onChangeProject} project={this.state.project}
          onChangeType={this.onChangeType} type={this.state.type}
          onChangeAssignee={this.onChangeAssignee} assignee={this.state.assignee}
          onChangeStatus={this.onChangeStatus} status={this.state.status}
          onChangeCreator={this.onChangeCreator} creator={this.state.creator}
          // Somehow the TaskFilter component is calling TaskList's 'handleReset' function without it being passed as a prop
        ></TaskFilter>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Project</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th></th>
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