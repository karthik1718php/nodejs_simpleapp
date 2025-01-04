const mongoose = require('mongoose');


const Product = new mongoose.Schema({
    productName:{type:String, required: true },
    productCode: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: String, required: true },
    desc: { type: String, required: true },
    expriryDate: { type:Date, default:Date.now() },
    productCategory: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Sports', 'Groceries','Others'],
        default: 'Others'
    },

    //optional field
    int32Field: {
        type: Number, // Mongoose stores it as Int32 (within the range of -2^31 to 2^31-1)
    },
    int64Field: {
        type: mongoose.Schema.Types.Mixed, // Mongoose doesn't have native Int64, but we can use Mixed for Long
    },
    doubleField: {
        type: Number, // This will be stored as Double
    },
    decimal128Field: {
        type: mongoose.Schema.Types.Decimal128, // Decimal128 for high precision
    },

});

module.exports = mongoose.model('products', Product);