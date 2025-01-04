const express = require('express');
const router = express.Router();

//Middleware
const rolePermissionMiddleware = require('../middlewares/RolePermissionMiddleware')

//Controllers
const {createProduct,productList,productOrder,orderList} = require('../controllers/ProductController')

//Routes
router.post('/create',rolePermissionMiddleware('admin'),createProduct)
router.get('/list',rolePermissionMiddleware('admin'),productList)
router.post('/order',rolePermissionMiddleware('admin'),productOrder)
router.get('/orderlist',rolePermissionMiddleware('admin'),orderList)

module.exports = router;
