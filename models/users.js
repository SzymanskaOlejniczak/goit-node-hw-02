const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


// wyciągneliśmy schema z bilbioteki
const Schema = mongoose.Schema;

// zdefiniowalismy schema
const users = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
},
  {
    versionKey: false,
    timestamps: true,
  }
);

const hashPassword = (password) => {
  // generujemy salta (salt to "wkladka" dla algorytmu haszujacego)
  const salt = bcrypt.genSaltSync(10);
  // haszujemy przychodzace haslo
  return bcrypt.hashSync(password, salt);
};

// zainicjowalismy model obiektu
const User = mongoose.model("User", users);
const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});
const userUpdatedValidationSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
const validateCreateUser = validator(userValidationSchema);
const validateUpdateUser = validator(userUpdatedValidationSchema);

module.exports = { 
  User,
  validateCreateUser,
  validateUpdateUser,
  hashPassword,
 };
