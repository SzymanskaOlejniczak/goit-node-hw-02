const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../conrollers/users");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
  // pobieramy token z nagłówka
  const token = req.headers.authorization;

  // jeśli nie ma tokenu to nie puszamy dalej - mowimy ze brak tokenu
  if (!token) {
    return res.status(401).send("No token provided");
  }

  // jesli token jest to go weryfikujemy
  try {
    jwt.verify(token, jwtSecretKey);
    req.user = jwt.decode(token);
    // jesli wszystko poszło okay to wywołujemy next function
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
    // jesli cos nie tak to odmawiamy dostepu
    return res.status(401).send("Access denied");
  }
};

module.exports = auth;
