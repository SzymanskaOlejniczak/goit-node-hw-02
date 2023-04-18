const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// we pulled the schema from the library
const Schema = mongoose.Schema;

// we defined the schema
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const hashPassword = (password) => {
  // generate salts (salt is an "insert" for the hashing algorithm)
  const salt = bcrypt.genSaltSync(10);
  // haszujemy przychodzace haslo
  return bcrypt.hashSync(password, salt);
};

// we initialized the object model
const User = mongoose.model("User", users);
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

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
