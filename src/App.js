import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import CreateProject from "./components/create-project.component";
import ProjectsList from "./components/projects-list.component";
import EditProjectPage from "./components/edit-project.component";
import CreateTask from "./components/create-task.component";
import TasksList from "./components/tasks-list.component";
import ViewTask from "./components/view-task.component";

// import EditExercise from "./components/edit-exercise.component";

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/" exact component={Home} />
        <Route path="/projects/create" component={CreateProject} />
        <Route path="/projects/" exact component={ProjectsList} />
        <Route path="/projects/edit/:id" component={EditProjectPage} />
        <Route path="/tasks/create" exact component={CreateTask} />
        <Route path="/tasks/comments/:id" component={ViewTask} />
        <Route path="/tasks/" exact component={TasksList} />
        {/* <Route path="/edit/:id" component={EditExercise} /> */}
      </div>
    </Router>
  );
}

export default App;
