const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../conrollers/users");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
  // get the token from the header
  const token = req.headers.authorization;

  // if there is no token, we do not continue - we say that there is no token
  if (!token) {
    return res.status(401).send("No token provided");
  }
 // if the token exists, we verify it
  try {
    jwt.verify(token, jwtSecretKey);
    req.user = jwt.decode(token);
   // if everything went okay, we call next function
    try {
      const user = await getUserByEmail(req.user.email);
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }

    next();
  } catch {
   // if something is wrong, we deny access
    return res.status(401).send("Access denied");
  }
};

module.exports = auth;
