const express = require('express');
const router = express.Router();

// File upload middleware
const profileUpload = require('../middlewares/UserProfileMiddleware')
const authMiddleware = require('../middlewares/AuthMiddleware')

//Auth Controller
const { registerUser,loginUser } = require('../controllers/AuthController');
router.post('/register',profileUpload.fields([
  { name: 'profile', maxCount: 1 }, // Field for profile picture
  { name: 'profilePics', maxCount: 3 }     // Field for resume
]),registerUser);
router.post('/login',loginUser);
router.get('/test-authenticate',authMiddleware, async(req,res)=>{
  return res.json({message:'you are authenticated',data:req.userData})
});

module.exports = router;
