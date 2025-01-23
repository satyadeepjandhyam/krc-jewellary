const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, 
 
   verified: {
        type: Boolean,
        default: false
    },

    isAdmin: {
      type: Boolean,
      default: false // Set to true for admin users
  },

}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);
