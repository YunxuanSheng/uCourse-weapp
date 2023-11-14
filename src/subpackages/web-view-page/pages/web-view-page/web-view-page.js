import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

import './web-view-page.scss'

export default class WebViewPage extends Component {
  componentWillMount() {
    const userInfo = Taro.getStorageSync('userInfo')
    if ((this.$router.params.type = 'AD')) {
      Taro.getApp().aldstat.sendEvent('打开广告', {
        username: userInfo.nickname,
        openid: userInfo.openid,
        time: Date.now(),
      })
    }
  }

  render() {
    const { url } = this.$router.params
    return <WebView src={url} />
  }
}
