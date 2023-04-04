
const { User, hashPassword } = require("../models/users");

const createUser = async (email, password) => {
  // haszujemy hasło
  const hashedPassword = hashPassword(password);

  try {
    // tworzymy usera z zahaszowanym hasłem
    const newUser = new User.create({ email, password: hashedPassword });

    newUser.save();
    return newUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
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

// updatujemy usera
const updateUser = async (id, newUser) => {
  const updatedUser = await User.findByIdAndUpdate(id, newUser);
  return updatedUser;
};
const updateSubscription = async (email, subscription) => {

  const user = await User.findOneAndUpdate({ email }, { subscription }, { new: true });
  return user;
};
const logout = async (token) => {
  const user = await User.findOneAndUpdate({ token }, { token: null }, { new: true });
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  getUserByEmail,
  updateSubscription,
  logout,
};
