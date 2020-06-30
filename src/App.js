import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component"
import Home from "./components/home.component";
import CreateProject from "./components/create-project.component";
import ProjectsList from "./components/projects-list.component";
import CreateTask from "./components/create-task.component";

// import EditExercise from "./components/edit-exercise.component";


function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br/>
        <Route path="/" exact component={Home} />
        <Route path="/create-project" component={CreateProject} />
        <Route path="/projects/" component={ProjectsList} />
        <Route path="/create-task" component={CreateTask}/>
        {/* <Route path="/edit/:id" component={EditExercise} /> */}
      </div>
    </Router>
  );
}

export default App;