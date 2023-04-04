const Joi = require("joi");
const JoiPhoneValidate = Joi.extend(require("joi-phone-number"));
const mongoose = require("mongoose");
const Models = mongoose.Schema;

const contactSchema = new Models({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
const Contact = mongoose.model("Contact", contactSchema);

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: JoiPhoneValidate.string()
    .phoneNumber({ format: "international" })
    .required(),
  favorite: Joi.boolean(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: JoiPhoneValidate.string()
    .phoneNumber({
      defaultCountry: "PL",
      format: "international",
    })
    .required(),
  favorite: Joi.boolean().required(),
});
const schemaStatusUpdateContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const idSchema = Joi.object({
  contactId: Joi.string().alphanum().length(24),
});

const validateCreateContact = validator(schemaCreateContact);
const validateUpdateContact = validator(schemaUpdateContact);
const validateStatusUpdateContact = validator(schemaStatusUpdateContact);
const validateIdContact = validator(idSchema);

module.exports = {
  Contact,
  validateCreateContact,
  validateUpdateContact,
  validateStatusUpdateContact,
  validateIdContact,
};
