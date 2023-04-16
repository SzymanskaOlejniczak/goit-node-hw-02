const app = require("./app");
// helper to handle folders
const createFolderIfNotExist=require("./helpers/helpers");

app.listen(3000, () => {
  createFolderIfNotExist("./tmp");
  createFolderIfNotExist("./public");
  createFolderIfNotExist("./public/avatars");

  console.log("Server running. Use our API on port: 3000");
})
