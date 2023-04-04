const bcrypt = require("bcrypt");

const { getUserByEmail } = require("../conrollers/users");
const issueToken = require("./issueToken");

const loginHandler = async (email, incomingPassword) => {
  // pobrać uzytkownika
  const user = await getUserByEmail(email);

  // jezeli nie ma uzytkownika to zwroc informacje
  if (!user) {
    throw { code: 404, msg: "User not found!!!" };
  }

  // wziac haslo naszego uzytkownika
  const userPassword = user.password;

  // porownac hasla (przychodzace i uzytkownika)
  const result = bcrypt.compareSync(incomingPassword, userPassword);

  // zwracamy token
  if (result) {
    return issueToken(user);
  } else {
    throw { code: 401, msg: "Invalid credentials" };
  }
};

module.exports = loginHandler;
