module.exports = (socket) => {
  socket.on('message-send', (payload) => {
    socket.broadcast.emit('messageReceive', payload)
  })
}
