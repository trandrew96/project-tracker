import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";

function EditProjectForm({
  title,
  description,
  status,
  onChangeTitle,
  onChangeDescription,
  onChangeStatus,
  onSubmit,
}) {
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label>Title</Label>
        <Input value={title} onChange={onChangeTitle} disabled></Input>
      </FormGroup>
      <FormGroup>
        <Label>Description</Label>
        <Input
          type="textarea"
          value={description}
          onChange={onChangeDescription}
        ></Input>
      </FormGroup>
      <FormGroup>
        <Label>Status</Label>
        <Input type="select" value={status} onChange={onChangeStatus}>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </Input>
      </FormGroup>
      {status == "Complete" ? (
        <Alert color="danger">
          Marking this project as complete will archive all tasks in this
          project. This cannot be undone.
        </Alert>
      ) : null}
      <FormGroup>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </FormGroup>
    </Form>
  );
}

export default function EditProjectPage() {
  const [project, setProject] = useState({});
  const { id: projectId } = useParams();
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch current info for current project
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        "http://localhost:5000/api/projects/" + projectId
      );
      setProject(result.data);
    };
    fetchData();
  }, []);

  const onChangeTitle = (e) => {
    let newProject = { ...project };
    newProject.title = e.target.value;
    setProject(newProject);
  };

  const onChangeDescription = (e) => {
    let newProject = { ...project };
    newProject.description = e.target.value;
    setProject(newProject);
  };

  const onChangeStatus = (e) => {
    let newProject = { ...project };
    newProject.status = e.target.value;
    setProject(newProject);
  };

  const onSubmit = (e) => {
    e.preventDefault(e);

    const projectInfo = {
      title: project.title,
      description: project.description,
      status: project.status,
    };

    axios
      .post(
        "http://localhost:5000/api/projects/update/" + project._id,
        projectInfo
      )
      .then((res) => {
        setSuccess(true);
        setMessage(res.data.message);
      })
      .catch((err) => {
        setSuccess(false);
        setMessage(err.message);
        console.log(err);
      });
  };

  return (
    <div>
      {message && success ? (
        <Alert message={message} color="success">
          {message}
        </Alert>
      ) : null}
      {message && !success ? (
        <Alert message={message} color="warning">
          {message}
        </Alert>
      ) : null}
      <EditProjectForm
        title={project.title}
        description={project.description}
        status={project.status}
        onChangeTitle={onChangeTitle}
        onChangeDescription={onChangeDescription}
        onChangeStatus={onChangeStatus}
        onSubmit={onSubmit}
      />
    </div>
  );
}
