const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactStatus,
} = require("../../conrollers/contacts");
const {
  validateCreateContact,
  validateUpdateContact,
  validateStatusUpdateContact,
  validateIdContact,
} = require("../../models/contacts");
const auth = require("../../auth/auth");
const idValidation = async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = validateIdContact({ contactId });
  if (error) {
    return res.status(400).json({ message: "Invalid id" });
  }
  const contact = await getContactById(contactId);
  if (!contact) {
    return res
      .status(404)
      .json({ message: `Contact with id=${contactId} was not found.` });
  }
  next();
};

router.get("/", auth, async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:contactId", auth, idValidation, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { error } = validateCreateContact(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const newList = await addContact(req.body);

    res.status(200).json(newList);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:contactId", auth, idValidation, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await removeContact(contactId);
    res
      .status(200)
      .json({ message: `Contact with id=${contactId} was deleted.` });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:contactId", auth, idValidation, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = validateUpdateContact(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await updateContact(contactId, req.body);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:contactId/favorite", auth, idValidation, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = validateStatusUpdateContact(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const contact = await updateContactStatus(contactId, req.body.favorite);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
