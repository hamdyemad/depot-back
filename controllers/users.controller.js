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
      if (req.headers['accept-language'] == 'ar') {
        res.json({ emailMessage: "الايميل الذي ادخلته خطأ" })
      } else {
        res.json({ emailMessage: "email is incorrect" })
      }
    } else {
      bcrypt
        .compare(body.password, doc.password)
        .then((same) => {
          if (!same) {
            console.log(req.headers)
            if (req.headers['accept-language'] == 'ar') {
              res.json({ passwordMessage: "الرقم السري خطأ" })
            } else {
              res.json({ passwordMessage: "password is incorrect" })
            }
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
              case 'super-admin': {
                let token = jwt.sign({ userId: doc._id, role: doc.role }, process.env.adminSecretKey, {
                  expiresIn: "1h",
                });
                res.json({ access_token: token, role: doc.role });
              }
                break
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

/* GET all Admins */
exports.getAllAdmins = (req, res) => {
  console.log(req.role);
  if (req.role == 'super-admin') {
    User.find({ $or: [{ role: 'admin' }, { role: 'super-admin' }] })
      .sort({ addedDate: -1 })
      .then((doc) => {
        res.json(doc)
      })
  } else {
    res.sendStatus(401);
  }
};

/* POST add new admin */
exports.addAdmin = (req, res) => {
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
          role: req.role
        });
        newUser.save().then((doc) => {
          res.json(doc);
        });
      });
    }
  })
}

/* GET user information by id */
exports.getUserInfo = (req, res) => {
  User.find({ _id: req.userId }).then((doc) => {
    res.json(doc);
  })
}


/* PATCH update admin role */
exports.updateAdminRole = (req, res) => {
  if (req.role == 'super-admin') {
    User.findOneAndUpdate({ _id: req.params.id }, {
      role: req.body.role
    }).then((doc) => {
      res.json(doc);
    })
  } else {
    res.sendStatus(401)
  }
}

/* DELETE admin by ID */
exports.deleteAdmin = (req, res) => {
  if (req.role == 'super-admin') {
    const userId = req.params.id;
    User.findOneAndDelete({ _id: userId }).then((doc) => {
      res.json(doc);
    })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.sendStatus(401)
  }
};
