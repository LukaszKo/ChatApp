const mongoose = require('mongoose')
const User = require('../models/users')

let UserSchema = mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('User', UserSchema)
