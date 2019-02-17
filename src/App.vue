<template lang="pug">
  #app
    v-app.grey.lighten-2
      transition(name="slide-fade")
        router-view
</template>

<script>
export default {
  name: 'app',
  sockets: {
    connect () {
      console.log('is cconnected from app')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import './sass/transitions/slide'
  #app
    font-family: 'Lato', sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    color: #2c3e50
</style>
