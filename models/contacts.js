const fs = require("fs/promises");

const listContacts = async () => {
  const data = await fs.readFile("./models/contacts.json", "utf-8");
  const parsedData = JSON.parse(data);

  return parsedData;
};

const getContactById = async (contactId) => {
  const list = await listContacts();
  const foundContact = list.find((item) => item.id == contactId);

  return foundContact;
};

const removeContact = async (contactId) => {
  const list = await listContacts();
  const tableIndex = list.findIndex((item) => item.id === contactId);
  if (tableIndex === -1) {
    return null;
  }
  const [contact] = list.splice(tableIndex, 1);
  await fs.writeFile("./contacts.json", JSON.stringify(list));

  return contact;
};

const addContact = async (body) => {
  const list = await listContacts();
  const newList = { id: list.length + 1, ...body };
  list.push(newList);
  await fs.writeFile("./contacts.json", JSON.stringify(list));

  return newList;
};

const updateContact = async (contactId, body) => {
  const list = await listContacts();
  const tableIndex = list.findIndex((item) => item.id === contactId);
  if (tableIndex === -1) {
    return null;
  }
  list[tableIndex] = { ...list[tableIndex], ...body };
  await fs.writeFile("./contacts.json", JSON.stringify(list));

  return list[tableIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
