import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../../../components/UIcon/UIcon'

import './Capsule.scss'

export default class Capsule extends Component {
  static defaultProps = {
    statusBarHeight: 0,
  }

  navToEdit = () => {
    const { nickname } = Taro.getStorageSync('userInfo') || {}
    if (nickname) {
      // has logged in
      Taro.navigateTo({
        url: '/subpackages/profile-edit/pages/profile-edit/profile-edit',
      })
    } else {
      Taro.showToast({ title: Taro.T._('Please login first'), icon: 'none' })
    }
  }

  navToSettings = () => {
    Taro.navigateTo({ url: '/subpackages/settings/pages/settings/settings' })
  }

  render() {
    const capsuleStyle = `top: ${this.props.statusBarHeight}px; width: 88px; height: 32px;margin-top: 7px;`

    return (
      <View className="capsule-comp" style={capsuleStyle}>
        <View className="icon" hoverStartTime={0} onClick={this.navToSettings}>
          <UIcon icon="setup" />
        </View>
        <View className="icon" hoverStartTime={0} onClick={this.navToEdit}>
          <UIcon icon="edit" />
        </View>
      </View>
    )
  }
}
