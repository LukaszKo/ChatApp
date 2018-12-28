<template lang="pug">
  .main-container
    .message-box.blue.lighten-5.scrollbar(id="message-box", v-if="!!getActiveGroup")
      message-container(v-for="(item, index) in msgHistory", :key="item.login + index", :model="item")
    .input-box.blue-grey
      v-text-field(hide-details, clearable, @input="onInputChange", :value="inputMsg", @keyup.enter="send", color="white", dark)
      .send-button
        font-awesome-icon.send-icon(:icon="sendIcon", color="white", @click="send")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons'
import MessageContainer from '../MessageContainer'
import { EventBus } from '../../utils/event-bus'

export default {
  components: { MessageContainer },
  data () {
    return {
      inputMsg: '',
      conversationLimit: 5,
      isReady: false
    }
  },
  computed: {
    ...mapGetters('core', [
      'getUser'
    ]),
    ...mapGetters('chat', [
      'getActiveGroup',
      'checkGroup',
      'getConversationMap'
    ]),
    sendIcon () {
      return faArrowAltCircleRight
    },
    msgHistory () {
      return [...this.getActiveGroup.history]
    }
  },
  mounted () {
    EventBus.$on('on-channel-changed', () => {
      this.scrollToBottom(0)
    })
    this.$nextTick(() => {
      this.scrollToBottom(300)
    })
  },
  methods: {
    ...mapMutations('chat', [
      'ADD_HISTORY_TO_GROUP',
      'ADD_TO_CONVERSATION_MAP',
      'CLEAR_FROM_CONVERSATION_MAP',
      'ADD_TO_CURRENT_CONVERSATION'
    ]),
    ...mapActions('chat', [
      'updateGroupHistory'
    ]),
    onInputChange (val) {
      this.inputMsg = val
    },
    scrollToBottom (delay) {
      setTimeout(() => {
        let box = document.getElementById('message-box')
        if (box) {
          let shouldScroll = box.scrollTop + box.clientHeight === box.scrollHeight
          if (!shouldScroll) {
            box.scrollTop = box.scrollHeight
          }
        }
      }, delay)
    },
    send () {
      if (this.inputMsg) {
        let payload = { group: this.getActiveGroup, user: this.getUser, msg: this.inputMsg }
        this.updateChatMsg(payload)
        this.$socket.emit('message-send', payload)
        this.manageCurrentConversation()
      }
      this.inputMsg = ''
    },
    getTime () {
      let timestamp = new Date()
      let time = ''
      if (timestamp.getMinutes().toString().length === 1) {
        time = `${timestamp.getHours()}:0${timestamp.getMinutes()}`
      } else {
        time = `${timestamp.getHours()}:${timestamp.getMinutes()}`
      }
      return time
    },
    updateChatMsg (payload) {
      let isGroup = this.checkGroup(payload.group.name)
      let isPrivateChat = this.getUser.login === payload.group.name
      if (isGroup || isPrivateChat) {
        let time = this.getTime()
        let userMsg = { login: payload.user.login, msg: payload.msg, time }
        this.ADD_TO_CONVERSATION_MAP({ groupId: payload.group.id, msg: userMsg })
        this.ADD_HISTORY_TO_GROUP({
          group: payload.group,
          msg: userMsg
        })
      }
      this.scrollToBottom(0)
    },
    async updateDatabase (list) {
      try {
        await this.updateGroupHistory(list)
      } catch (err) {
        console.error(err)
      } finally {
        this.CLEAR_FROM_CONVERSATION_MAP(this.getActiveGroup.id)
      }
    },
    manageCurrentConversation () {
      if (this.getConversationMap[this.getActiveGroup.id].length === this.conversationLimit) {
        this.updateDatabase(this.getConversationMap[this.getActiveGroup.id])
      }
    }
  },
  sockets: {
    messageReceive: function (payload) {
      this.updateChatMsg(payload)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import '../../sass/scrollbar'
  .main-container
    display: grid
    grid-template-rows: 1fr 70px
    grid-auto-columns: 1fr
    height: 90vh

  .message-box
    padding: 20px
    overflow-y: auto

  .input-box
    width: 100%
    display: flex
  .input-group
      padding-left: 5px
  .send-button
    margin: 15px 5px
    cursor: pointer
  .send-icon
    font-size: 3em
    &:active
      color: #263238
</style>
