import React, { Component } from 'react';
import axios from 'axios';

function TaskBrief(props){
  return (
    <div>
      <p>{props.project}</p>
      <p>{props.description}</p>
    </div>
  )
}

class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
      myTasks: [],
    }

    this.listOne = this.listOne.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:5000/api/tasks/')
    .then(res => { 
      let myTasks = res.data.filter( task => task.assignee = this.props.username)
      this.setState({
        myTasks: myTasks,
      })
    })
    .catch((err) => console.log(err));
  }

  listOne() {
    let uniqueProjectTitles = [...new Set(this.state.myTasks.map(task => task.project))];
    let counts = new Array(uniqueProjectTitles.length).fill(0);
    for(let i=0; i < counts.length; i++) {
      counts[i] = this.state.myTasks.filter( task => {
        return (uniqueProjectTitles[i] === task.project)
      }).length;
    }
    
    var taskCount = uniqueProjectTitles.map(function (x, i) { 
      return {
        project: x,
        count: counts[i],
      }
    });   

    console.log(uniqueProjectTitles);
    console.log(counts)
    console.log(taskCount)

    return(
      <ul className="list-group">
        {
          taskCount.map( task => {
            return(
              <li className="list-group-item d-flex justify-content-between align-items-center" key={task.project}>
                { task.project }
                <span className="badge badge-primary badge-pill">{task.count}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }

  render(){
    return(
      <div>
        <div className="row mb-5">
          <div className="col-12">
            <p>You currently have {this.state.myTasks.length} tasks assigned to you</p>
          </div>
          <div className="col-md-4">
            {this.listOne()}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;