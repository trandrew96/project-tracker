const Task = require('../models/task.model');
const Comment = require('../models/comment.model');
const router = require('express').Router();

/* All routes in this file start with /api/tasks */

// Create a task
/* localhost:5000/api/tasks/create */
router.route('/create').post((req, res) => {
  const {
    project,
    type,
    subject,
    description,
    creator,
    assignee,
    priority,
  } = req.body;

  if (!project || !subject || !type || !creator || !assignee || !priority ) {
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
  newTask.priority = priority;

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

// Get all tasks
/* localhost:5000/api/tasks */
router.route('/').get((req, res) => {
  Task.find()
  .then(tasks => res.json(tasks))
  .catch(err => res.status(400).json('Error: ' + err));
})

// Get data for a specific task
/* localhost:5000/api/tasks/5efaf9b54235fe30fc301274 */
router.route('/:id').get((req, res) => {
  Task.findById(req.params.id)
    .then(task => res.json(task))
    .catch(err => res.status(400).json('Error: ' + err));
})

// Submit a comment
/* localhost:5000/api/tasks/submit-comment */
router.route('/submit-comment').post((req, res) => {
  // 1. Verify all fields are filled in
  const {
    username,
    comment,
    taskId
  } = req.body;

  // const taskId = req.params.id;

  if (!username || !comment || !taskId ) {
    return res.send({
      success: false,
      message: 'Error: All fields are required'
    });
  }

  // 2. Verify that the task exists
  Task.findById(req.params.id)
    .then(task => {
      // res.json(task)
    })
    .catch(err => res.status(400).json('Error: ' + err)); // Task doesn't exist

  // 3. Save the comment and include taskId
  const newComment = new Comment();

  newComment.username = username;
  newComment.comment = comment;
  newComment.taskId = taskId;

  newComment.save((err, comment) => {
    if (err) {
      console.log(err)
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }

    return res.send({
      success: true,
      message: 'Success! Comment submitted'
    });
  })
})

// Get comments for a specific task
/* localhost:5000/api/tasks/get-comments/5efaf9b54235fe30fc301274 */
router.route('/get-comments/:id').get((req, res) => {
  Comment.find({
    taskId: req.params.id
  })
    .then(task => res.json(task))
    .catch(err => res.status(400).json('Error: ' + err));
})

// Update a task's status
/* localhost:5000/api/tasks/update-status/<taskId> */
router.route('/update-status/:id').post((req, res) => {
  if (!req.body.status ) {
    return res.send({
      success: false,
      message: 'Error: newStatus field required'
    });
  }

  Task.findById(req.params.id)
    .then(task => {
      task.status = req.body.status;
      task.save()
        .then(() => res.json('Task Status updated'))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;