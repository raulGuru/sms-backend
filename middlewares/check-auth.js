const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, function (err, decodedToken) {
      if (err) {
        console.log(err);
      } else {
        req.userData = {
          email: decodedToken.email,
          userId: decodedToken.userId,
        };
      }
    });
    next();
  } catch (error) {
    res.status(401).json({ message: "user not authenticated!" });
  }
};
