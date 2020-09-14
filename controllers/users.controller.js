const usersModel = require("../models/users.model");
const User = require('../models/users.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* POST register */
exports.register = (req, res) => {
  let body = req.body;
  User.findOne({ email: body.email }).then((doc) => {
    if (doc) {
      res.json({ emailMessage: "this email is already taken" });
    } else {
      bcrypt.hash(body.password, 10).then((hashedPassword) => {
        let newUser = new User({
          userName: body.userName,
          email: body.email,
          password: hashedPassword,
          addedDate: new Date(),
        });
        newUser.save().then((doc) => {
          let token = jwt.sign({ userId: doc._id, role: doc.role }, process.env.userSecretKey)
          res.json({ access_token: token, role: doc.role });
        });
      });
    }
  })
};

/* POST login */
exports.login = (req, res) => {
  let body = req.body;
  User.findOne({ email: body.email }).then((doc) => {
    if (!doc) {
      res.jason({ emailMessage: "email is incorrect" })
    } else {
      bcrypt
        .compare(body.password, doc.password)
        .then((same) => {
          if (!same) {
            res.json({ passwordMessage: "password is incorrect" })
          } else {
            switch (doc.role) {
              case 'user': {
                let token = jwt.sign({ userId: doc._id, role: doc.role }, process.env.userSecretKey, {
                  expiresIn: "1h",
                });
                res.json({ access_token: token, role: doc.role });
              }
                break
              case 'admin': {
                let token = jwt.sign({ userId: doc._id, role: doc.role }, process.env.adminSecretKey, {
                  expiresIn: "1h",
                });
                res.json({ access_token: token, role: doc.role });
              }
                break
              default: {
                res.json(user);
              }
            }
          }
        })
        .catch((err) => {
          reject(err);
          mongoose.disconnect();
        });
    }
  })
};

/* GET all Users */
exports.getAllUsers = (req, res) => {
  User.find()
    .sort({ addedDate: -1 })
    .then((doc) => {
      res.json(doc)
    })
};

/* PATCH User */
exports.updateUser = (req, res) => {
  let body = req.body;
  User.findById(req.params.id)
    .then((doc) => {
      bcrypt.hash(body.password, 10).then((hashedPassword) => {
        User.updateOne({
          userName: body.userName,
          email: body.email,
          password: hashedPassword,
        }).then((value) => {
          res.json(value)
        });
      });
    })
};

/* DELETE by ID */
exports.deleteUser = (req, res) => {
  let userId = req.params.id;
  User.findById(userId)
    .then((doc) => {
      User.deleteOne(doc)
        .then((value) => {
          res.json(value);
        })
    })
    .catch((err) => {
      res.json({ message: "there is no user like this" });
    });
};
