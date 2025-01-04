const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  salary: { type: Number, required: true },
});

const Employee = mongoose.model('Employee2', EmployeeSchema);
module.exports = Employee;
