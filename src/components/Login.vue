<template lang="pug">
  v-container
    v-layout(justify-center)
      v-flex.login(xs12='', md4='', fill-height, @keyup.enter="signinUser")
        v-card
          v-progress-linear(:indeterminate="getLoader", color="orange", :background-color="bgColor", height="5")
          v-card-title.pa-4
            .title.grey.lighten-3.pa-3
              span.blue-grey--text Login to ChatApp
            v-spacer
            v-alert.alert(:value="errMsg" outline, color="error", icon="warning") {{errMsg}}
          v-card-text.pa-4
            v-text-field(v-model="login", label='Login', required, :error-messages="errors.collect('login')", v-validate="'required'", data-vv-name="login")
            v-text-field(v-model="password", label='Password', type='password', required, :error-messages="errors.collect('password')", v-validate="'required'", data-vv-name="password")
          v-card-actions.pa-4
            v-spacer
            v-btn.blue-grey(dark, @click='register') Registration
            v-btn.blue(dark, @click='signinUser') Login
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  computed: {
    ...mapGetters('core', [
      'getLoader'
    ]),
    bgColor () {
      return this.getLoader ? 'grey' : 'white'
    }
  },
  name: 'Login',
  data () {
    return {
      login: '',
      password: '',
      errMsg: null
    }
  },
  methods: {
    ...mapActions('core', [
      'loginUser'
    ]),
    async signinUser () {
      this.errMsg = null
      try {
        const validate = await this.$validator.validateAll()
        validate && await this.loginUser({ login: this.login, password: this.password })
        this.$router.push({ name: 'home' })
      } catch (err) {
        this.errMsg = err.response.data.msg
      }
    },
    register () {
      this.$router.push({ name: 'signup' })
    }
  }
}
</script>

<style lang="sass" scoped>
  .login
    margin-top: 15%
  .alert
    margin: 0 !important
    padding: 0
    border: none !important
    font-size: 1.3em
  .title
    box-shadow: 3px 3px 3px 2px grey
    font-weight: 600
</style>
