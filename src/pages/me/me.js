import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Button,
  OpenData,
  Image,
  Text,
  CheckboxGroup,
  Checkbox,
  Label,
} from '@tarojs/components'
import UIcon from '../../components/UIcon/UIcon'
import Abnor from '../../components/Abnor/Abnor'
import Capsule from './components/Capsule/Capsule'
import PropBar from './components/PropBar/PropBar'
import MyPanel from './components/MyPanel/MyPanel'
import api from '../../utils/api'
import helper from '../../utils/helper'
import './me.scss'

export default class Me extends Component {
  state = {
    // statusBarHeight: Taro.systemInfo.statusBarHeight,
    statusBarHeight: 0,
    userInfo: {},
    hasLoggedIn: true,
    loginBtnLoading: false,
    loginBtnAnimation: {},
    loginBtnText: '',
    loginBtnDisabled: false,
    isVip: false,
  }

  async componentWillMount() {
    const { statusBarHeight } = Taro.systemInfo
    this.setState({
      statusBarHeight,
      loginBtnText: Taro.T._('Login with WeChat'),
    })
    const hasLoggedIn = helper.isLoggedIn()
    this.setState({ hasLoggedIn })
    if (hasLoggedIn) {
      const userInfo = Taro.getStorageSync('userInfo')
      this.setState({ userInfo }, () => {
        this.getInfo()
      })
      console.log('userInfo:', userInfo)
      const openid = userInfo.openid
      const isVip = await api.Timetable.verifyVip({ openid })
      this.setState({ isVip })
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  componentDidShow() {
    this.getInfo()
  }

  getInfo = async () => {
    const { userInfo = {} } = this.state
    if (userInfo.nickname) {
      // use cache
      this.setState({ userInfo })
      // update info from server
      const wxUserInfo = await wx.getUserProfile({
        desc: '获取发布、回复测评的身份信息',
        lang: 'zh_CN',
      })
      if (!wxUserInfo) return;
      const newInfo = await api.Users.update(wxUserInfo.userInfo)
      this.setState({ userInfo: newInfo })
      Taro.setStorageSync('userInfo', newInfo)
    }
  }

  handleUserProfile = async () => {
    wx.getUserProfile({
      desc: '获取发布、回复测评的身份信息',
      lang: 'zh_CN',
      success: this.onGotUserProfile,
      fail: e => {
        console.log(e)
      },
    })
  }
  onGotUserProfile = async e => {
    console.log(e)
    console.log(e.userInfo)
    try {
      if (!e.userInfo) {
        // reject
        Taro.showToast({ title: Taro.T._('Leave this stage!'), icon: 'none' })
        return
      }
      Taro.vibrateLong()
      this.setState({ loginBtnLoading: true })
      const userInfo = await api.Users.update(e.userInfo)
      // let userInfo
      // await new Promise(resolve => setTimeout(resolve, 2000))
      this.setState(
        {
          loginBtnLoading: false,
          loginBtnText: Taro.T._('Welcome'),
          userInfo: userInfo,
        },
        async () => {
          const animation = Taro.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: 1000,
          })
          animation
            .scale(100, 100)
            .opacity(0)
            .step()
          this.setState({ loginBtnAnimation: animation.export() }, () => {
            this.timer = setTimeout(async () => {
              this.setState({ hasLoggedIn: true })
              // tip for improving information
              if (!userInfo.is_verified) {
                const { confirm } = await Taro.showModal({
                  title: Taro.T._('One Step to Go'),
                  content: Taro.T._(
                    'Complete your profile to get better recommendation and experience.'
                  ),
                  cancelText: Taro.T._('Later'),
                  confirmText: Taro.T._('OK👌'),
                  confirmColor: '#ff9800',
                })
                if (confirm) {
                  await Taro.navigateTo({
                    url:
                      '/subpackages/profile-edit/pages/profile-edit/profile-edit',
                  })
                }
              }
            }, 1400)
          })
        }
      )
    } catch (err) {
      this.setState({ loginBtnLoading: false })
      Taro.showToast({
        title: Taro.T._('Login failed, please try again.'),
        icon: 'none',
      })
      console.error(err)
    }
  }

  handleAgreeChange = e => {
    this.setState({ loginBtnDisabled: e.detail.value.length === 0 })
  }

  navToAgreement = async e => {
    e.stopPropagation()
    helper.openDocument('/public/agreement.pdf')
  }

  render() {
    return (
      <View className="page">
        <View style={`height: ${this.state.statusBarHeight}`} />
        <View className="header">
          <Capsule statusBarHeight={this.state.statusBarHeight} />

          <View className="bg">
            {this.state.hasLoggedIn ? (
              <Image className="avatar-bg" src={this.state.userInfo.avatar} />
            ) : (
              <View className="avatar-bg">
                <OpenData type="userAvatarUrl" />
              </View>
            )}
          </View>
          <View className="fg">
            <View className="avatar">
              {this.state.hasLoggedIn ? (
                <Image className="avatar" src={this.state.userInfo.avatar} />
              ) : (
                <View className="avatar">
                  <OpenData type="userAvatarUrl" />
                </View>
              )}
            </View>
            <View className="nickname">
              {this.state.hasLoggedIn ? (
                <View>
                  {this.state.isVip && <UIcon icon="crown"></UIcon>}
                  <Text>{this.state.userInfo.nickname}</Text>
                  {/* {this.state.isVip && (
                    <Image
                      style="width: 20px;height: 20px;margin-left:5px;"
                      src="https://ae01.alicdn.com/kf/H78e5a4c10a7d4020b4b5b631824ea6b24.jpg"
                    />
                  )} */}
                </View>
              ) : (
                <OpenData type="userNickName" />
              )}
            </View>
          </View>
        </View>

        {!this.state.hasLoggedIn ? (
          <View className="login-btn" animation={this.state.loginBtnAnimation}>
            <Abnor
              type="BOOKS"
              gray
              title={Taro.T._('Join the community, evaluate the courses!')}
            />
            <Button
              className="u-btn u-btn-success-ripple u-btn-medium u-btn-circle u-btn-shadow u-btn-transition"
              onClick={this.handleUserProfile}
              lang="zh_CN"
              disabled={this.state.loginBtnDisabled}
            >
              <UIcon icon={this.state.loginBtnLoading ? 'spin' : 'wechat'} />
              <View
                className={`text ${
                  this.state.loginBtnLoading ? 'text-disapper' : ''
                }`}
              >
                {this.state.loginBtnText}
              </View>
            </Button>
            <View className="hint">
              <CheckboxGroup onChange={this.handleAgreeChange}>
                <Label className="hint">
                  <Checkbox checked />
                  {`${Taro.T._("I've read and understood the")} `}
                  <Text className="agreement" onClick={this.navToAgreement}>
                    {Taro.T._('User Agreement')}
                  </Text>
                </Label>
              </CheckboxGroup>
            </View>
          </View>
        ) : (
          <View>
            <View className="prop-bar">
              <PropBar
                myEval={
                  this.state.userInfo.prop &&
                  this.state.userInfo.prop.eval_count
                }
                myFav={0}
                myPost={0}
                votes={
                  this.state.userInfo.prop &&
                  this.state.userInfo.prop.vote_pro_count
                }
              />
            </View>

            <View className="my-panel">
              <MyPanel />
            </View>
          </View>
        )}
      </View>
    )
  }
}
