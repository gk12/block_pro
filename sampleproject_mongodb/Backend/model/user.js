const mongoose = require("mongoose");
// const role = require("./roles");

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    default:'user',
    required: true,
  },
 
});

const user = mongoose.model("user", User);
module.exports = user;
