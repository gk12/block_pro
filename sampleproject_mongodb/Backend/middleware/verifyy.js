const jwt = require("jsonwebtoken");

const jon = (req, res, next) => {
  bearer_header = req.headers["authorization"];
  if (typeof bearer_header !== "undefined") {
    // i have bearer in header so we have 2 things in an array and we want 2nd thing that is token.
    // so in token we adding index 1st element of an array
    const bearer = bearer_header.split(" ");
    const token = bearer[1];
  
    // yaha se token ko bhej denge ab
    req.token = token;
    next();
  } else {
    res
      .json({
        message: "not a authorised admin",
      })
      .status(404);
  }
};

module.exports = jon;
