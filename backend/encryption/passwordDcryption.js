const bcrypt = require("bcryptjs");
async function dcryptPassword(enteredPassword, password) {
  return await bcrypt.compare(enteredPassword, password);
}
module.exports = dcryptPassword;
