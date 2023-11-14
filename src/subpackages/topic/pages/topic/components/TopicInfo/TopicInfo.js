import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './TopicInfo.scss'

export default class Topic extends Component {
  static defaultProps = {
    title: '...',
    img: 'https://i.loli.net/2018/10/28/5bd5c49ca2ea5.jpg', // placeholder
    description: '...',
    is_ended: false, //TODO
  }

  render() {
    return (
      <View>
        <Image className="header-img" src={this.props.img} mode="widthFix" />

        <View className="info">
          <View className="title">{this.props.title}</View>
          <Text className="description">{this.props.description}</Text>
        </View>
      </View>
    )
  }
}
