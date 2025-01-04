const mongoose = require('mongoose');

const Product = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'quantity is required'],
        min: [0, 'quantity must be a positive number'], // Custom validation message for minimum value
        validate: {
          validator: function (value) {
            return value > 0; // Custom logic to check if price is greater than 0
          },
          message: 'quantity must be greater than 0' // Custom error message
        }
      },
    orderDate: { type:Date, default:Date.now() },

});

module.exports = mongoose.model('orders', Product);