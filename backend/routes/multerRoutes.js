const express = require("express");
const uploadFile = require("../controllers/multerController");
const router = express.Router();
const validateToken = require("../JWTauth/jwtValidation");

const upload = require("../middleware/multerHandler");

router
  .route("/uploadFile")
  .post(validateToken, upload.single("file"), uploadFile);

module.exports = router;
