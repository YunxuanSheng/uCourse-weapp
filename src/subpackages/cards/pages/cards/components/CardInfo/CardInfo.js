import Taro, { Component } from '@tarojs/taro'
import { View, showModal } from '@tarojs/components'
import './CardInfo.scss'

export default class CardInfo extends Component {
  static defaultProps = {
    code: '*****',
    expiredAt: null,
    name: null,
    type: null,
    bgImage: '',
    content: '',
  }

  handleClick = () => {
    if (this.props.content !== '') {
      Taro.showModal({
        title: '提示',
        content: `${this.props.content}`,
        showCancel: false,
      })
    }
  }

  render() {
    return (
      <View
        className="card-info"
        style={{
          backgroundImage: `https://ufair.oss-cn-hangzhou.aliyuncs.com/img/vip-card-info-backgound.jpg`,
        }}
        onClick={this.handleClick}
      >
        <View className="left">
          <View className="code">{this.props.code}</View>
          <View className="valid">
            <View className="valid-title">有效至</View>
            <View className="valid-date">{this.props.expiredAt}</View>
          </View>
        </View>
        <View className="right">
          <View className="card-name">{this.props.name}</View>
          <View className="card-type">{this.props.type}</View>
        </View>
      </View>
    )
  }
}
