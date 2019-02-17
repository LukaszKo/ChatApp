import ServiceFactory from '../../../services/ServiceFactory'
import constants from './constants'
import base64 from '../../../utils/base64'
import setDefaultHeaders from '../../../utils/headers'

export default {
  async loginUser ({ commit, dispatch }, payload) {
    try {
      commit(constants.SET_LOADER, true)
      let response = await ServiceFactory.ProccessPostRequest('users/signin', payload)
      localStorage.setItem('user-token', response.data.token)
      setDefaultHeaders({ token: response.data.token })
      if (response.data.user) commit(constants.SIGNIN, response.data.user)
    } catch (err) {
      throw err
    } finally {
      commit(constants.SET_LOADER, false)
    }
  },
  async registerUser ({ commit }, payload) {
    try {
      commit(constants.SET_LOADER, true)
      await ServiceFactory.ProccessPostRequest('users/signup', payload)
    } catch (err) {
      throw err
    } finally {
      commit(constants.SET_LOADER, false)
    }
  },
  checkLogin ({ commit }) {
    let user = localStorage.getItem('user')
    let token = localStorage.getItem('user-token')
    token && setDefaultHeaders({ token })
    if (user) {
      let decodedUser = base64.decode(user)
      commit(constants.SIGNIN, JSON.parse(decodedUser))
    }
  },
  checkValidToken ({ commit }, status) {
    let isTokenStored = localStorage.getItem('user-token')
    return isTokenStored && status === 401
  },
  logout ({ commit }) {
    commit(constants.LOGOUT)
  }
}
