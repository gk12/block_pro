const mongoose = require("mongoose");

const Role = new mongoose.Schema({
  role: {
    type: String,
    default: "user",
    // required: true,
  },
});

const role= mongoose.model("role", Role);

module.exports=role;