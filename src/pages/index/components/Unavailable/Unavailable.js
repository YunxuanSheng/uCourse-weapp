import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import moment from 'moment'
import './Unavailable.scss'

export default class Unavailable extends Component {
  state = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
  }

  static defaultProps = {
    ddl: {},
  }

  componentWillMount() {
    this.timeer = setInterval(() => {
      const now = new Date()
      const ddl = moment(this.props.ddl._i)
      const diff = ddl.diff(now)
      if (diff < 0) {
        this.props.onAvailable()
      }
      const duration = moment.duration(diff)
      this.setState({
        seconds: duration.seconds(),
        minutes: duration.minutes(),
        hours: duration.hours(),
        days: duration.days(),
      })
    }, 1000)
  }

  render() {
    return (
      <View className="unavailable-page">
        <View className="logo-container">
          <Image
            className="logo"
            mode="widthFix"
            src="https://ufair.oss-cn-hangzhou.aliyuncs.com/img/ufair-logo.jpg"
          />
        </View>

        <View className="time">
          <View className="time-unit"> </View>
          <View className="time-item">{this.state.days} </View>
          <View className="time-unit">天</View>
          <View className="time-item">{this.state.hours} </View>
          <View className="time-unit">时</View>
          <View className="time-item">{this.state.minutes} </View>
          <View className="time-unit">分</View>
          <View className="time-item">{this.state.seconds} </View>
          <View className="time-unit">秒</View>
        </View>

        <View className="text-container">
          <View>即将上线，敬请期待。</View>
        </View>

        <View className="footer">2018 年 9 月 17 日 19:00 见</View>
      </View>
    )
  }
}
