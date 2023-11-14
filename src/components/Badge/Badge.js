import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../UIcon/UIcon'

import './Badge.scss'

export default class SchoolCard extends Component {
  static defaultProps = {
    type: '',
    status: false,
  }

  handleVeriClicked = async () => {
    const { is_verified } = Taro.getStorageSync('userInfo')

    if (is_verified) {
      await Taro.showModal({
        title: Taro.T._('The Glory of Verification'),
        content: Taro.T._(
          'This user has been verified via email. Let me see... Oh, congrats! You too!'
        ),
        showCancel: false,
        confirmText: Taro.T._('Hooray'),
        confirmColor: '#ff9800',
      })
    } else {
      const { confirm } = await Taro.showModal({
        title: Taro.T._('The Glory of Verification'),
        content: Taro.T._(
          "This user has been verified via email. His/her words is more trustworthy. Let's have a verification badge with one simple step as well?"
        ),
        cancelText: Taro.T._('Nope'),
        confirmText: Taro.T._('Go Veri'),
        confirmColor: '#ff9800',
      })
      if (confirm) {
        Taro.navigateTo({
          url: '/subpackages/profile-edit/pages/profile-edit/profile-edit',
        })
      }
    }
  }

  render() {
    return (
      <View className="badge">
        {this.props.type === 'email_verification' && this.props.status && (
          <View onClick={this.handleVeriClicked}>
            <UIcon icon-class="verified" icon="verified" />
          </View>
        )}
      </View>
    )
  }
}
