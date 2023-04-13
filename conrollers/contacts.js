const { Contact } = require("../models/contacts");

const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async (_id) => {
  return await Contact.findOne({ _id });
};

const removeContact = async (_id) => {
  await Contact.findOneAndDelete({ _id });
};

const addContact = async (body) => {
  const list = new Contact(body);
  await list.save();
  return list;
};

const updateContact = async (_id, body) => {
  await Contact.findByIdAndUpdate(_id, body);
  return await getContactById(_id);
};

const updateContactStatus = async (_id, body) => {
  await Contact.findByIdAndUpdate(_id, body);
  return await getContactById(_id);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus,
};
