const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text1: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
