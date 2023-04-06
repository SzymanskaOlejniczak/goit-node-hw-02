const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const issueToken = (user) => {
  // set our payload (information that we also want to include in the token)
  const payload = {
    id: user._id,
    email: user.email,
  };

  // create our token (sign)
  const token = jwt.sign(payload, jwtSecretKey);

 // we return the token
  return token;
};

module.exports = issueToken;
