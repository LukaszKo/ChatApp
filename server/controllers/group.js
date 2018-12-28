const Group = require('../models/Group')

exports.createGroup = newGroup => {
  return newGroup.save()
}

exports.getGroupByName = name => {
  return Group.findOne({ name })
    .select('name users history admin _id private')
    .exec()
}

exports.getGroups = userId => {
  return Group.find({ $or: [{ users: userId }, { admin: userId }] })
    .select('name users history admin _id private')
    .exec()
}
exports.updateGroup = (query, update, options, cb) => {
  Group.update(query, update, options, cb)
}
