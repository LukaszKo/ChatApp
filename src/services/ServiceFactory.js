import axios from 'axios'
import config from './apiHost'

export default {
  ProccessGetRequest: (address) => {
    return axios.get(`${config.wsHost}${address}`)
  },
  ProccessPostRequest: (address, obj) => {
    return axios.post(`${config.wsHost}${address}`, obj)
  },
  ProccessDeleteRequest: (address, obj) => {
    return axios.delete(`${config.wsHost}${address}`, obj)
  }
}
