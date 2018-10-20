<template lang='pug'>
  v-container
    v-layout(justify-center)
      v-flex.register(xs12='', md4='', fill-height, @keyup.enter='submitForm')
        v-card
          v-progress-linear(:indeterminate='getLoader', color='orange', :background-color='bgColor')
          v-card-title.pa-4
            .title.grey.lighten-3.pa-3
              span.blue-grey--text Register to ChatApp
            v-spacer
            v-alert.alert(:value='errMsg' outline color='error', icon='warning') {{errMsg}}
          v-card-text.pa-4
            v-text-field(v-model='login', label='Login', :error-messages="errors.collect('login')", v-validate="'required'", data-vv-name='login')
            v-text-field(
              v-model='password',
              label='Password',
              name='password',
              type='password'
              v-validate="'required'",
              :error-messages="errors.collect('password')"
              ref='password')
            v-text-field(
              v-model='checkPassword',
              label='Confirm Password',
              name='checkPassword',
              type='password',
              v-validate="'required|confirmed:password'",
              data-vv-as='password',
              :error-messages="errors.collect('checkPassword')")
          v-card-actions.pa-4
            v-spacer
            v-btn(@click.native='back') Back
            v-btn.blue(dark, @click.native='submitForm') Register
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      login: '',
      password: '',
      checkPassword: '',
      errMsg: null
    }
  },
  computed: {
    ...mapGetters('core', ['getLoader']),
    bgColor () {
      return this.getLoader ? 'grey' : 'white'
    }
  },
  methods: {
    ...mapActions('core', ['registerUser']),
    async submitForm () {
      this.errMsg = null
      try {
        const validate = await this.$validator.validateAll()
        if (validate) {
          validate &&
            (await this.registerUser({
              login: this.login,
              password: this.password
            }))
          this.$router.push({ name: 'signin' })
        }
      } catch (err) {
        this.errMsg = err.response.data.msg
      }
    },
    back () {
      this.$router.push({ name: 'signin' })
    }
  }
}
</script>

<style lang='sass' scoped>
  .register
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
