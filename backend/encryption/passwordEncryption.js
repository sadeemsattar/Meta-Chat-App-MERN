const bcrypt = require("bcryptjs");
async function bcryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  return newPassword;
}

module.exports = bcryptPassword;
