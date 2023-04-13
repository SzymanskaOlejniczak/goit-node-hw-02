const bcrypt = require("bcrypt");

const { getUserByEmail } = require("../conrollers/users");
const issueToken = require("./issueToken");

const loginHandler = async (email, incomingPassword) => {
 // get the user
  const user = await getUserByEmail(email);

  // if there is no user, return information
  if (!user) {
    throw { code: 404, msg: "User not found!!!" };
  }

 // get our user's password
  const userPassword = user.password;

// compare passwords (incoming and user's)
  const result = bcrypt.compareSync(incomingPassword, userPassword);

// we return the token
  if (result) {
    return issueToken(user);
  } else {
    throw { code: 401, msg: "Invalid credentials" };
  }
};

module.exports = loginHandler;
