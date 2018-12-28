const mongoose = require('mongoose')

let GroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  users: {
    type: Array,
  },
  admin: {
    type: String,
    required: true,
  },
  private: {
    type: Boolean,
    required: true,
  },
})

module.exports = mongoose.model('Group', GroupSchema)
