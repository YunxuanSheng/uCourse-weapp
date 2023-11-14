import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './RefreshHint.scss'

export default class RefreshHint extends Component {
  state = {
    show: false,
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ show: true })
      this.timer = setTimeout(() => {
        this.setState({ show: false })
      }, 5000)
    }, 8000)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    return (
      <View className={'refresh-hint-comp ' + (this.state.show ? 'show' : '')}>
        {Taro.T._('Click to Refresh')}
      </View>
    )
  }
}
