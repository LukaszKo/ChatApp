const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

let UserSchema = mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = function (id, cb) {
  User.findById(id, cb)
}

module.exports.getUserByLogin = function (login, cb) {
  const query = {login}
  User.findOne(query)
    .select('login _id password')
    .exec(cb)
}

module.exports.addUser = function (newUser, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err
      newUser.password = hash
      newUser.save(cb)
    })
  })
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err
    callback(null, isMatch)
  })
}

module.exports.getUsers = (cb) => {
  User.find()
    .select('login _id')
    .exec(cb)
}
