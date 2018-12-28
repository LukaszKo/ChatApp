const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
  history: {
    type: Array,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
})

module.exports = mongoose.Model('Conversation', conversationSchema)
