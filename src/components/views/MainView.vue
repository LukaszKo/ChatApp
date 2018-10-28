<template lang="pug">
  v-app
    v-navigation-drawer(v-model='drawerLeft', fixed, app, clipped, :width="250", mobile-break-point="960")
      v-list(subheader)
        v-subheader(inset)
          .headline Groups
          font-awesome-icon.ml-4.add-icon(:icon="addIcon", color="#66BB6A", @click="addGroup")
        v-divider
        v-progress-linear.ma-0(:indeterminate="groupsFetched", color="blue", :background-color="bgColor", height="3")
        v-list-tile.grey.ma-2.radius(v-for='item in userGroups', :key='item.name', @click="changeGroup(item)", :class="{isActive: checkActive(item.name)}")
          v-list-tile-avatar
            font-awesome-icon.setting-icon(:icon="groupIcon", color="#EEEEEE", name='')
          v-list-tile-content
            v-list-tile-title.white--text {{ item.name }}
          v-list-tile-action
            font-awesome-icon.setting-icon(v-if="isAdminOfGroup(item)", :icon="settingIcon", color="#37474F")
    v-toolbar.blue-grey.lighten-1(dark, app, clipped-left, clipped-right, flat)
      v-toolbar-side-icon.hidden-md-and-up(@click.stop='drawerLeft = !drawerLeft')
      v-spacer
      v-toolbar-title Chat App
      v-spacer
      .headline.hidden-xs-only.mr-3 {{userLogin}}
      v-menu(bottom, left, :nudge-bottom=35)
        v-btn(icon, slot="activator", dark)
          font-awesome-icon.user-icon(:icon="userIcon")
        v-list
          v-list-tile.hidden-sm-and-up
            v-list-tile-title
              span.blue--text {{userLogin}}
            v-list-tile-action
          v-divider.hidden-sm-and-up
          v-list-tile(v-for="item in items", :key="item.label", @click="logoutUser")
            v-list-tile-title {{item.label}}
            v-list-tile-action
              font-awesome-icon.icon(:icon="signoutIcon")
      v-toolbar-side-icon.mr-5.hidden-md-and-up(@click.stop='drawerRight = !drawerRight')
    v-navigation-drawer(fixed, v-model="drawerRight", app, right, clipped, :width="250", mobile-break-point="960")
      v-list(subheader)
        v-subheader(inset)
          .headline Users
        v-divider
        v-progress-linear.ma-0(:indeterminate="usersFetched", color="blue", :background-color="bgColor", height="3")
        v-list-tile.user-name.ma-2.radius(
          v-if="!usersFetched",
          v-for='item in getAllUsers',
          :key='item.login',
          @click="openPrivateChat(item)",
          :class="{isActive: checkActive(item.login), online: item.online}")
          v-list-tile-avatar
            font-awesome-icon.status-icon(:icon="userIcon", :color="checkStatus(item.online)")
          v-list-tile-content {{item.login}}
          v-list-tile-action
    v-content.blue.lighten-5
      transition(name="slide-fade")
        router-view
</template>

<script>
import { faSignOutAlt, faUserCircle, faCircle, faPlusCircle, faCog, faComments } from '@fortawesome/free-solid-svg-icons'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { EventBus } from '../../utils/event-bus'

export default {
  data () {
    return {
      drawerRight: null,
      drawerLeft: null,
      usersFetched: false,
      groupsFetched: false,
      items: [
        { label: 'Logut', icon: 'signoutIcon', action: 'logout' }
      ]
    }
  },
  computed: {
    ...mapGetters('core', [
      'getUser'
    ]),
    ...mapGetters('chat', [
      'getAllUsers',
      'getGroups',
      'getActiveGroup',
      'getAdmin',
      'getChatById'
    ]),
    userGroups () {
      return this.getGroups.filter(group => !group.private)
    },
    userLogin () {
      return this.getUser.login
    },
    userIcon () {
      return faUserCircle
    },
    signoutIcon () {
      return faSignOutAlt
    },
    onlineStatusIcon () {
      return faCircle
    },
    bgColor () {
      return this.usersFetched ? 'grey' : 'white'
    },
    addIcon () {
      return faPlusCircle
    },
    settingIcon () {
      return faCog
    },
    groupIcon () {
      return faComments
    }
  },
  methods: {
    ...mapActions('core', [
      'logout',
      'checkValidToken'
    ]),
    ...mapActions('chat', [
      'fetchUsers',
      'fetchGroups',
      'createChat'
    ]),
    ...mapMutations('chat', [
      'CHANGE_USER_OBJECT',
      'SET_ACTIVE_GROUP'
    ]),
    logoutUser () {
      this.$socket.emit('user-signout', Object.assign(this.getUser, { online: false }))
      this.logout()
      this.$router.push('/signin')
    },
    async getUsers () {
      try {
        this.usersFetched = true
        await this.fetchUsers()
      } catch (err) {
        let isNotValid = await this.checkValidToken(err.response.status)
        isNotValid && this.logoutUser()
        console.error(err)
      } finally {
        this.usersFetched = false
      }
    },
    async getUserGroups () {
      try {
        this.groupsFetched = true
        await this.fetchGroups()
      } catch (err) {
        let isNotValid = await this.checkValidToken(err.response.status)
        isNotValid && this.logoutUser()
        console.error(err)
      } finally {
        this.groupsFetched = false
      }
    },
    checkStatus (isOnline) {
      return isOnline ? 'white' : 'grey'
    },
    checkActive (groupName) {
      return this.getActiveGroup && (this.getActiveGroup.name === groupName || this.getActiveGroup.name.includes(groupName))
    },
    addGroup () {
      this.$router.push({ name: 'create-group' })
    },
    changeGroup (group) {
      this.SET_ACTIVE_GROUP(group)
      EventBus.$emit('on-channel-changed')
    },
    isAdminOfGroup (group) {
      return this.getAdmin(group)
    },
    openPrivateChat (user) {
      let chatObj = this.getChatById(user.id)
      EventBus.$emit('on-channel-changed')
      if (chatObj) {
        this.SET_ACTIVE_GROUP(chatObj)
      } else {
        this.createPrivateChat(user)
      }
    },
    async createPrivateChat (user) {
      try {
        await this.createChat(user)
      } catch (err) {

      } finally {

      }
    }
  },
  async created () {
    await this.getUsers()
    await this.getUserGroups()
    this.$socket.emit('user-signin', Object.assign(this.getUser, { online: true }))
  },
  sockets: {
    userStatus: function (val) {
      this.CHANGE_USER_OBJECT(val)
      this.$socket.emit('others-signin', Object.assign(this.getUser, { online: true }))
    },
    othersStatus: function (val) {
      !this.usersFetched && this.CHANGE_USER_OBJECT(val)
    },
    userSignout: function (user) {
      this.CHANGE_USER_OBJECT(user)
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../../sass/transitions/slide'
  .user-icon
    font-size: 2.5em
    margin-right: 5px
  .status-icon
    font-size: 1.5em
  .add-icon
    font-size: 1.7em
    cursor: pointer
  .icon
    font-size: 1.5em
    margin-left: 30px
  .radius
    border-radius: 5px
  .online
    background-color: #66BB6A !important
    color: white
  .isActive
    background-color: #4FC3F7 !important
    color: white;
  .setting-icon
    font-size: 1.2em
  .user-name
    background-color: #EEEEEE
</style>
