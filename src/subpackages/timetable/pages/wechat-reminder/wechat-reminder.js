import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Switch } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'

import './wechat-reminder.scss'

const triggerIndexMap = {
  0: 0,
  300: 1,
  600: 2,
  900: 3,
  1800: 4,
  3600: 5,
  7200: 6,
}

export default class Reminder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAlarmEnabled: false,
      triggers: [
        Taro.T._('At time of event'),
        Taro.T._('5 minutes before'),
        Taro.T._('10 minutes before'),
        Taro.T._('15 minutes before'),
        Taro.T._('30 minutes before'),
        Taro.T._('1 hour before'),
        Taro.T._('2 hours before'),
      ],
      triggerIndex: 2,
    }
  }

  componentWillMount() {
    this.initConfig()
  }

  initConfig = async () => {
    Taro.showLoading({ title: Taro.T._('Loading') })
    let config
    try {
      config = await api.Timetable.getConfig()
      Taro.hideLoading()
      this.setState({
        isAlarmEnabled: config.wechat_alarm_enable,
        triggerIndex: triggerIndexMap[config.wechat_alarm_trigger],
      })
    } catch (e) {
      Taro.hideLoading()
      const { message } = JSON.parse(e.message)
      Taro.showToast({ title: message, icon: 'none' })
    }
  }

  handleAlarmChange = e => {
    Taro.vibrateShort()
    const isAlarmEnabled = e.detail.value
    this.setState({ isAlarmEnabled })
  }

  handleTriggerChange = e => {
    const triggerIndex = parseInt(e.detail.value, 10)
    this.setState({ triggerIndex })
  }

  handleSave = async () => {
    Taro.showLoading({ title: Taro.T._('Loading') })
    const findKeyByValue = (object, value) =>
      Object.keys(object).find(key => object[key] === value)
    try {
      await api.Timetable.setConfig({
        wechatEnable: this.state.isAlarmEnabled,
        wechatTrigger: parseInt(
          findKeyByValue(triggerIndexMap, this.state.triggerIndex),
          10,
        ),
      })
      Taro.hideLoading()
      Taro.showToast({ title: Taro.T._('Saved') })
    } catch (e) {
      Taro.hideLoading()
      const { message } = JSON.parse(e.message)
      Taro.showToast({ title: message, icon: 'none' })
    }
  }

  render() {
    return (
      <View className="reminder">
        <Navigation title={Taro.T._('WeChat Reminder')} />

        <official-account />

        <View className="hint">{Taro.T._('Settings')}</View>

        <View className="list-item">
          <View className="name">{Taro.T._('Notification')}</View>
          <View>
            <Switch
              color="#ff9800"
              checked={this.state.isAlarmEnabled}
              onChange={this.handleAlarmChange}
            />
          </View>
        </View>

        {this.state.isAlarmEnabled && (
          <Picker
            mode="selector"
            range={this.state.triggers}
            onChange={this.handleTriggerChange}
          >
            <View className="list-item">
              <View className="name">{Taro.T._('Trigger')}</View>
              <View className="input">
                {this.state.triggers[this.state.triggerIndex]}
              </View>
              <UIcon icon-class="icon" icon="enter" />
            </View>
          </Picker>
        )}

        <View className="hint" style={{ fontWeight: 'bold' }}>
          {Taro.T._(
            'Please follow uFair official account to receive notifications. (WeChat ID: uFair-Campus).',
          )}
        </View>

        <View className="gap" />

        <Btn
          type="primary"
          size="long"
          text={Taro.T._('Save')}
          onClick={this.handleSave}
        />

        <View className="gap" />
      </View>
    )
  }
}
