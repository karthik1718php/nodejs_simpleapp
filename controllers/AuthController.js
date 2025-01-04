const User = require('../models/User');  // Assuming you're using Mongoose or any ORM
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const rolesPermissions = {
  admin: ['user-create', 'user-read', 'user-update', 'user-delete','product-create'],
  user: ['user-read', 'user-update', 'user-delete'],
  tester: ['user-read']
};

//Register
exports.registerUser = async (req, res) => {

  const { email, name,role,password,createdAt } = req.body;

  // Validate input
 
 
  // Check user exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'This Email is already exist' });
  }
  

    try {
      
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //single file upload
  const profileUrl = req.files.profile[0].fieldname === 'profile' ? req.files.profile[0].path : null;

  //multi file upload with diff fields
  // const squareImage = req.files.squareimage[0].fieldname === 'squareimage' ? req.files.squareimage[0].path : null;
  // const roundedImage =  req.files.roundimage[0].fieldname === 'roundimage' ? req.files.roundimage[0].path : null;
 
  // console.log("req.files",req.files)

  const profilePics = req.files['profilePics'] || [];

  const profilePicPaths = profilePics.map(file => file.path);

  const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      permissions: rolesPermissions[role],
      createdAt,
      profile:profileUrl,
      profilePics:profilePicPaths

  });
  

  await newUser.save();

  // Generate JWT
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  
  req.session.user = newUser;
  // req.session.username = user.name
    res.status(201).json({ message: 'User created successfully', user: newUser });
    
    } catch (err) {
     
      if (err.name === 'ValidationError') {
        // Return validation error details
        return res.status(400).json({
          message: 'Validation failed',
          errors: Object.keys(err.errors).reduce((acc, key) => {
            acc[key] = err.errors[key].message;
            return acc;
          }, {})
        });
      }

      res.status(500).json({ message: 'Internal Server Error', failed: err });
    }


};

//Login
exports.loginUser = async (req, res) => {

  const { email, password } = req.body;
 
   // Validate input
   if (!email || !password) {
     return res.status(400).json({ message: 'Please enter all fields' });
   }
 
   // Check for user
   const user = await User.findOne({ email });
   if (!user) {
     return res.status(400).json({ message: 'User email does not exist' });
   }
 
   // Validate password
   const isMatch = await bcrypt.compare(password, user.password);
 
   if (!isMatch) {
     return res.status(400).json({ message: 'Invalid credentials' });
   }
 
   // Generate JWT
   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
     expiresIn: '1h',
   });
  
 req.session.user = user;
 // req.session.username = user.name
 
   res.json({
     token,
     user: req.session.user,
   });
};