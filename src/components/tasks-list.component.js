import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TaskFilter from './task-filter.component';

// Renders a row for the Tasks Table. Excludes Assignee column is excludeAssignee == true
function TaskListRow(props){
  return(
    <tr>
      <td>{props.task.project}</td>
      <td>{props.task.subject}</td>
      <td>{props.task.type}</td>
      {
        (props.excludeAssignee) ? null : <td>{props.task.assignee}</td>
      }
      {
        {
          1: <td>Low</td>,
          2: <td>Med</td>,
          3: <td>High</td>
        }[props.task.priority]
      }
      <td>{props.task.status}</td>
      <td>
        <Link to={"/tasks/comments/"+props.task._id}>view</Link>
      </td>
    </tr>
  )
}

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      tasks : [],
      project: '',
      assignee: '',
      type: '',
      status: '',
      priority: 0,
      creator: '',
    }

    this.onChangeProject = this.onChangeProject.bind(this);
    this.onChangeAssignee = this.onChangeAssignee.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangePriority = this.onChangePriority.bind(this);
    this.onChangeCreator = this.onChangeCreator.bind(this);
    this.renderTaskList = this.renderTaskList.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.tableHeader = this.tableHeader.bind(this);
  }

  componentDidMount() {
    // Grab all data for all tasks
    axios.get("http://localhost:5000/api/tasks")
      .then(response => { this.setState( { tasks: response.data } )})
      .catch((error) => {console.log(error);})
     
    if(this.props.username){
      this.setState({
        assignee: this.props.username
      })
    }

  }

  // If we are on the home page, then exclude "Assignee" column in table rows
  // Otherwise include all columns
  renderTaskList() {
    return this.state.tasks
      .filter(task => { return (this.state.project !== '') ? (task.project === this.state.project) : true })
      .filter(task => { return (this.state.assignee !== '') ? (task.assignee === this.state.assignee) : true })
      .filter(task => { return (this.state.type !== '') ? (task.type === this.state.type) : true })
      .filter(task => { return (this.state.status !== '') ? (task.status === this.state.status) : true })
      .filter(task => { return (this.state.priority != 0) ? (task.priority == this.state.priority) : true })
      .filter(task => { return (this.state.creator !== '') ? (task.creator === this.state.creator) : true })
      .map(currenttask => {
        return <TaskListRow task={currenttask} excludeAssignee={this.props.excludeAssignee} key={currenttask._id}></TaskListRow>;
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

  onChangePriority(e){
    this.setState({
      priority: e.target.value,
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

  tableHeader(){
    if (!this.props.excludeAssignee) 
      return <h3>Current Tasks</h3> 
  }

  render() {
    return (
      <div>
        { this.tableHeader() }
        <TaskFilter 
          onChangeProject={this.onChangeProject} project={this.state.project}
          onChangeType={this.onChangeType} type={this.state.type}
          onChangeAssignee={this.onChangeAssignee} assignee={this.state.assignee}
          onChangeStatus={this.onChangeStatus} status={this.state.status}
          onChangePriority={this.onChangePriority} priority={this.state.priority}
          onChangeCreator={this.onChangeCreator} creator={this.state.creator}
          excludeAssignee={this.props.excludeAssignee}
          // Somehow the TaskFilter component is calling TaskList's 'handleReset' function without it being passed as a prop
        ></TaskFilter>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Project</th>
              <th>Subject</th>
              <th>Type</th>
              {
                (this.props.excludeAssignee) ? null : <th>Assigned To</th>
              }
              <th>Priority</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.renderTaskList() }
          </tbody>
        </table>
      </div>
    )
  }
}