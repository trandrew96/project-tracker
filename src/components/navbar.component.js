import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          Home
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <NavLink
                to="/projects"
                exact
                className="nav-link"
                activeClassName="active"
              >
                Projects
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/tasks/"
                exact
                className="nav-link"
                activeClassName="active"
              >
                Tasks
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/projects/create"
                className="nav-link"
                activeClassName="active"
              >
                Create Project
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/tasks/create"
                className="nav-link"
                activeClassName="active"
              >
                Create Task
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
