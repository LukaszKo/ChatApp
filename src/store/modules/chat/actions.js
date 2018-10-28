import ServiceFactory from '../../../services/ServiceFactory'
import constants from './constants'

export default {
  async fetchUsers ({ commit, rootState }) {
    try {
      let response = await ServiceFactory.ProccessGetRequest('users')
      let users = response.data.filter(
        user => user.login && user.id !== rootState.core.user.id
      )
      commit(constants.SET_USERS, users)
    } catch (err) {
      throw err
    }
  },
  async fetchGroups ({ commit, state, getters, rootGetters, dispatch }) {
    const user = rootGetters['core/getUser']
    try {
      let response = await ServiceFactory.ProccessGetRequest(
        `groups?userId=${user.id}`
      )
      let generalGroup = response.data.find(group => group.name === 'General')
      generalGroup
        ? commit(constants.SET_ACTIVE_GROUP, generalGroup)
        : commit(constants.SET_ACTIVE_GROUP, response.data[0])
      commit(constants.SET_USER_GROUPS, response.data)
    } catch (err) {
      throw err
    }
  },
  async updateGroupHistory ({ commit, getters }, payload) {
    let groupId = getters.getActiveGroup.id
    let history = payload
    try {
      await ServiceFactory.ProccessPostRequest('groups/update/history', {
        groupId,
        history
      })
    } catch (err) {
      throw err
    }
  },
  async addNewGroup ({ commit, getters }, payload) {
    try {
      payload.private = false
      let response = await ServiceFactory.ProccessPostRequest(
        'groups/add',
        payload
      )
      let group = response.data.group
      commit(constants.ADD_GROUP, group)
      commit(constants.SET_ACTIVE_GROUP, group)
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  async createChat ({ commit, getters, rootGetters }, payload) {
    const user = rootGetters['core/getUser']
    try {
      let name = `${user.login}-${payload.login}`
      let newChat = {
        history: [],
        name,
        admin: user.id,
        private: true,
        users: [user.id, payload.id]
      }
      let response = await ServiceFactory.ProccessPostRequest(
        'groups/add',
        newChat
      )
      let group = response.data.group
      commit(constants.ADD_GROUP, group)
      commit(constants.SET_ACTIVE_GROUP, group)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
