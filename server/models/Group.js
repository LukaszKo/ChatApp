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
  history: {
    type: Array,
    required: true,
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

const Group = (module.exports = mongoose.model('Group', GroupSchema))

module.exports.createGroup = (newGroup) => {
  return newGroup.save()
}

module.exports.getGroupByName = (name) => {
  return Group.findOne({ name })
    .select('name users history admin _id private')
    .exec()
}

module.exports.getGroups = (userId) => {
  return Group.find({ $or: [{ users: userId }, { admin: userId }] })
    .select('name users history admin _id private')
    .exec()
}

module.exports.updateGroup = (query, update, options, cb) => {
  Group.update(query, update, options, cb)
}
