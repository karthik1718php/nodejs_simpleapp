const mongoose = require('mongoose');

const testUserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
  salary: Number,
});

module.exports = mongoose.model("testusers", testUserSchema);