const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/db')
const User = require('../models/User')
const Group = require('../models/Group')
const authGuard = require('../utils/check-auth')

router.post('/signup', (req, res, next) => {
  let newUser = new User({
    login: req.body.login,
    password: req.body.password
  })

  User.getUserByLogin(req.body.login, (err, user) => {
    if (err) throw err
    if (user) {
      return res.status(409).json({success: false, msg: 'Login exists'})
    } else {
      User.addUser(newUser, (err, user) => {
        if (err) {
          console.log(err)
          res.json({success: false, msg: 'Failed to register user'})
        } else {
          Group.getGroupByName("General", (err, group) => {
            if (err) throw err
            if (group) {
              Group.updateGroup({name: group.name}, { $push: {users: user._id.toString()}}, (err, count, status) => {
                if (err) throw err
              })
            }
          })
          res.json({success: true, msg: 'User registered'})
        }
      })
    }
  })
})

// Authenticate
router.post('/signin', (req, res, next) => {
  const login = req.body.login
  const password = req.body.password

  User.getUserByLogin(login, (err, user) => {
    if (err) throw err
    if (!user) {
      return res.status(401).json({success: false, msg: 'User doesnt exists'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        const token = jwt.sign(user, config.dev.secret, {
          expiresIn: 18000 // half hour
        })

        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            login: user.login
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'})
      }
    })
  })
})

// Profile
router.get('/', authGuard, (req, res, next) => {
  User.getUsers((err, users) => {
    if (users) {
      let mappedUsers = users.map(user => {
        let newUser = {id: user._id, login: user.login}
        return newUser
      })
      return res.status(200).json(mappedUsers)
    } else {
      return res.status(404).json({msg: 'Not found'})
    }
  })
})

module.exports = router
