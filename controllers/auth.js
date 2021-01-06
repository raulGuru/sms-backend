const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user");

exports.register = [
  // Validate fields
  body("name")
    .isLength({ min: 5 })
    .trim()
    .withMessage("Name atleast 5 chars required"),
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Valid Email address required")
    .custom((value) => {
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      });
    }),
  body("password")
    .isLength({ min: 7 })
    .trim()
    .withMessage("Password atleast 7 chars required"),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({
          status: 0,
          message: "Validation Error",
          data: errors.array(),
        });
      } else {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          const user = new UserModel({
            email: req.body.email,
            name: req.body.name,
            password: hash,
          });
          user.save(function (err) {
            if (err) {
              return {
                status: 0,
                message: "User Error",
                data: err,
              };
            }
            return res.status(200).json({
              status: 1,
              message: "Registration Success",
              data: user.email,
            });
          });
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
];

exports.login = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("password")
    .isLength({ min: 7 })
    .trim()
    .withMessage("Password must be atleast 7 chars"),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({
          status: 0,
          message: "Validation Error",
          data: errors.array(),
        });
      } else {
        UserModel.findOne({ email: req.body.email }).then((user) => {
          if (user) {
            bcrypt.compare(
              req.body.password,
              user.password,
              function (err, same) {
                if (same) {
                  if (user.status) {
                    let userData = {
                      userId: user._id,
                      email: user.email,
                      name: user.name,
                    };
                    userData.token = jwt.sign(userData, process.env.JWT_KEY, {
                      expiresIn: "1h",
                    });
                    userData.expiresIn = 3600;
                    return res.status(200).json({
                      status: 1,
                      message: "Login Success",
                      data: userData,
                    });
                  } else {
                    return res.status(200).json({
                      status: 0,
                      message: "Account is not active. Please contact admin",
                    });
                  }
                } else {
                  return res.status(200).json({
                    status: 0,
                    message: "Incorrect Password",
                    data: err,
                  });
                }
              }
            );
          } else {
            return res.status(200).json({
              status: 0,
              message: "Email does not exsits",
            });
          }
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
];

exports.resetpassword = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("password")
    .isLength({ min: 7 })
    .trim()
    .withMessage("Password must be atleast 7 chars"),
  body("token")
    .isLength({ min: 1 })
    .trim()
    .withMessage("User not authenticated"),
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({
          status: 0,
          message: "Validation Error",
          data: errors.array(),
        });
      } else {
        const { email, password, userId, token } = req.body;
        UserModel.findOne({ email: email }).then((user) => {
          if (user) {
            if (user._id.toString() === userId.toString()) {
              // bcrypt.hash(password, 10, function (err, hash) {
              //   Object.assign(user, { password: hash });
              //   user.save(function (err) {
              //     if (err) {
              //       return {
              //         status: 0,
              //         message: "User Error",
              //         data: err,
              //       };
              //     }
              //     return res.status(200).json({
              //       status: 1,
              //       message: "Password reset successfully",
              //       data: user.email,
              //     });
              //   });
              // });

              jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
                if (err) {
                  console.log(err);
                  return res.status(200).json({
                    status: 0,
                    message: "Re-Login to perform action",
                  });
                } else {
                  bcrypt.hash(password, 10, function (err, hash) {
                    Object.assign(user, { password: hash });
                    user.save(function (err) {
                      if (err) {
                        return {
                          status: 0,
                          message: "User Error",
                          data: err,
                        };
                      }
                      return res.status(200).json({
                        status: 1,
                        message: "Password reset successfully",
                        data: user.email,
                      });
                    });
                  });
                }
              });
            } else {
              return res.status(200).json({
                status: 0,
                message: "Email Id and Login mis-match",
              });
            }
          } else {
            return res.status(200).json({
              status: 0,
              message: "Email does not exsits",
            });
          }
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
];
