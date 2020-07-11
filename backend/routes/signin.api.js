const User = require("../models/user.model");
const UserSession = require("../models/userSession.model");

const router = require("express").Router();

router.route("/signup").post((req, res) => {
  const { body } = req;
  const { username, firstName, lastName, password } = body;
  let { email } = body;

  console.log(body);

  if (!username || !firstName || !lastName || !email || !password) {
    return res.send({
      success: false,
      message: "Error: All fields must be filled",
    });
  }

  email = email.toLowerCase();

  // Steps:
  // 1. Verify email and username don't already exist
  // 2. Save the new user
  User.find(
    {
      $or: [{ email: email }, { username: username }],
    },
    (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error",
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: "Error: Username or email already exists",
        });
      }

      // Save the new user
      const newUser = new User();

      newUser.username = username;
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);

      newUser.save((err, user) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "Error: Server error",
          });
        }

        return res.send({
          success: true,
          message: "Success! You have signed up",
        });
      });
    }
  );
});

router.route("/signin").post((req, res) => {
  const { body } = req;
  const { password } = body;
  let { email } = body;

  if (!email || !password) {
    return res.send({
      success: false,
      message: "Error: Email and password cannot be blank",
    });
  }

  email = email.toLowerCase();

  // Check user against their password
  User.find(
    {
      email: email,
    },
    (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error",
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid username",
        });
      }

      const user = users[0];

      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: "Error: Invalid password",
        });
      }

      // Username/password is correct
      const userSession = new UserSession();
      userSession.username = user.username;
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: server error",
          });
        }

        return res.send({
          success: true,
          message: "Valid sign in",
          username: user.username,
          token: doc._id,
          userId: user._id,
        });
      });
    }
  );
});

router.route("/verify").get((req, res) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test

  // Verify the token is unique and not deleted
  UserSession.find(
    {
      _id: token,
      isDeleted: false,
    },
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error",
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid id",
        });
      } else {
        return res.send({
          success: true,
          message: "Token is valid",
        });
      }
    }
  );
});

router.route("/logout").get((req, res) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test

  // Verify the token is unique and not deleted, then set it to deleted
  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    null,
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error",
        });
      }

      return res.send({
        success: true,
        message: "Logout successful",
      });
    }
  );
});

module.exports = router;
