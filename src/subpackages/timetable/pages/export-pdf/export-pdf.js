import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Switch } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'
import helper from '../../../../utils/helper'
import './export-pdf.scss'

export default class ExportPdf extends Component {
  constructor(props) {
    super(props)
    this.state = {
      durations: ['Year', 'Autumn', 'Spring'],
      durationIndex: 2,
      isShowWeekend: false,
      orientations: ['Landscape', 'Portrait'],
      orientationIndex: 0,
      pageSizes: [
        `A1`,
        `A2`,
        `A3`,
        `A4`,
        `A5`,
        `Letter`,
        `HalfLetter`,
        `Ledger`,
        `Legal`,
      ],
      pageSizeIndex: 3,
    }
  }

  handleDurationChange = e => {
    const durationIndex = parseInt(e.detail.value, 10)
    this.setState({ durationIndex })
  }

  handleShowWeekendChange = e => {
    Taro.vibrateShort()
    const isShowWeekend = e.detail.value
    this.setState({ isShowWeekend })
  }

  handleOrientationChange = e => {
    const orientationIndex = parseInt(e.detail.value, 10)
    this.setState({ orientationIndex })
  }

  handlePageSizeChange = e => {
    const pageSizeIndex = parseInt(e.detail.value, 10)
    this.setState({ pageSizeIndex })
  }

  handleExport = async () => {
    const timetableInfo = Taro.getStorageSync('timetableInfo')
    let url = api._getBaseUrl() + '/timetable/pdf?'
    if (timetableInfo.level === 0) {
      // year 1
      url += 'name=' + timetableInfo.group
    } else {
      // year 2 +
      url += 'id=' + timetableInfo.student_id
    }

    url +=
      '&duration=' +
      this.state.durations[this.state.durationIndex].toLowerCase()
    if (this.state.isShowWeekend) {
      url += '&weekend=' + this.state.isShowWeekend
    }
    url +=
      '&orientation=' +
      this.state.orientations[this.state.orientationIndex].toLowerCase()
    url += '&pageSize=' + this.state.pageSizes[this.state.pageSizeIndex]

    Taro.showLoading({ title: Taro.T._('Generating'), mask: true })
    try {
      url = await api.Short.get({ url })
      Taro.hideLoading()
      await helper.openWebLink(url)
    } catch (e) {
      const { message } = JSON.parse(e.message)
      Taro.hideLoading()
      Taro.showToast({
        title: `${Taro.T._('Failed')}: ${message}`,
        icon: 'none',
      })
    }
  }

  render() {
    return (
      <View className="export-pdf-file">
        <Navigation title={Taro.T._('Export to PDF')} />

        <View className="hint">{Taro.T._('Options')}</View>
        <Picker
          mode="selector"
          range={this.state.durations}
          onChange={this.handleDurationChange}
        >
          <View className="list-item">
            <View className="name">{Taro.T._('Duration')}</View>
            <View className="input">
              {this.state.durations[this.state.durationIndex]}
            </View>
            <UIcon icon-class="icon" icon="enter" />
          </View>
        </Picker>

        <View className="list-item">
          <View className="name">{Taro.T._('Show Weekend')}</View>
          <View>
            <Switch
              color="#ff9800"
              checked={this.state.isShowWeekend}
              onChange={this.handleShowWeekendChange}
            />
          </View>
        </View>

        <View className="hint">{Taro.T._('Page')}</View>
        <Picker
          mode="selector"
          range={this.state.orientations}
          onChange={this.handleOrientationChange}
        >
          <View className="list-item">
            <View className="name">{Taro.T._('Orientation')}</View>
            <View className="input">
              {this.state.orientations[this.state.orientationIndex]}
            </View>
            <UIcon icon-class="icon" icon="enter" />
          </View>
        </Picker>

        <Picker
          mode="selector"
          range={this.state.pageSizes}
          onChange={this.handlePageSizeChange}
        >
          <View className="list-item">
            <View className="name">{Taro.T._('Page Size')}</View>
            <View className="input">
              {this.state.pageSizes[this.state.pageSizeIndex]}
            </View>
            <UIcon icon-class="icon" icon="enter" />
          </View>
        </Picker>

        <View className="gap" />

        <Btn
          type="primary"
          size="long"
          text={Taro.T._('Export')}
          onClick={this.handleExport}
        />
      </View>
    )
  }
}
