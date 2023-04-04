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
  // generujemy salta (salt to "wkladka" dla algorytmu haszujacego)
  const salt = bcrypt.genSaltSync(10);
  // haszujemy przychodzace haslo
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

// zainicjowalismy model obiektu
const User = mongoose.model("User", users);
const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const userValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  //subscription: Joi.string().valid("starter", "pro", "business"),
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
