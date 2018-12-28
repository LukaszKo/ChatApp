import moment from 'moment'

export default {
  getDate: (date, format) => {
    return moment(date).format(format)
  }
}
