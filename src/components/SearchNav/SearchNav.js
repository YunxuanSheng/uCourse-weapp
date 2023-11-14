import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../UIcon/UIcon'
import './SearchNav.scss'

export default class SearchNav extends Component {
  navToSearch = () => {
    Taro.navigateTo({ url: '/subpackages/search/pages/search/search' })
  }

  render() {
    return (
      <View className="search-nav-comp" onClick={this.navToSearch}>
        <UIcon icon-class="icon" icon="search-o" />
        {Taro.T._('Search')}
      </View>
    )
  }
}
