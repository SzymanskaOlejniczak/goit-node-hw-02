const bcrypt = require("bcrypt");

const { getUserByEmail } = require("../conrollers/users");
const issueToken = require("./issueToken");

const loginHandler = async (email, password) => {
 // get the user
  const user = await getUserByEmail(email);

  // if there is no user, return information
  if (!user) {
    throw { code: 404, msg: "User not found!!!" };
  }
  if (!user.verify) {
		throw new Error('Email not verified !');
	}
// compare passwords (incoming and user's)
  const result = bcrypt.compareSync(password, user.password);

// we return the token
  if (result) {
    return issueToken(user);
  } else {
    throw { code: 401, msg: "Invalid credentials" };
  }
};

module.exports = loginHandler;
