import Vuex from 'vuex'
import core from './modules/core/index'
import chat from './modules/chat/index'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    core,
    chat
  },
  strict: true
})
