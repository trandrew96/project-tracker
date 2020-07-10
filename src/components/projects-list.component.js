import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Row, Col, Form, Table, Input } from "reactstrap";

function ProjectsFilter({ status, onChangeStatus }) {
  return (
    <div>
      <Form>
        <Input
          type="select"
          value={status}
          onChange={(e) => onChangeStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </Input>
      </Form>
    </div>
  );
}

function ProjectsTable({ projects }) {
  return (
    <Table>
      <thead className="thead-light">
        <tr>
          <th>Project</th>
          <th>Description</th>
          <th>Status</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => {
          return (
            <tr key={index}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.status}</td>
              <td>
                <Link to={"/projects/edit/" + project._id}>edit</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState([]); // allProjects will contains all projects, and will never change
  const [projects, setProjects] = useState([]); // projects is the filtered version of allProjects and will change
  const [status, setStatus] = useState("In Progress"); // default filter for projects

  // Fetch all projects when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:5000/api/projects");
      setProjects(result.data.filter((project) => project.status === status));
      setAllProjects(result.data);
    };
    fetchData();
  }, []);

  // Update projects array when 'status' filter is changed
  useEffect(() => {
    if (status != "All") {
      const newProjects = [...allProjects].filter(
        (project) => project.status === status
      );
      setProjects(newProjects);
    } else {
      setProjects(allProjects);
    }
  }, [status]);

  return (
    <div>
      <h4>Projects</h4>
      <Row className="mb-3">
        <Col md={3}>
          <ProjectsFilter
            status={status}
            // onChangeStatus={onChangeStatus}
            onChangeStatus={setStatus}
          ></ProjectsFilter>
        </Col>
      </Row>
      <ProjectsTable projects={projects}></ProjectsTable>
    </div>
  );
}
