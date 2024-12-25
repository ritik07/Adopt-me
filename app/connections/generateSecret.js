const jwt = require("jsonwebtoken");
const { EXPIRES_IN } = require("./config");

const token = (phone_no) =>
  jwt.sign({ phone_no: phone_no }, secret, {
    expiresIn: EXPIRES_IN,
    // expiresIn: 3600,
  });

module.exports = { token };
