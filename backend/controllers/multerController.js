const asyncHandler = require("express-async-handler");

const uploadFile = asyncHandler(async (req, res) => {
  console.log(req.file);

  res.send({ msg: "single File Upload Success" });
});

module.exports = uploadFile;
