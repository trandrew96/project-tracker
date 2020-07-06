const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json()); // lets use send/receive json

// connecting to mongodb database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

/* project tracker api's */
const signinRouter = require('./routes/signin.api.js')
const projectsRouter = require('./routes/projects.api.js')
const tasksRouter = require('./routes/tasks.api.js')
const usersRouter = require('./routes/users');

app.use('/api/account', signinRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

/* TODO: Delete these */
const exercisesRouter = require('./routes/exercises');
app.use('/exercises', exercisesRouter); // every url that starts with /exercises will be handled by exercisesrouter

app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});