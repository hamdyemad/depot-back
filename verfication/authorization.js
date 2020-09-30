const jwt = require("jsonwebtoken");

exports.verifyedUser = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (authorization) {
    try {
      let payload = jwt.verify(authorization, process.env.userSecretKey);
      if (payload) {
        req.userId = payload.userId;
      }
    } catch (err) {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
  next();
};
exports.verifyedAdmin = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (authorization) {
    try {
      let payload = jwt.verify(authorization, process.env.adminSecretKey);
      if (payload) {
        req.userId = payload.userId;
        req.role = payload.role;
      }
    } catch (err) {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401)
  }
  next();
};