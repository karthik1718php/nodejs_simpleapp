const express = require('express');
const router = express.Router();


const { addtestUser,updateOneOrUpdateMany,aggregateSalaryByCity } = require('../controllers/TestController');

router.post('/addusers',addtestUser);
router.get('/aggregate-salary-by-city',aggregateSalaryByCity);

module.exports = router;
