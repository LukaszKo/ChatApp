<template lang="pug">
  v-container
    v-layout(justify-center)
      v-flex(lg8="")
        v-card
          v-progress-linear(:indeterminate="isCreating", color="blue", background-color="gray", height="4")
          v-card-title.pa-4
            .headline.blue-grey--text Create group
            v-spacer
            v-alert.alert(:value="errMsg" outline color="error", icon="warning") {{errMsg}}
          v-card-text.pa-4
            v-text-field(v-model="name", label="Group name", :error-messages="errors.collect('name')", v-validate="'required'", data-vv-name="name", :disabled="isCreating")
            v-text-field(v-model="login", label="Admin", :error-messages="errors.collect('admin')", v-validate="'required'", data-vv-name="admin", disabled)
            .label.mb-1 Assign users
            multiselect(
              v-model="usersSelected",
              :options="getAllUsers",
              :multiple="true",
              label="login",
              track-by="login",
              :disabled="isCreating")
            .red--text.mt-1(v-if="!usersSelected.length && submitClicked") The users field is requred
          v-card-actions.pa-4
            v-spacer
            v-btn(@click.native='back', :disabled="isCreating") Back
            v-btn.blue(@click.native='submitForm', :disabled="isCreating")
              .white--text Create
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: { Multiselect },
  data () {
    return {
      name: '',
      users: '',
      admin: '',
      errMsg: null,
      usersSelected: [],
      submitClicked: false,
      isCreating: false,
      login: ''
    }
  },
  computed: {
    ...mapGetters('core', [
      'getUser'
    ]),
    ...mapGetters('chat', [
      'getAllUsers'
    ])
  },
  mounted () {
    this.admin = this.getUser
    this.login = this.admin.login
  },
  methods: {
    ...mapActions('chat', [
      'addNewGroup'
    ]),
    back () {
      this.$router.push({ name: 'home' })
    },
    mapSelectedUsers () {
      let selectedUsers = [...this.usersSelected, this.getUser]
      return selectedUsers.map(user => user.id)
    },
    async submitForm () {
      this.errMsg = null
      this.submitClicked = true
      try {
        const validate = await this.$validator.validateAll()
        if (validate && this.usersSelected.length) {
          this.isCreating = true
          let usersGroup = this.mapSelectedUsers()
          let newGroup = { name: this.name, users: usersGroup, admin: this.admin.id, history: [] }
          await this.addNewGroup(newGroup)
          this.$router.push({ name: 'home' })
        }
      } catch (err) {
        this.errMsg = err.response.data.msg
      } finally {
        this.isCreating = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .label
    color: rgba(0,0,0,.54)
</style>
