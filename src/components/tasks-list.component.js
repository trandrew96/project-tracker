import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TaskFilter from "./task-filter.component";
import asc from "../img/asc-sort.png";
import desc from "../img/desc-sort.png";
import noneSort from "../img/none-sort.png";

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const month = date.toLocaleString("default", { month: "short" });
  return month + " " + date.getDate();
}

// Renders a row for the Tasks Table. Excludes Assignee column is excludeAssignee == true
function TaskListRow(props) {
  return (
    <tr>
      <td>{props.task.project}</td>
      <td>
        <Link to={"/tasks/comments/" + props.task._id}>
          {props.task.subject}
        </Link>
      </td>
      <td>{props.task.type}</td>
      {props.excludeAssignee ? null : <td>{props.task.assignee}</td>}
      {
        {
          1: <td>Low</td>,
          2: <td>Med</td>,
          3: <td>High</td>,
        }[props.task.priority]
      }
      <td>{props.task.status}</td>
      <td>{formatDate(props.task.createdAt)}</td>
    </tr>
  );
}

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      project: "",
      assignee: "",
      type: "",
      status: "",
      priority: 0,
      creator: "",
      prioritySort: "none",
      showArchived: false,
      loading: true,
    };

    this.onChangeProject = this.onChangeProject.bind(this);
    this.onChangeAssignee = this.onChangeAssignee.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangePriority = this.onChangePriority.bind(this);
    this.onChangeCreator = this.onChangeCreator.bind(this);
    this.onChangeArchived = this.onChangeArchived.bind(this);
    this.renderTaskList = this.renderTaskList.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.sortByPriority = this.sortByPriority.bind(this);
    this.renderSortIcon = this.renderSortIcon.bind(this);
    this.tableHeader = this.tableHeader.bind(this);
  }

  componentDidMount() {
    // Grab all data for all tasks
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => {
        // Sort tasks so that In Progress comes before In QA comes before Resolved
        let newTasks = response.data.sort((a, b) => {
          if (a.status < b.status) {
            return -1;
          }
          if (a.status > b.status) {
            return 1;
          }
          return 0;
        });
        this.setState({ tasks: newTasks });
      })
      .catch((error) => {
        console.log(error);
      });

    // show tasks that are assigned to you if on home page
    if (this.props.username) {
      this.setState({
        assignee: this.props.username,
      });
    }

    // Set filters according to query params
    let search = window.location.search;
    let params = new URLSearchParams(search);
    if (params.get("project")) {
      this.setState({ project: params.get("project") });
    }
    if (params.get("archived")) {
      this.setState({ showArchived: params.get("archived") });
    }

    this.setState({
      loading: false,
    });
  }

  // If we are on the home page, then exclude "Assignee" column in table rows
  // Otherwise include all columns
  renderTaskList() {
    return this.state.tasks
      .filter((task) => {
        return this.state.project !== ""
          ? task.project === this.state.project
          : true;
      })
      .filter((task) => {
        return this.state.assignee !== ""
          ? task.assignee === this.state.assignee
          : true;
      })
      .filter((task) => {
        return this.state.type !== "" ? task.type === this.state.type : true;
      })
      .filter((task) => {
        return this.state.status !== ""
          ? task.status === this.state.status
          : true;
      })
      .filter((task) => {
        return this.state.priority != 0
          ? task.priority == this.state.priority
          : true;
      })
      .filter((task) => {
        return this.state.creator !== ""
          ? task.creator === this.state.creator
          : true;
      })
      .filter((task) => {
        return this.state.showArchived ? task.archived : !task.archived;
      })
      .map((currenttask) => {
        return (
          <TaskListRow
            task={currenttask}
            excludeAssignee={this.props.excludeAssignee}
            key={currenttask._id}
          ></TaskListRow>
        );
      });
  }

  onChangeProject(e) {
    this.setState({
      project: e.target.value,
    });
  }

  onChangeAssignee(e) {
    this.setState({
      assignee: e.target.value,
    });
  }

  onChangeType(e) {
    this.setState({
      type: e.target.value,
    });
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
    });
  }

  onChangePriority(e) {
    this.setState({
      priority: e.target.value,
    });
  }

  onChangeCreator(e) {
    this.setState({
      creator: e.target.value,
    });
  }

  onChangeArchived(e) {
    this.setState({
      showArchived: e.target.checked,
    });
  }

  handleReset() {
    this.setState({
      project: "",
      assignee: "",
      type: "",
      creator: "",
      status: "",
    });
  }

  tableHeader() {
    if (!this.props.excludeAssignee) {
      if (this.state.project != "") {
        return <h3>{this.state.project} Tasks</h3>;
      } else {
        return <h3>All Project Tasks</h3>;
      }
    } else if (this.props.username) {
      const myTasks = this.state.tasks.filter((task) => {
        return task.assignee == this.props.username && !task.archived;
      });
      return <h4>You currently have {myTasks.length} tasks</h4>;
    }
  }

  // Sort tasks by priority, or reset the order of tasks so they're sorted by date
  sortByPriority(e) {
    let newTasksArray = [];
    switch (this.state.prioritySort) {
      case "none":
        this.setState({ prioritySort: "asc" });
        newTasksArray = this.state.tasks.sort(
          (a, b) => a.priority - b.priority
        );
        this.setState({ tasks: newTasksArray });
        break;
      case "asc":
        this.setState({ prioritySort: "desc" });
        newTasksArray = this.state.tasks.sort(
          (a, b) => b.priority - a.priority
        );
        this.setState({ tasks: newTasksArray });
        break;
      case "desc":
        this.setState({ prioritySort: "none" }); // no longer sorting by priority, so go back to sorting by date
        newTasksArray = this.state.tasks.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        this.setState({ tasks: newTasksArray });
        break;
      default:
        break;
    }
  }

  // Render the sorting icon
  renderSortIcon() {
    switch (this.state.prioritySort) {
      case "none":
        return (
          <img src={noneSort} style={{ height: 18 }} alt="none-sort"></img>
        );
      case "asc":
        return <img src={asc} style={{ height: 18 }} alt="asc-sort"></img>;
      case "desc":
        return <img src={desc} style={{ height: 18 }} alt="desc-sort"></img>;
      default:
        return null;
    }
  }

  render() {
    if (this.state.loading) return <h1>Loading...</h1>;

    return (
      <div>
        {this.tableHeader()}
        <TaskFilter
          onChangeProject={this.onChangeProject}
          project={this.state.project}
          onChangeType={this.onChangeType}
          type={this.state.type}
          onChangeAssignee={this.onChangeAssignee}
          assignee={this.state.assignee}
          onChangeStatus={this.onChangeStatus}
          status={this.state.status}
          onChangePriority={this.onChangePriority}
          priority={this.state.priority}
          onChangeCreator={this.onChangeCreator}
          creator={this.state.creator}
          onChangeArchived={this.onChangeArchived}
          showArchived={this.state.showArchived}
          excludeAssignee={this.props.excludeAssignee}
          // Somehow the TaskFilter component is calling TaskList's 'handleReset' function without it being passed as a prop
        ></TaskFilter>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Project</th>
              <th>Subject</th>
              <th>Type</th>
              {this.props.excludeAssignee ? null : <th>Assigned To</th>}
              <th>
                <span onClick={this.sortByPriority}>
                  Priority<span> </span>
                  {this.renderSortIcon()}
                </span>
              </th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>{this.renderTaskList()}</tbody>
        </table>
      </div>
    );
  }
}
