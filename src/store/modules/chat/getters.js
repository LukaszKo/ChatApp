export default {
  getAllUsers: state => state.users,
  /**
   * get all users groups
   */
  getGroups: state => state.groups,
  /**
   * get active group
   */
  getActiveGroup: state => state.activeGroup,
  /**
   * check if group exists in users groups
   */
  checkGroup: (state, getters) => name => getters.getGroups.map(group => group.name).includes(name),
  /**
   * get information about admin of group
   */
  getAdmin: (state, getters, rootState, rootGetters) => group => group.admin === rootGetters['core/getUser'].id,
  /**
   * get conversation map
   */
  getConversationMap: state => state.conversationMap,
  /**
   * get all private chats
   */
  getPrivateChats: state => state.groups.filter(group => group.private),
  /**
   * get chat by name
   */
  getChatById: (state, getters) => id => getters.getPrivateChats.find(group => group.users.includes(id))
}
