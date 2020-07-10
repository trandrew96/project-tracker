const Project = require("../models/project.model");
const router = require("express").Router();

/* All URLS on this page start with /api/projects*/

router.route("/create").post((req, res) => {
  const { title, description, username } = req.body;

  if (!title || !description || !username) {
    return res.send({
      success: false,
      message: "Error: Title, description, and user are required",
    });
  }

  // Steps:
  // 1. Verify project doesn't already exist
  // 2. Save
  Project.find(
    {
      title: title,
    },
    (err, previousProjects) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error",
        });
      } else if (previousProjects.length > 0) {
        return res.send({
          success: false,
          message: "Error: Project with that name already exists",
        });
      }

      // Save the new project
      const newProject = new Project();

      newProject.title = title;
      newProject.description = description;
      newProject.username = username;

      newProject.save((err, project) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error",
          });
        }

        return res.send({
          success: true,
          message: "Success! Project Created",
        });
      });
    }
  );
});

// Get All Projects
router.route("/").get((req, res) => {
  Project.find()
    .then((projects) => res.json(projects))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get Specific Project Info
router.route("/:id").get((req, res) => {
  Project.findById(req.params.id)
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Update Project Info
router.route("/update/:id").post((req, res) => {
  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    return res.send({
      success: false,
      message: "Error: Title, description, and status are required",
    });
  }

  Project.findById(req.params.id).then((project) => {
    project.title = title;
    project.description = description;
    project.status = status;

    project
      .save()
      .then(() => {
        return res.send({
          success: true,
          message: "Project Updated!",
        });
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
