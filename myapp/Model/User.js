const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  empid: {
    type: Number,
    minLength: 10,
    required: true,
  },
  admin: {
    type: Number,
    default: () => 0,
  },
  isblocked: {
    type: Number,
    default: () => 0,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  editedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
module.exports = mongoose.model("User", userSchema);
