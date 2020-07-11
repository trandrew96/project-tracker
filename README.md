<h1>Project Management Web App</h1>
<p>This app simplifies project management. Here is what you can do with this app:</p>
<ul>
  <li>Create tickets for bugs or features</li>
  <li>Mark tickets as "In Progress", "In QA", or "Resolved"</li>
  <li>Assign tickets to other users, for example developers can assign their ticket to QA and vice-versa</li>
  <li>Organize tickets by project/milestone</li>
  <li>Each user has a personalized table which only shows tickets that are assigned to them</li>
  <li>View all tickets in one place, and optionally filter them based on assigned user, priority, status, etc.</li>
  <li>Mark project's as "Complete" and automatically archive all tickets related to that project</li>
</ul>

<h3>Setting up the project is easy</h3>
1. $ npm install </br>
2. Create a .env file, and create a variable called ATLAS_URI that points to your Mongo Atlas URI</br>
3. Start the backend server. It is currently configured to listen localhost:5000
<br/></br>
**$ cd /backend**
<br/></br>
**$ nodemon server**
</br></br>

4. Start the react app. The web app that you visit in the browser is hosted on Port 3000 (e.g. go to localhost:3000 in your browser)
<br/><br/>
**$ cd /project-tracker/**
<br/><br/>
**$ npm start**

</br>
</br>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
