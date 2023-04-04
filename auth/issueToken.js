const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const issueToken = (user) => {
  // ustalamy nasz payload (informacje ktore dodatkowo checmy zawrzec w tokenie)
  const payload = {
    id: user._id,
    email: user.email,
  };

  // tworzymy nasz token (podpisujemy)
  const token = jwt.sign(payload, jwtSecret);

  // zwracamy token
  return token;
};

module.exports = issueToken;
