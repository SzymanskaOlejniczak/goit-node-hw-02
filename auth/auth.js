const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../conrollers/users");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
<<<<<<< Updated upstream
  // pobieramy token z nagłówka
  const token = req.headers.authorization;

  // jeśli nie ma tokenu to nie puszamy dalej - mowimy ze brak tokenu
=======
  // get the token from the header
  const token = req.header("Authorization");
  console.log(token);
  // if there is no token, we do not continue - we say that there is no token
>>>>>>> Stashed changes
  if (!token) {
    return res.status(401).send("No token provided");
  }

  // jesli token jest to go weryfikujemy
  try {
<<<<<<< Updated upstream
    jwt.verify(token, jwtSecretKey);
    req.user = jwt.decode(token);
    // jesli wszystko poszło okay to wywołujemy next function
=======
    
    jwt.verify(token, jwtSecretKey);
    req.user = jwt.decode(token);
    // if everything went okay, we call next function
>>>>>>> Stashed changes
    try {
      const user = await getUserByEmail(req.user.email);
      console.log(user)
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }

    next();
  } catch {
    // jesli cos nie tak to odmawiamy dostepu
    return res.status(401).send("Access denied");
  }
};

module.exports = auth;
