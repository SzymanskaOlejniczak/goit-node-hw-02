const express = require("express");
const router = express.Router();
// library to handle incoming files
const multer = require("multer");
// module for handling file paths
const path = require("path");
// file handling module
const fs = require("fs/promises");
const Jimp = require("jimp");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const {
  getAllUsers,
  createUser,
  updateAvatar,
  verifyUser,
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
   
    const transporter = nodemailer.createTransport({
      host: "smtp.interia.pl",
      port: 465,
      secure: false,
      auth: {
        user: "aszymanskaolejniczak",
        pass: "Edward1234!@",
      },
      
  });
    const emailOptions = {
      from: "aszymanskaolejniczak@interia.pl",
      to: "aszymanska-olejniczak@wp.pl  ",
      subject: "Verification",
      html: `<h1>Please verify your email adress by clicking verification link below<h1>
    <div><a href='http://localhost:3000/api/users/verify/${newUser.verifyToken}'></a></div>`,
    };
  
    await transporter.sendMail(emailOptions);
    
		res.status(201).json(newUser);
    console.log(newUser);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//LOGIN//
router.post("/login", async (req, res, next) => {
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
    next(error);
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

router.post("/verify", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Missing required field email" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.interia.pl",
      port: 465,
      secure: false,
      auth: {
        user: "aszymanskaolejniczak",
        pass: "Edward1234!@",
      },
      tls:{rejectUnauthorized:false},
  });
    const emailOptions = {
      from: "aszymanskaolejniczak@interia.pl",
      to: "aszymanska-olejniczak@wp.pl  ",
      subject: "Verification",
      html: `<h1>Please verify your email adress by clicking verification link below<h1>
    <div><a href='http://localhost:3000/api/users/verify/${newUser.verifyToken}'>verification link</a></div>`,
    };
  
    await transporter.sendMail(emailOptions);
   res.status(200).json({ message: "Verification email sent" });
   } catch (error) {
     next(error);
     return res.status(500).json({ message: "Server error" });
   }
 });

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await verifyUser(verificationToken);

    if (user) {
      return res.status(200).json({ message: "Verification successful" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
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
