import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import UIcon from '../UIcon/UIcon'
import api from '../../utils/api'
import './Login.scss'

export default class Login extends Component {
  state = {
    loginBtnLoading: false,
    isSucceed: false,
  }

  static defaultProps = {
    onGotUserProfile: () => {},
  }

  handleUserProfile = async () => {
    wx.getUserProfile({
      desc: '获取发布、回复测评的身份信息',
      lang: 'zh_CN',
      success: this.onGotUserProfile,
      fail: (e) => {
        console.log(e);
      }
    })
  }

  onGotUserProfile = async e => {
    try {
      if (!e.detail.userInfo) {
        // reject
        Taro.showToast({ title: Taro.T._('Leave this stage!'), icon: 'none' })
        return
      }
      Taro.vibrateLong()
      this.setState({
        loginBtnLoading: true,
      })
      const userInfo = await api.Users.update(e.detail.userInfo)
      this.setState({
        loginBtnLoading: false,
        isSucceed: true,
      })
      Taro.showToast({
        title: Taro.T._('Welcome'),
        icon: 'none',
      })
      this.props.onGotUserProfile(userInfo)
    } catch (err) {
      this.setState({ loginBtnLoading: false })
      Taro.showToast({
        title: Taro.T._('Login failed, please try again.'),
        icon: 'none',
      })
      console.error(err)
    }
  }

  render() {
    return (
      <View>
        {!this.state.isSucceed && (
          <View className="login-comp">
            <View className="btn-container">
              <Button
                className="u-btn u-btn-success-ripple u-btn-medium u-btn-circle u-btn-shadow u-btn-transition"
                onClick={this.handleUserProfile}
                lang="zh_CN"
              >
                <UIcon icon={this.state.loginBtnLoading ? 'spin' : 'wechat'} />
                <View
                  className={`text ${
                    this.state.loginBtnLoading ? 'text-disapper' : ''
                  }`}
                >
                  {Taro.T._('Login with WeChat')}
                </View>
              </Button>
            </View>
          </View>
        )}
      </View>
    )
  }
}
