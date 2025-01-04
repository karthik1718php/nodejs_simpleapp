const Testuser = require('../models/Testuser');

exports.addtestUser =  async(req,res)=>{
  try {
    const users = await Testuser.insertMany([
      { name: "Alice", age: 25, city: "New York", salary: 50000 },
      { name: "Bob", age: 30, city: "Los Angeles", salary: 60000 },
      { name: "Charlie", age: 35, city: "Chicago", salary: 55000 },
      { name: "David", age: 40, city: "New York", salary: 70000 },
    ]);
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateOneOrUpdateMany =  async(req,res)=>{

  try {
    const result = await Testuser.updateOne({ _id: '67763835af30fd96fc05e289' }, // Filter: Find the order by _id
        { $set: { city: 'Chicago1' } },  // Update: Set the 'city' field to 'cbe2'
        { upsert: true } ); //Option: Return the updated document

    res.status(200).json({
      message: 'Testuser updated successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating Testuser',
      error: error.message,
    });
  }


  try {
    const result = await Testuser.updateMany(
      { city: 'Chicago' },
      { $set: { age: 95} }
    );

    res.status(200).json({
      message: 'Testuser updated successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating Testuser',
      error: error.message,
    });
  }
}



exports.aggregateSalaryByCity =  async(req,res)=>{

  try {
    const result = await Testuser.aggregate([
      { $match: { age: { $gt: 30 } } }, // Match users older than 30
      {
        $project: {
          _id: 0, // Exclude _id
          name: 1,
          city: 1,
          age: 1,
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}


