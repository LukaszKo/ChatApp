const express = require('express')
const router = express.Router()
const Group = require('../models/Group')
const authGuard = require('../utils/check-auth')

router.post('/add', authGuard, (req, res, next) => {
  let newGroup = new Group({
    name: req.body.name,
    users: req.body.users,
    history: req.body.history,
    admin: req.body.admin,
    private: req.body.private
  })

  Group.getGroupByName(req.body.name, (err, group) => {
    if (err) throw err
    if (group) {
      return res.status(409).json({success: false, msg: 'Group with this name already exists'})
    } else {
      Group.createGroup(newGroup, (err, group) => {
        if (err) {
          res.status(500).json({success: false, msg: 'Failed to create group'})
        } else {
          let mappedGroup = {id: newGroup._id, history: newGroup.history, name: newGroup.name, private: newGroup.private, admin: newGroup.admin, users: newGroup.users}
          res.status(201).json({success: true, msg: 'Group created', group: mappedGroup})
        }
      })
    }
  })
})

router.get('/', authGuard, (req, res, next) => {
  Group.getGroups(req.query.userId, (err, groups) => {
    if (groups) {
      let newGroups = groups.map(group => {
        let newGroup = {id: group._id, name: group.name, users: group.users, history: group.history, admin: group.admin, private: group.private}
        return newGroup
      })
      return res.status(200).json(newGroups)
    } else {
      return res.status(404).json({msg: 'Not found'})
    }
  })
})

router.post('/update/history', authGuard, (req, res, next) => {
  let {groupId, history} = req.body
  let query = {_id: groupId}
  let update = {$push: {history: {$each: history}}}
  let options = {}

  Group.updateGroup(query, update, options, (err, data) => {
    if (err) {
      res.status(500).json({success: false, msg: 'Failed to update group history'})
    } else {
      return res.status(200).json({success: true, msg: 'Group history updated'})
    }
  })

})


module.exports = router
