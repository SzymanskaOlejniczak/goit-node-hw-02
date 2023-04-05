const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const issueToken = (user) => {
  // ustalamy nasz payload (informacje ktore dodatkowo checmy zawrzec w tokenie)
  const payload = {
    id: user._id,
    email: user.email,
  };

  // tworzymy nasz token (podpisujemy)
  const token = jwt.sign(payload, jwtSecretKey);

  // zwracamy token
  return token;
};

module.exports = issueToken;
