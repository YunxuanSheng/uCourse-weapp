import Taro, { Component } from '@tarojs/taro'
import { Image, OpenData, View } from '@tarojs/components'

import './Avatar.scss'

export default class Avatar extends Component {
  static defaultProps = {
    size: 'medium',
    src: '',
    uid: null,
  }

  navTo = e => {
    e.stopPropagation()
    const pages = Taro.getCurrentPages()
    const path = pages[pages.length - 1].route
    if (path === 'pages/profile/profile') {
      return
    }
    if (this.props.uid) {
      Taro.navigateTo({
        url: `/subpackages/profile/pages/profile/profile?id=${this.props.uid}`,
      })
    } else {
      Taro.navigateTo({
        url: `/subpackages/profile/pages/profile/profile`,
      })
    }
  }

  render() {
    return (
      <View onClick={this.navTo}>
        {this.props.src ? (
          <Image
            className={`avatar-container avatar-container-${this.props.size}`}
            style={{ fontSize: this.props.size + 'rpx' }}
            src={this.props.src}
          />
        ) : (
          <View
            className={`avatar-container avatar-container-${this.props.size}`}
            style={this.state.style}
          >
            <OpenData type="userAvatarUrl" />
          </View>
        )}
      </View>
    )
  }
}
