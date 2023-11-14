import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'

import helper from '../../../../utils/helper'

import './settings.scss'

export default class Settings extends Component {
  navTo = url => {
    Taro.navigateTo({ url })
  }

  openAgreement = () => {
    helper.openDocument('/public/agreement.pdf')
  }

  render() {
    return (
      <View className="edit-page">
        <Navigation title={Taro.T._('Settings')} />

        <View className="list">
          <View
            className="list-item"
            onClick={this.navTo.bind(
              this,
              '/subpackages/settings/pages/settings-language/settings-language',
            )}
          >
            <View className="left">{Taro.T._('Language')}</View>
            <View className="right">
              <UIcon icon-class="enter" icon="enter" />
            </View>
          </View>

          <View className="gap" />
          <View className="list-item" onClick={this.openAgreement}>
            <View className="left">{Taro.T._('User Agreement')}</View>
            <View className="right">
              <UIcon icon-class="enter" icon="enter" />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
