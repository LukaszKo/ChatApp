<template lang="pug">
  .msg(:class="{'msg--my': checkOwnMsg(model.login), 'msg--full-width': manageMsgWidth}")
    v-card.card(:color="msgColor(model.login)")
      v-card-title.login.pl-2.pr-3.pa-0(v-if="!checkOwnMsg(model.login)") {{model.login}}
      v-card-title.login.pa-1(v-if="checkOwnMsg(model.login)")
      v-card-text.pt-0.pb-1.pl-2.pr-0
        .text-container
          .text {{model.msg}}
          .time {{model.time}}
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '../mixins/ResizeMixin'

export default {
  mixins: [ResizeMixin],
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters('core', [
      'getUser'
    ]),
    clientWidth () {
      return this.width
    },
    isMediumScreen () {
      return this.clientWidth < 1300 && this.clientWidth > 950
    },
    isMobileScreen () {
      return this.clientWidth < 800
    },
    manageMsgWidth () {
      return this.isMediumScreen || this.isMobileScreen
    }
  },
  methods: {
    checkOwnMsg (login) {
      return this.getUser.login === login
    },
    msgColor (login) {
      return this.getUser.login === login ? 'blue lighten-3' : 'white'
    }
  }
}
</script>

<style lang="sass" scoped>
  .msg
    display: flex
    margin: 20px 0
    &--my
      justify-content: flex-end
    &--full-width
      margin: 20px 0
      width: 100%
  .card
    border-radius: 5px
    min-width: 100px
  .login
    font-weight: 600
    color: #0091EA
  .text-container
    position: relative
    .text
      margin-right: 70px
    .time
      position: absolute
      right: 6px
      top: 6px
      font-size: 12px
      color: #424242
</style>
