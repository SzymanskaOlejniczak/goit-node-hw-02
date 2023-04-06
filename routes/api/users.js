const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  getUserByEmail,
  updateSubscription,
  logout,
} = require("../../conrollers/users");
const loginHandler = require("../../auth/loginHandler");
const {
  validateUpdateUser,
  validateCreateUser,
} = require("../../models/users");
const auth = require("../../auth/auth");

//***/ REGISTER/***/ Create user
router.post("/signup", async (req, res, next) => {
  try {
    const { error } = validateCreateUser(req.body);
    if (error) {
      // if we have a validation error, we notify the user
      return res.status(400).json({ message: error.message });
    }
    // we can destructure because our body is validated
    const { email } = req.body;
    // create user
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }
    // return the newly created user
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
    console.log(newUser);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//LOGIN//
router.post("/login", async (req, res) => {
  // we validate the correctness of the data
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("email and password are required");
  }
  // check if password and login are correct
  try {
    // we log the user
    const token = await loginHandler(email, password);

    // if the login is correct, issue a token
    return res.status(200).send(token);
  } catch (error) {
    return res.status(error.code).send(error);
  }
});

// LOGOUT//
router.get("/logout", auth, async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await logout(token);
    res.status(204).json(user);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// download user by current email
router.get("/current", auth, async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await getUserByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// change subscription
router.patch("/", auth, async (req, res, next) => {
  try {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { email } = req.user;
    const user = await updateSubscription(email, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// download all - SECURE AUTHENTICATION
router.get("/", auth, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // id validation !!!
    if (id.length !== 24) {
      return res.status(400).send("Wrong id provided");
    }
    // after validation return
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Id is required to perform delete");
  }
  try {
    await deleteUser(id);
    return res.status(204).send();
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;
