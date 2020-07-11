import React, { Component } from "react";
import axios from "axios";
import TaskList from "./tasks-list.component";

// Dashboard the home page when the user is signed in
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myTasks: [],
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <h3>Welcome {this.props.username}!</h3>
        <TaskList
          excludeAssignee={true}
          username={this.props.username}
        ></TaskList>
      </div>
    );
  }
}

export default Dashboard;
