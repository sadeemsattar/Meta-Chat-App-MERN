const express = require("express");
const router = express.Router();
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
const validateToken = require("../JWTauth/jwtValidation");

router.route("/sendMessage").post(validateToken, sendMessage);
router.route("/:chatId").get(validateToken, allMessages);

module.exports = router;
