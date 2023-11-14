import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Switch } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'
import helper from '../../../../utils/helper'

import './export-ical.scss'

const typeIndexMap = {
  display: 0,
  audio: 1,
}
const triggerIndexMap = {
  0: 0,
  300: 1,
  600: 2,
  900: 3,
  1800: 4,
  3600: 5,
  7200: 6,
}

export default class ExportPdf extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAlarmEnabled: false,
      types: [Taro.T._('Display'), Taro.T._('Audio')],
      typeIndex: 0,
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
    // this.initLink()
  }

  // initLink = async () => {
  //   const webcalLink = await api.Timetable.getICalLink({ type: 'webcal' })
  //   const downloadLink = await api.Timetable.getICalLink({ type: 'http' })
  //
  //   console.log({ webcalLink, downloadLink })
  // }

  initConfig = async () => {
    Taro.showLoading({ title: Taro.T._('Loading') })
    let config
    try {
      config = await api.Timetable.getConfig()
      Taro.hideLoading()
      this.setState({
        isAlarmEnabled: config.i_cal_alarm_enable,
        typeIndex: typeIndexMap[config.i_cal_alarm_type],
        triggerIndex: triggerIndexMap[config.i_cal_alarm_trigger],
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

  handleTypeChange = e => {
    const typeIndex = parseInt(e.detail.value, 10)
    this.setState({ typeIndex })
  }

  handleTriggerChange = e => {
    const triggerIndex = parseInt(e.detail.value, 10)
    this.setState({ triggerIndex })
  }

  handleSync = async () => {
    Taro.showLoading({ title: Taro.T._('Loading') })
    const findKeyByValue = (object, value) =>
      Object.keys(object).find(key => object[key] === value)
    try {
      await api.Timetable.setConfig({
        iCalEnable: this.state.isAlarmEnabled,
        iCalType: findKeyByValue(typeIndexMap, this.state.typeIndex),
        iCalTrigger: parseInt(
          findKeyByValue(triggerIndexMap, this.state.triggerIndex),
          10,
        ),
      })
      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
      const { message } = JSON.parse(e.message)
      Taro.showToast({ title: message, icon: 'none' })
    }
  }

  handleExport = async () => {
    const { tapIndex } = await Taro.showActionSheet({
      itemList: [Taro.T._('Subscribe'), Taro.T._('Download')],
    })
    if (tapIndex === 0) {
      // Subscription Link
      const webcalLink = await api.Timetable.getICalLink({ type: 'webcal' })

      await helper.openWebLink(webcalLink)
    } else if (tapIndex === 1) {
      // File Link
      const downloadLink = await api.Timetable.getICalLink({ type: 'http' })

      await helper.openWebLink(downloadLink)
    }
  }

  render() {
    return (
      <View className="export-ical-file">
        <Navigation title={Taro.T._('Export to iCal')} />

        <View className="hint">{Taro.T._('Export to iCal')}</View>

        <View className="list-item" onClick={this.handleExport}>
          <View className="name">{Taro.T._('Premium Customized Export')}</View>
          <UIcon icon-class="icon" icon="enter" />
        </View>

        <View className="hint">{Taro.T._('Settings')}</View>

        <View className="list-item">
          <View className="name">{Taro.T._('Alarm')}</View>
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
            range={this.state.types}
            onChange={this.handleTypeChange}
          >
            <View className="list-item">
              <View className="name">{Taro.T._('Type')}</View>
              <View className="input">
                {this.state.types[this.state.typeIndex]}
              </View>
              <UIcon icon-class="icon" icon="enter" />
            </View>
          </Picker>
        )}

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

        <View className="gap" />

        <Btn
          type="primary"
          size="long"
          text={Taro.T._('Sync')}
          onClick={this.handleSync}
        />

      </View>
    )
  }
}
