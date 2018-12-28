const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const UserController = require('../models/User')
const config = require('./db')

module.exports = function (passport) {
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
  opts.secretOrKey = config.dev.secret
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    UserController.getUserById(jwt_payload._doc._id, (err, user) => {
      if (err) {
        return done(err, false)
      }

      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
  }))
}
