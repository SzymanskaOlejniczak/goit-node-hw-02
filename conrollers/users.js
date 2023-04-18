const { User, hashPassword } = require("../models/users");
const gravatar = require("gravatar");

const createUser = async (body) => {
  const { email, password } = body;
  // haszujemy hasło
  const hashedPassword = hashPassword(password);
  const avatarURL = gravatar.url(email, {s: "250", d: "404" });
  // tworzymy usera z zahaszowanym hasłem
  const newUser = await User.create({ email, password: hashedPassword, avatarURL });
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

// updatujemy subscription usera

const updateSubscription = async (email, body) => {
  const { subscription } = body;
  const user = await User.findOneAndUpdate(
    { email },
    { subscription },
    { new: true }
  );
  return user;
};

const updateAvatar = async (email, avatarURL) => {
  const user = await User.findOneAndUpdate({ email }, { avatarURL }, { new: true });
 return user;
};
//logout usera
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
  updateAvatar,
  logout,
};