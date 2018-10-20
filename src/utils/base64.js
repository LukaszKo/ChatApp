export default {
  encode (str) {
    return btoa(str)
  },
  decode (str) {
    return atob(str)
  }
}
