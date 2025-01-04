const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{type:String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { required: true,type: Date},
    role: {
      type: String,
      enum: ['admin', 'user', 'moderator'], // Can be expanded based on your needs
      default: 'user'
    },
    permissions: {
      type: [String],  // This array will hold the specific permissions for the user
      default: []
    },
    profile: { type: String, required: true },
    profilePics: {
      type: [String], // Array of strings
      required: [true, 'profilePics is required'], // Ensures the field is present
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0; // Ensures the array is not empty
        },
        message: 'profilePics must have at least one entry'
      }
    }
});

module.exports = mongoose.model('User', UserSchema);