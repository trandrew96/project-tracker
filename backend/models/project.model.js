const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
