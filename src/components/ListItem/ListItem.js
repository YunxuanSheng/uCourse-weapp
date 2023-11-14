import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './ListItem.scss'

export default class ListItem extends Component {
  static defaultProps = {
    mode: 'navigator', // search
    placeholder: '搜一搜',
  }

  componentDidMount() {}

  navToSearch = () => {
    console.log(this.props.mode)
  }

  render() {
    return <View className="search-container" />
  }
}
