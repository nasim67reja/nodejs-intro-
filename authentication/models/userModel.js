const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name']
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwrods are not the same!'
    }
  }
});

// // encryption or hashing password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the passwrod with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //  Delete the passwordConfirm field

  this.passwordConfirm = undefined;
  next();
});

//  this is for matching password. explaination exist in khata
// userSchema.methods.correctPassword = async function(
//   candidatePassword
//   // userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
