const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'In Progress'
  },
  username: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
