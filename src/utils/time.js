import Taro from '@tarojs/taro'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'moment/locale/zh-tw'
import 'moment/locale/zh-hk'

class Time {
  constructor() {
    let locale = Taro.getStorageSync('locale')
    if (locale === 'zh_CN') {
      moment.locale('zh-cn')
    } else if (locale === 'zh_TW') {
      moment.locale('zh-tw')
    } else if (locale === 'zh_HK') {
      moment.locale('zh-hk')
    } else {
      moment.locale('en')
    }
  }

  fromNow = (date, noSuffix = false) => moment(date).fromNow(noSuffix)

  format = date => moment(date).format('YYYY-MM-DD HH:mm')

  fromNowOrFormat = (date, bound = { num: 2, unit: 'day' }) => {
    const showFormat = moment(date)
      .add(bound.num, bound.unit)
      .isBefore(moment())

    return showFormat ? this.format(date) : this.fromNow(date)
  }

  YYYYMMDD = date => moment(date).format('YYYY/MM/DD')

  getLastedHours = s => (moment().diff(moment().startOf('day').add(s, 'h'))/(3600*1000))

  now = () => {
    const mo = moment()
    return {
      year: mo.year(), // 2019
      month: mo.month(), // 0 ~ 11
      monthShort: mo.format('MMM'), // Jan
      date: mo.date(), // 1 ~ 31
      day: mo.isoWeekday(), // 1 ~ 7, 1: Monday
      week: mo.isoWeek(),
      hour: mo.hour(), // 0 ~ 23
      minute: mo.minute(), // 0 ~ 59
      second: mo.second(), // 0 ~ 59
      millisecond: mo.millisecond(), // 0 ~ 59
      moment: mo,
    }
  }

  weeks = () => {
    const mo = moment()
    return {
      weekdays: mo.weekdays(),
      weekdaysShort: mo.weekdaysShort(),
      weekdaysMin: mo.weekdaysMin(),
    }
  }

  moment = moment
}

export default new Time()
