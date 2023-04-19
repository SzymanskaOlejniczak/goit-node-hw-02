const fs = require("fs/promises");
// check if our folder exists
const isExist = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};
//if it doesn't exist, we create it
const createFolderIfNotExist = async (path) => {
  if (!(await isExist(path))) {
    await fs.mkdir(path);
  }
};

module.exports = createFolderIfNotExist;