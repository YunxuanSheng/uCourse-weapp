import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './Loading.scss'

export default class Loading extends Component {
  static defaultProps = {
    color: '', // black
    type: 'dot', // dot, circle, circular, spinner
  }

  render() {
    const { color, type } = this.props
    return (
      <View
        className={`loading ${color} ${type === 'dot' ? 'block' : 'inline'}`}
      >
        {type === 'circle' && <View className="circle" />}
        {type === 'circular' && <View className="circular" />}
        {(type === 'spinner' || type === 'dot') && (
          <View className={type === 'dot' ? 'dot-spinner' : 'spinner'}>
            {[...Array(12).keys()].map(dot => (
              <View key={dot} />
            ))}
          </View>
        )}
      </View>
    )
  }
}
