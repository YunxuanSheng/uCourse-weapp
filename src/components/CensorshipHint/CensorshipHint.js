import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './CensorshipHint.scss'

export default class CensorshipHint extends Component {
  static defaultProps = {
    show: false,
    reason: '敏感内容',
  }

  render() {
    return (
      this.props.show && (
        <View className="container">
          <View className="hint">
            {Taro.T._('This content is blocked due to its audit content.')}
          </View>
          <View className="reason">
            {`${Taro.T._('Reason')}:  `}
            <Text className="reason-content">{this.props.reason}</Text>
          </View>
        </View>
      )
    )
  }
}
