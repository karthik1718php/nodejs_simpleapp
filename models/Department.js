const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
});

const Department = mongoose.model('Department2', DepartmentSchema);
module.exports = Department;
