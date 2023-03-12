const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const {
  validateCreateContact,
  validateUpdateContact,
} = require("../../validator");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const response = await getContactById(id);
  if (!response) {
    res.status(404).json({ message: "Contact with ${id} was not found." });
  }
  res.json(response);
});

router.post("/", async (req, res, next) => {
  const { error, value } = validateCreateContact(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const newList = await addContact(req.body);
  res.status(201).json(newList);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (!contact) {
    return res
      .status(404)
      .json({ message: `Contact with id=${contactId} was not found.` });
  }
  res
    .status(200)
    .json({ message: `Contact with id=${contactId} was deleted.` });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  const { error, value } = validateUpdateContact(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contact = await updateContact(contactId, req.body);
  if (!contact) {
    return res
      .status(404)
      .json({ message: `Contact with id=${contactId} was not found.` });
  }
  res.status(200).json(contact);
});

module.exports = router;
