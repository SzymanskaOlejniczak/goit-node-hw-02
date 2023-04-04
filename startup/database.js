const mongoose = require("mongoose");

const dbpath = process.env.MONGO_SECRET;

if (!dbpath) {
  console.log("Database path is not defined");
}

const connectDatabase = async () => {
  try {
    await mongoose.connect(dbpath);
    console.log("Connected to mongo db...");
  } catch (error) {
    console.log("error to connect db");
    process.exit(1);
  }
};

module.exports = { connectDatabase };
