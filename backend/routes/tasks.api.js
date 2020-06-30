const Task = require('../models/task.model');

const router = require('express').Router();

router.route('/create').post((req, res) => {
  const {
    project,
    type,
    subject,
    description,
    creator,
    assignee,
  } = req.body;

  if (!project || !subject || !type || !creator || !assignee ) {
    return res.send({
      success: false,
      message: 'Error: All fields are required (except description)'
    });
  }

  // Save the new task
  const newTask = new Task();

  newTask.project = project;
  newTask.subject = subject;
  newTask.type = type;
  newTask.creator = creator;
  newTask.assignee = assignee;
  newTask.description = description;

  newTask.save((err, task) => {
    if (err) {
      console.log(err)
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }

    return res.send({
      success: true,
      message: 'Success! Task Created'
    });
  })
  
});

router.route('/').get((req, res) => {
  Task.find()
  .then(tasks => res.json(tasks))
  .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').get((req, res) => {
  Task.findById(req.params.id)
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;