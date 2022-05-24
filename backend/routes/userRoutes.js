const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const validateToken = require("../JWTauth/jwtValidation");

router.route("/signup").post(registerUser);
router.route("/login").post(authUser);
router.route("/").get(validateToken, allUsers);

module.exports = router;
