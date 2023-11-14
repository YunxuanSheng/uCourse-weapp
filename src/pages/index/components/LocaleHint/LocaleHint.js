import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Btn from '../../../../components/Btn/Btn'
import './LocaleHint.scss'

export default class LocaleHint extends Component {
  state = {
    isShow: true,
  }

  componentWillMount() {
    const hasSeen = Taro.getStorageSync('hasSeenLocaleHint')
    this.setState({
      isShow: !hasSeen && Taro.T._('_name') !== '简体中文',
    })
  }

  handleIgnore = () => {
    Taro.setStorage({ key: 'hasSeenLocaleHint', data: true })
    this.setState({ isShow: false })
  }

  switchToSC = () => {
    Taro.setStorageSync('locale', 'zh_CN')
    Taro.T.setLocale('zh_CN')
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  render() {
    return (
      <View>
        {this.state.isShow && (
          <View className="hint-comp">
            <View className="content">
              {Taro.T._(
                `您当前正在以 ${Taro.T._(
                  '_name',
                )} 浏览，是否切换到简体中文界面？(You are currently browsing in English. Would you like to switch to Simplified Chinese?)`,
              )}
            </View>
            <View className="btns">
              <Btn type="default" size="medium" onClick={this.switchToSC}>
                <View className="btn-text">{Taro.T._('OK')}</View>
              </Btn>
              <Btn type="default" size="medium" onClick={this.handleIgnore}>
                <View className="btn-text">{Taro.T._(`Don't show again`)}</View>
              </Btn>
            </View>
          </View>
        )}
      </View>
    )
  }
}
