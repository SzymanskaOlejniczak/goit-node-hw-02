const { User, hashPassword } = require("../models/users");

const createUser = async (body) => {
  const { email, password } = body;
  // hash the password
  const hashedPassword = hashPassword(password);
// create a user with a hashed password
  const newUser = await User.create({ email, password: hashedPassword });
  return newUser;
};
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (_id) => {
  const user = await User.findOne({ _id });
  return user;
};

const deleteUser = async (_id) => {
  try {
    return User.findByIdAndDelete({ _id });
  } catch (err) {
    console.log(err);
  }
};

// we update the subscription user

const updateSubscription = async (email, body) => {
  const { subscription } = body;
  const user = await User.findOneAndUpdate(
    { email },
    { subscription },
    { new: true }
  );
  return user;
};
//logout user
const logout = async (token) => {
  const user = await User.findOneAndUpdate(
    { token },
    { token: null },
    { new: true }
  );
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getUserByEmail,
  updateSubscription,
  logout,
};
