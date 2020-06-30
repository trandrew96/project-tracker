import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">ProjectTracker</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/create-project" className="nav-link">Create Project</Link>
          </li>
          <li className="navbar-item">
            <Link to="/projects" className="nav-link">View Projects</Link>
          </li>
          <li className="navbar-item">
            <Link to="/create-task" className="nav-link">Create Task</Link>
          </li>
          <li className="navbar-item">
            <Link to="/tasks" className="nav-link">Tasks</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}