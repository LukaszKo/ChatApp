const express = require('express')
// const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
const http = require('http')
const socketIO = require('socket.io')
const invokeUsersEvents = require('./socketEvents/users')
const invokeMessageEvents = require('./socketEvents/messages')
const logger = require('morgan')

const config = require('./config/db')

// Connect To Database
mongoose.connect(config.dev.datebase)

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database')
})

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err)
})

const PORT = 9100
let app = express()

// routes
const usersRoutes = require('./routes/user')
const groupsRoutes = require('./routes/groups')

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// use routes
app.use('/api/users', usersRoutes)
app.use('/api/groups', groupsRoutes)

const server = http.createServer(app)

const io = socketIO(server)

io.on('connection', (socket) => {
  invokeUsersEvents(socket)
  invokeMessageEvents(socket)
})

server.listen(PORT, () => {
  console.log('Server is running on port: ' + PORT)
})
