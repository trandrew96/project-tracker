import React, { Component } from 'react';
import axios from 'axios';
import TaskList from './tasks-list.component';

class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
      myTasks: [],
    }
  }

  componentDidMount(){
    axios.get('http://localhost:5000/api/tasks/')
      .then(res => { 
        let myTasks = res.data.filter( task => task.assignee === this.props.username)
        this.setState({
          myTasks: myTasks,
        })
      })
      .catch((err) => console.log(err));
  }

  render(){
    return(
      <div>
        <h3>Welcome {this.props.username}!</h3>
        <h4>You currently have { this.state.myTasks.length } tasks</h4>
        <TaskList excludeAssignee={true} username={this.props.username}></TaskList>
      </div>
    );
  }
}

export default Dashboard;