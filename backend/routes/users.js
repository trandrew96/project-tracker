const router = require('express').Router();
let User = require('../models/user.model');

// get all users info
router.route('/').get((req, res) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

// get fullname of user from userId
// router.route('/fullname/:id').get((req, res) => {

//   const userId = req.params.id;

//   User.find({
//     _id: userId,
//   }) // mongoose method
//     .then(users => {
//       const data = {
//         fullName: users[0].firstName + " " + users[0].lastName
//       }
//       res.json(data)
//     })
//     .catch(err => res.status(400).json('Error: ' + err));
// })

// router.route('/add').post((req, res) => {
//   const username = req.body.username;

//   const newUser = new User({username});

//   newUser.save()
//     .then(() => res.json('User added!'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

module.exports = router;