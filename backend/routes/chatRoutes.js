const express = require("express");
const router = express.Router();
const {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const validateToken = require("../JWTauth/jwtValidation");

router.route("/").post(validateToken, accessChat);
router.route("/chat").get(validateToken, fetchChat);
router.route("/group").post(validateToken, createGroup);
router.route("/rename").put(validateToken, renameGroup);
router.route("/groupadd").put(validateToken, addToGroup);
router.route("/groupremove").put(validateToken, removeFromGroup);

module.exports = router;
