const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/db')
const User = require('../models/User')
const Group = require('../models/Group')
const authGuard = require('../utils/check-auth')

router.post('/signup', async (req, res, next) => {
  let newUser = new User({
    login: req.body.login,
    password: req.body.password,
  })

  try {
    let user = await User.getUserByLogin(req.body.login)
    if (user) {
      return res.status(409).json({ success: false, msg: 'Login exists' })
    } else {
      User.addUser(newUser, async (err, user) => {
        if (err) {
          return res.json({ success: false, msg: 'Failed to register user' })
        } else {
          let group = await Group.getGroupByName('General')
          if (group) {
            Group.updateGroup(
              { name: group.name },
              { $push: { users: user._id.toString() } },
              (err, count, status) => {
                if (err) throw err
              }
            )
          }
          return res.json({ success: true, msg: 'User registered' })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

// Authenticate
router.post('/signin', async (req, res, next) => {
  const login = req.body.login
  const password = req.body.password

  try {
    let user = await User.getUserByLogin(login)
    if (user) {
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          const token = jwt.sign(user, config.dev.secret, {
            expiresIn: 18000, // half hour
          })

          return res.json({
            success: true,
            token,
            user: {
              id: user._id,
              login: user.login,
            },
          })
        } else {
          return res.json({ success: false, msg: 'Wrong password' })
        }
      })
    } else {
      return res
        .status(401)
        .json({ success: false, msg: 'User does not exists' })
    }
  } catch (err) {
    return res.status(500).json({ error: err })
  }
})

// Profile
router.get('/', authGuard, async (req, res, next) => {
  try {
    let users = await User.getUsers()
    if (users) {
      let mappedUsers = users.map(user => {
        let newUser = { id: user._id, login: user.login }
        return newUser
      })
      return res.status(200).json(mappedUsers)
    } else {
      return res.status(404).json({ msg: 'Not found' })
    }
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

module.exports = router
