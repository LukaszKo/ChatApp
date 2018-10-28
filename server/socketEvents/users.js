module.exports = socket => {
  let connectedUser = null
  socket.on('user-signin', user => {
    connectedUser = user
    socket.broadcast.emit('userStatus', user)
  })
  socket.on('others-signin', user => {
    socket.broadcast.emit('othersStatus', user)
  })
  socket.on('user-signout', user => {
    socket.broadcast.emit('userSignout', user)
  })
  socket.on('disconnect', () => {
    if (connectedUser) {
      socket.broadcast.emit(
        'userSignout',
        Object.assign(connectedUser, { online: false })
      )
      connectedUser = null
    }
  })
}
