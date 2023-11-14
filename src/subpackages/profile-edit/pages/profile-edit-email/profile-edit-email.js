import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'

import './profile-edit-email.scss'

export default class ProfileEditEmail extends Component {
  state = {
    emailSuffixList: ['@nottingham.edu.cn', '@nottingham.ac.uk'],
    emailSuffix: '@nottingham.edu.cn',
    email: '',
    code: '',
    sendBtnText: '发送验证码',
    emailSentTimeStamp: Date.now(),
    sendBtnDisabled: true,
    is_verified: true,
  }

  componentWillMount() {
    this.setState({
      sendBtnText: Taro.T._('Send Vericode'),
    })
  }

  componentDidShow() {
    let { email, is_verified } = Taro.getStorageSync('userInfo')
    if (email) {
      const suffix = '@' + email.split('@')[1]
      const prefix = email.split('@')[0]

      this.setState({ email: prefix, emailSuffix: suffix, is_verified })
    } else {
      this.setState({ is_verified })
    }

    const emailSentTimeStamp = Taro.getStorageSync('emailSentTimeStamp') || 0
    this.setState({ emailSentTimeStamp })
    this.startCountDown()
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }

  handleInputEmail = e => {
    const { value } = e.detail
    // console.log(value)
    this.setState({ email: value })
  }

  handleInputCode = e => {
    const { value } = e.detail
    // console.log(value)
    this.setState({ code: value })
  }

  handleSend = async () => {
    try {
      let { email } = this.state
      const hasSuffix = email.replace(/ /g, '').includes('@')
      if (!hasSuffix) {
        // adding suffix
        email += this.state.emailSuffix
        Taro.showLoading({ title: Taro.T._('Sending'), mask: true })
        await api.Users.update({ email })
        Taro.hideLoading()
        Taro.showToast({
          title: Taro.T._('Please check your email inbox'),
          icon: 'success',
        })

        const emailSentTimeStamp = Date.now()
        this.setState({ emailSentTimeStamp })
        Taro.setStorage({ key: 'emailSentTimeStamp', data: emailSentTimeStamp })
        this.startCountDown()
      } else {
        Taro.showToast({
          title: Taro.T._('No need to add suffix'),
          icon: 'none',
        })
      }
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({
        title: Taro.T._('Unknown error. Please try again'),
        icon: 'none',
      })
    }
  }

  handleSubmit = async () => {
    try {
      Taro.showLoading({ title: Taro.T._('Verifying'), mask: true })
      const isSuccess = await api.Email.verify({ code: this.state.code })
      Taro.hideLoading()
      if (isSuccess) {
        Taro.showLoading({ title: Taro.T._('Updating'), mask: true })
        await api.Users.update()
        Taro.hideLoading()
        Taro.navigateBack()
      } else {
        Taro.showToast({
          title: Taro.T._('Incorrect code. Please try again.'),
          icon: 'none',
        })
      }
    } catch (e) {
      Taro.showToast({
        title: Taro.T._('Verification failed. Please resend the email.'),
        icon: 'none',
      })
    }
  }

  startCountDown = () => {
    this.timer = setInterval(() => {
      const sec =
        60 - Math.floor((Date.now() - this.state.emailSentTimeStamp) / 1000)
      if (sec >= 0) {
        this.setState({
          sendBtnText: `${Taro.T._('Sent')}(${sec})`,
          sendBtnDisabled: true,
        })
      } else {
        this.setState({
          sendBtnText: Taro.T._('Send Vericode'),
          sendBtnDisabled: false,
        })
      }
    }, 1000)
  }

  handleSuffixChange = e => {
    const index = e.detail.value
    this.setState(
      {
        emailSuffix: this.state.emailSuffixList[index],
      },
      () => {
        console.log(this.state)
      }
    )
  }

  render() {
    return (
      <View className="edit-email-page">
        <Navigation title={Taro.T._('Edit Email')} />
        <View className="gap" />
        {this.state.is_verified ? (
          <View className="list-item">
            <View className="tick-icon">✅</View>
            <Input
              className="suffix"
              value={this.state.email + this.state.emailSuffix}
              focus
              onInput={this.handleInputEmail}
              disabled
            />
          </View>
        ) : (
          <View>
            <View className="list-item">
              <Input
                className="input"
                value={this.state.email}
                placeholder={Taro.T._('Input email account')}
                focus
                onInput={this.handleInputEmail}
              />
              <Picker
                className="suffix"
                mode="selector"
                range={this.state.emailSuffixList}
                onChange={this.handleSuffixChange}
              >
                <View>
                  {this.state.emailSuffix}
                  <UIcon icon="unfold" />
                </View>
              </Picker>
              <View>
                <Btn
                  type="primary"
                  size="mini"
                  text={this.state.sendBtnText}
                  onClick={this.handleSend}
                  disabled={this.state.sendBtnDisabled || !this.state.email}
                />
              </View>
            </View>
            <View className="list-item">
              <Input
                className="input input-fill"
                type="digit"
                value={this.state.code}
                placeholder={Taro.T._('Input 4 digit code')}
                onInput={this.handleInputCode}
              />
            </View>
            <View className="gap" />
            <Btn
              type="primary"
              size="long"
              text={Taro.T._('Confirm')}
              onClick={this.handleSubmit}
              disabled={this.state.code.length !== 4}
            />
          </View>
        )}
      </View>
    )
  }
}
