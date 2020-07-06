import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class ViewTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: '',
      type: '',
      subject: '',
    }
  }

  // Grab data for the current task
  componentDidMount() {

    let res = {};
    axios.get('http://localhost:5000/api/tasks/'+this.props.match.params.id) // we are getting the id directly from the URL
      .then(response => {
        res = response;
        this.setState({
          project: response.data.project,
          type: response.data.type,
          subject: response.data.subject,
          description: response.data.description,
          creator: response.data.assignee,
          assignee: response.data.creator
        })   
      })
      .catch(function (error) {
        console.log(error);
      })

      console.log(res);
  }

  render() {
    return (
      <div class="card">
        <div class="card-body">
          <h2>{this.state.subject}</h2>
          <p>{this.state.project} - {this.state.type}</p>
          <p>{this.state.description}</p>
        </div>
      </div>
    )
  }
}