import store from '../store/store'

export default (to, from, next) => {
  if (store.getters['core/getUser']) {
    next()
  } else {
    next('/signin')
  }
}
