const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken) {
    return res
      .status(400)
      .json({ status: "failed", message: "User Not Authenticated" });
  }

  try {
    const validToken = jwt.verify(accessToken, process.env.SECRET);

    if (validToken) {
      req.userID = validToken.userID;
      return next();
    }
  } catch (err) {
    res
      .status(400)
      .json({ status: "failed", err, message: "User Not Authenticated" });
  }
};
module.exports = validateToken;
