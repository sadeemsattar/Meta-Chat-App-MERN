const jwt = require("jsonwebtoken");

const createToken = (userID) => {
  return jwt.sign({ userID }, process.env.SECRET, { expiresIn: "1d" });
};

module.exports = createToken;
