const express = require('express')
const router = express.Router()
const Group = require('../models/Group')
const authGuard = require('../utils/check-auth')

router.post('/add', authGuard, async (req, res, next) => {
  let newGroup = new Group({
    name: req.body.name,
    users: req.body.users,
    history: req.body.history,
    admin: req.body.admin,
    private: req.body.private,
  })

  try {
    let group = await Group.getGroupByName(req.body.name)
    if (group) {
      res
        .status(409)
        .json({ success: false, msg: 'Group with this name already exists' })
    } else {
      let response = await Group.createGroup(newGroup)
      let mappedGroup = {
        id: newGroup._id,
        history: newGroup.history,
        name: newGroup.name,
        private: newGroup.private,
        admin: newGroup.admin,
        users: newGroup.users,
      }
      res
        .status(201)
        .json({ success: true, msg: 'Group created', group: mappedGroup })
    }
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({ success: false, msg: 'Failed to create group', error: err })
  }
})

router.get('/', authGuard, async (req, res, next) => {
  try {
    const groups = await Group.getGroups(req.query.userId)
    let newGroups = groups.map(group => {
      let newGroup = {
        id: group._id,
        name: group.name,
        users: group.users,
        history: group.history,
        admin: group.admin,
        private: group.private,
      }
      return newGroup
    })
    res.status(200).json(newGroups)
  } catch (err) {
    res.status(404).json({ msg: 'Not found', error: err })
  }
})

router.post('/update/history', authGuard, (req, res, next) => {
  let { groupId, history } = req.body
  let query = { _id: groupId }
  let update = { $push: { history: { $each: history } } }
  let options = {}

  Group.updateGroup(query, update, options, (err, data) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, msg: 'Failed to update group history' })
    } else {
      return res
        .status(200)
        .json({ success: true, msg: 'Group history updated' })
    }
  })
})

module.exports = router
