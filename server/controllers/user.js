const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.getUserById = function(id, cb) {
  User.findById(id, cb)
}

exports.getUserByLogin = function(login) {
  const query = { login }
  return User.findOne(query)
    .select('login _id password')
    .exec()
}

exports.addUser = function(newUser, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err
      newUser.password = hash
      newUser.save(cb)
    })
  })
}

exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err
    callback(null, isMatch)
  })
}

exports.getUsers = () => {
  return User.find()
    .select('login _id')
    .exec()
}
