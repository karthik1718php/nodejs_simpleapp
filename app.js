//npm packages
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();  // To use environment variables
const Department = require('./models/Department');
const Employee = require('./models/Employee');

const Order2 = require('./models/Order2');
const Product2 = require('./models/Product2');

//module for set session data
const session = require('express-session');

//Session middleware
app.use(
  session({
      secret: process.env.JWT_SECRET, // Replace with a strong secret
      resave: false,
      saveUninitialized: true,
  })
);

app.use(express.json()); // To parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// user routes
app.use('/api', require('./routes/auth'));
app.use('/api/product', require('./routes/product'));
app.use('/api/test', require('./routes/test'));


//AVERAGE

// Route to find departments with average salary above $75,000
app.get('/departments/average-salary', async (req, res) => {
    try {
      // Aggregate departments with average salary above 75000
      const departments = await Employee.aggregate([
        {
          $group: {
            _id: '$departmentId',
            averageSalary: { $avg: '$salary' },
          },
        },
        {
          $match: {
            averageSalary: { $gt: 75000 },
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'department',
          },
        },
        {
          $unwind: '$department',
        },
        {
          $project: {
            departmentName: '$department.name',
            averageSalary: 1,
          },
        },
      ]);
  
      res.json(departments);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  // AVERAGE SEED

  // Sample data insertion (run once for testing)
  app.post('/aseed', async (req, res) => {
    try {
      // Sample data for departments
      const dept1 = await Department.create({ name: 'Engineering', location: 'New York' });
      const dept2 = await Department.create({ name: 'Sales', location: 'San Francisco' });
  
      // Sample data for employees
      await Employee.create({ name: 'Alice', departmentId: dept1._id, salary: 80000 });
      await Employee.create({ name: 'Bob', departmentId: dept1._id, salary: 95000 });
      await Employee.create({ name: 'Charlie', departmentId: dept2._id, salary: 60000 });
      await Employee.create({ name: 'David', departmentId: dept2._id, salary: 100000 });
  
      res.send('Sample data inserted');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  //---------------------------------------------------------------------------------------------------------------
// TOTAL
  app.get('/products/total-sales', async (req, res) => {
    try {
      // Aggregate orders with total sales above $5,000
      const products = await Order2.aggregate([
        {
          $group: {
            _id: '$productId',
            totalRevenue: { $sum: '$totalPrice' },
          },
        },
        {
          $match: {
            totalRevenue: { $gt: 5000 },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $project: {
            productName: '$product.name',
            totalRevenue: 1,
          },
        },
      ]);
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
  // Sample data insertion (run once for testing)
  app.post('/tseed', async (req, res) => {
    try {
      // Sample data for products
      const prod1 = await Product2.create({ name: 'Laptop', price: 1000 });
      const prod2 = await Product2.create({ name: 'Phone', price: 600 });
      const prod3 = await Product2.create({ name: 'Headphones', price: 150 });
  
      // Sample data for orders
      await Order2.create({ productId: prod1._id, quantity: 6, totalPrice: 6000 });
      await Order2.create({ productId: prod2._id, quantity: 4, totalPrice: 2400 });
      await Order2.create({ productId: prod3._id, quantity: 30, totalPrice: 4500 });
      await Order2.create({ productId: prod1._id, quantity: 5, totalPrice: 5000 });
  
      res.send('Sample data inserted');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
//---------------------------------------------------------------------------------------------------------------

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



