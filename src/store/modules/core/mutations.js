import constants from './constants'
import base64 from '../../../utils/base64'

export default {
  /**
   * Set user object
   */
  [constants.SET_USER] (state, payload) {
    state.user = payload
  },
  /**
   * Ustawia obiekt uzytkownika
   */
  [constants.SIGNIN] (state, payload) {
    state.user = payload
    let userString = JSON.stringify(payload)
    let encodedUser = base64.encode(userString)
    localStorage.setItem('user', encodedUser)
  },
  [constants.LOGOUT] (state) {
    state.user = null
    localStorage.clear()
  },
  [constants.SET_LOADER] (state, payload) {
    state.loader = payload
  }
}
