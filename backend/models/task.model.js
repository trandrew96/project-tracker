const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  project: {
    type: String,
    default: '',
    required: true
  },

  type: {
    type: String,
    default: '',
    required: true
  },
  
  subject: {
    type: String,
    default: '',
    required: true
  },

  creator: {
    type: String,
    default: '',
    required: true
  },
  assignee: {
    type: String,
    default: '',
    required: true
  },
  description: {
    type: String,
    default: '',
  },
  priority: {
    type: Number,
    default: 1,
    required: true
  },
  status: {
    type: String,
    default: 'In Progress',
  }
}, {
  timestamps: true, // db will automatically create fields when object is created or modified
});

module.exports = mongoose.model('Task', TaskSchema);