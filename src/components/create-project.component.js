import React, { Component } from 'react';
import axios from 'axios';
import { getFromStorage } from '../utils/storage';

export default class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      title: '',
      description: '',
      username: '',
      isLoading: 'true'
    };
  }

  componentDidMount() {
    const obj = getFromStorage('project_tracker');
    if (obj && obj.token) {
      // Verify token
      axios.get('http://localhost:5000/api/account/verify?token=' + obj.token)
        .then(res => {
          const data = res.data;
          console.log(data);
          if(data.success) {
            this.setState({
              token: obj.token,
              isLoading: false,
              username: obj.username
            });
          } else {
            this.setState({
              isLoading: false,
            })
          }
        })
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  onChangeTitle(e){
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e){
    this.setState({
      description: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const projectInfo = {
      title: this.state.title,
      description: this.state.description,
      username: this.state.username  // submit _id of logged in user along with project description
    }

    axios.post('http://localhost:5000/api/projects/create/', projectInfo)
    .then(res => {
      const data = res.data;
      if(data.success) {
        this.setState({
          success: data.success,
          message: data.message,
          isLoading: false,
          title: '',
          description: '',
        });   
      } else {
         this.setState({
           message: data.message,
           isLoading: false
         })
      }
    });
  }

  render() {
    const {
      message,
      success
    } = this.state;

    if(!this.state.isLoading) {
      return (
        <div>
          <h1>Create a Project</h1>
           {           
              (message && success) ? (
                <div className="alert alert-success">
                  <p>{message}</p>
                </div>
              ) : (null)
            }
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Title: </label>
              <input 
                type="text" 
                required
                className="form-control"
                value={this.state.title} 
                onChange={this.onChangeTitle}
              />
            </div>
            <div className="form-group">
              <label>Description: </label>
              <input 
                type="text" 
                required
                className="form-control"
                value={this.state.description} 
                onChange={this.onChangeDescription}
              />
            </div>
            <input type="text" required hidden value = {this.state.token} readOnly/>
            <div className="form-group">
              <input type="submit" value="Create Project" className="btn btn-primary"/>
            </div>
          </form>
        </div>
      );
    } else {
      return(
        <div>
        </div>
      );
    }
  }
}
