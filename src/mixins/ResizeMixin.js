export default {
  data () {
    return {
      width: null,
      height: null
    }
  },
  methods: {
    resizeHandler () {
      this.width = document.body.clientWidth
      this.height = document.body.clientHeight
    }
  },
  created () {
    this.resizeHandler()
    window.addEventListener('resize', this.resizeHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeHandler)
  }
}
