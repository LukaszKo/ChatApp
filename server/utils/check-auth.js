const jwt = require('jsonwebtoken')
const config = require('../config/db')

module.exports = (req, res , next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, config.dev.secret)
    req.userData = decoded
    next()
  } catch (err) {
    return res.status(401).json({message: 'Auth failed'})
  }
}