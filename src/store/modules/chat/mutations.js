import constants from './constants'
import Vue from 'vue'

export default {
  [constants.SET_USERS] (state, payload) {
    state.users = payload || []
  },
  [constants.CHANGE_USER_OBJECT] (state, payload) {
    let user = state.users.find(user => user.id === payload.id)
    if (!user) {
      user = payload
      state.users.push(user)
    }
    if (user) Vue.set(user, 'online', payload.online)
  },
  [constants.SET_USER_GROUPS] (state, payload) {
    state.groups = payload || []
    if (payload.length) {
      payload.map(group => {
        state.conversationMap[group.id] = []
      })
    }
  },
  [constants.SET_ACTIVE_GROUP] (state, payload) {
    state.activeGroup = payload
  },
  [constants.ADD_HISTORY_TO_GROUP] (state, payload) {
    let chatToUpdate = state.groups.find(group => group.name === payload.group.name)
    chatToUpdate.history.push(payload.msg)
  },
  [constants.ADD_GROUP] (state, payload) {
    state.groups.push(payload)
  },
  [constants.ADD_TO_CONVERSATION_MAP] (state, payload) {
    state.conversationMap[payload.groupId].push(payload.msg)
  },
  [constants.CLEAR_FROM_CONVERSATION_MAP] (state, payload) {
    state.conversationMap[payload] = []
  },
  [constants.ADD_USER] (state, payload) {
    state.users.push(payload)
  }
}
