const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createProduct = async(req,res)=>{
  const permissions = req.userData.permissions;
  const productOperation = 'product-create';

  try{

    if(permissions.includes(productOperation)) {
    
      const { productName, productCode,price, stock, expiryDate, desc,productCategory} = req.body;
      const Product = new Product({productName, productCode,price, stock, expiryDate, desc,productCategory});
      const savedProduct = await Product.save();
      
      return res.status(201).json({ message: 'successfully created product', product:savedProduct });
  
    }else{
      return res.status(401).json({ message: 'sorry, you dont have access' });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

exports.productList =  async(req,res)=>{
  const productList = await Product.find()
  try{
    if(productList){
      res.json({ products : productList })
    }
  }catch(error){
    console.error('Error:', error);
  }
}

exports.productOrder =  async(req,res)=>{
  const { productId,quantity,customerId,orderDate,verificationDetails,isVerified} = req.body;
  const OrderData = new Order({productId,quantity,customerId,orderDate,verificationDetails,isVerified})
    
  try{
    const savedOrder = await OrderData.save();
    return res.json({data:savedOrder})

  }catch(error){
    console.error('Error:', error);
  }

}

//below functionality for learning purpose and not properly implemented 
exports.orderList =  async(req,res)=>{
  
  const loggedUserId = req.user.id

  const userOrders = await Order.aggregate([

    //where 
    // {
    //   $match: {
    //     customerId: loggedUserId
    //   },
    // },

    //join orders with users documents(tables)
    {
      $lookup: {
        from: "users",
        localField: "customerId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails", // Flatten the userDetails array
    },

    //join orders with products documents(tables)

    {
      $lookup: {
        from: 'products',  // Join with the products collection
        localField: 'productId',  // field in orders collection
        foreignField: '_id',  // field in products collection
        as: 'productDetails',  // output array field
      },
    },
    {
      $unwind: '$productDetails',  // Flatten the productDetails array
    },

    
    // Add a new field for the total price for each order (quantity * product price)
    {
      $addFields: {
        totalProductPrice: { $multiply: ['$productDetails.price', '$quantity'] },
      },
    },
    // Group by userId and calculate the total price for all orders
    {
      $group: {
        _id: '$customerId',  // Group by customerId
        totalSpent: { $sum: '$totalProductPrice' },  // Sum of the total prices for each user's orders
        //totalSpent: { $sum: '$salary' },  // Sum of the total prices for each user's orders
        orderCount: { $count: {} },  // Count the number of orders per user
      },
    },

    //selected fields from combined 3 documents(orders,users,products)
    {
      $project: {
        _id: 0,
        totalSpent: 1,  // Total spent (sum of product prices)
        orderCount: 1,  // Total number of orders
      },
    },
  ]);

  return res.json({data:userOrders})

}