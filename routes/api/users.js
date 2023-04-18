const express = require("express");
const router = express.Router();
// library to handle incoming files
const multer = require("multer");
// module for handling file paths
const path = require("path");
// file handling module
const fs = require("fs/promises");

const Jimp = require("jimp");
const dotenv = require("dotenv");
dotenv.config();
const {
  getAllUsers,
  createUser,
  updateAvatar,
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

// we need to specify where the files are stored - FOLDER
const uploadDirAvatar = path.join(process.cwd(), "tmp");
// we need to initialize storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirAvatar);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});
// handle the image with multer
const upload = multer({ storage });

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
router.post("/login", async (req, res, next) => {
  // walidujemy poprawnosc danych
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("email and password are required");
  }
  // sprawdzic czy hasło i login są poprawne
  try {
    // logujemy uzytkownika
    const token = await loginHandler(email, password);

    // jesli logowanie poprawne to wydaj token
    return res.status(200).send(token);
  } catch (error) {
    next(error);
    return res.status(401).json({ message: "Invalid login data" });
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

// pobieranie usera po aktualnym email
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

//zmiana subscription
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

router.patch("/avatars", auth, upload.single("avatar"),
  async (req, res, next) => {
    try {
      const { email } = req.user;
      // extract data about the incoming file
      const { path: temporaryName, originalname } = req.file;
      // create the absolute path to the target FILE
      const fileName = path.join(uploadDirAvatar, originalname);
      // replace the temporary name with the real one
      await fs.rename(temporaryName, fileName);
      console.log(fileName);
      const img = await Jimp.read(fileName);
      await img.autocrop().cover(250, 250).quality(60).writeAsync(fileName);

      await fs.rename(
        fileName,
        path.join(process.cwd(), "public/avatars", originalname)
      );

      const avatarURL = path.join(
        process.cwd(),
        "public/avatars",
        originalname
      );
      const cleanAvatarURL = avatarURL.replace(/\\/g, "/");

      const user = await updateAvatar(email, cleanAvatarURL);
      res.status(200).json(user);
    } catch (error) {
      next(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// pobieramy wszystkich - ZABEZPIECZONE AUTENTYKACJA
router.get("/", auth, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

// pobieramy usera by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // walidacja poprawnosci id !!!
    if (id.length !== 24) {
      return res.status(400).send("Wrong id provided");
    }
    // po walidacji wywowałac
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

// usuwanie usera
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
