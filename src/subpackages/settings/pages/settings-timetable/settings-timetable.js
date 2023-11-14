import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Input, Switch, Checkbox } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import { getStats, getExamStats } from './utils'
import { examPalette, palette } from './palette'
import api from '../../../../utils/api'
import helper from '../../../../utils/helper'

import './settings-timetable.scss'

export default class SettingsTimetable extends Component {
  state = {
    hasInfoChanged: false,
    studentId: '',
    sources: [
      { name: 'Student ID (Year 2-4)', id: 'studentId' },
      { name: 'Group (Year 1)', id: 'groupName' },
      // { name: 'Department', id: 'department' },
      { name: 'Plan', id: 'plan' },
    ],
    sourceIndex: 0,
    sourceValues: [],
    sourceValueIndex: 0,
    viewModes: [
      Taro.T._('Table View'),
      // Taro.T._('List View'),
    ],
    viewModeIndex: 0,
    periods: [
      { start: 9, end: 18, name: '09:00 ~ 18:00' },
      { start: 9, end: 17, name: '09:00 ~ 17:00' },
      { start: 9, end: 21, name: '09:00 ~ 21:00' },
      { start: 8, end: 24, name: '08:00 ~ 24:00' },
      { start: 8, end: 12, name: '08:00 ~ 12:00' },
      { start: 12, end: 17, name: '12:00 ~ 17:00' },
      { start: 17, end: 24, name: '17:00 ~ 24:00' },
    ],
    periodIndex: 0,
    isShowWeekend: false,
    isFitScreen: true,
    hasTimetable: false,
  }

  componentWillMount() {
    this.initInfo()
    this.initConfig()
  }

  initInfo = async () => {
    /** timetable info should be separated from user info. */
    const info = await api.Timetable.getInfo()
    console.log(info)
    if (info.source) {
      const sourceIndex = this.state.sources.findIndex(
        s => s.id === info.source
      )
      // just in case not found
      if (sourceIndex >= 0) {
        this.setState({ sourceIndex }, async () => {
          if (sourceIndex === 0) {
            this.setState({ studentId: info.id })
          } else {
            const getSourcesCallback = () => {
              const sourceValueIndex = this.state.sourceValues.findIndex(
                sv => sv.id === info.id
              )
              if (sourceValueIndex >= 0) {
                this.setState({ sourceValueIndex })
              }
            }
            await this.getSources(getSourcesCallback)
          }
        })
      }
    }
    // const info = await api.Timetable.getInfo()
    // if (info.hexId) {
    //   this.setState({ hexId: info.hexId })
    // }
    if (info.activities && info.activities.length > 0) {
      this.setState({ hasTimetable: true })
    }
  }

  initConfig = () => {
    const timetableConfig = Taro.getStorageSync('timetableConfig') || {}
    if (timetableConfig.viewModeIndex !== undefined) {
      this.setState({
        viewModeIndex: timetableConfig.viewModeIndex,
      })
    }
    if (timetableConfig.period !== undefined) {
      this.setState({
        periodIndex: this.state.periods.findIndex(
          p => JSON.stringify(p) === JSON.stringify(timetableConfig.period)
        ),
      })
    }
    if (timetableConfig.isShowWeekend !== undefined) {
      this.setState({
        isShowWeekend: timetableConfig.isShowWeekend,
      })
    }
    if (timetableConfig.isFitScreen !== undefined) {
      this.setState({ isFitScreen: timetableConfig.isFitScreen })
    }
  }

  getSources = async (callback=null) => {
    const sourceValues = await api.Timetable.getSources({
      sourceName: this.state.sources[this.state.sourceIndex].id,
    })
    if (!callback) callback = () => {};
    this.setState({ sourceValues, sourceValueIndex: 0 }, callback)
  }

  // handleHexIdInput = e => {
  //   this.setState({ hexId: e.detail.value, hasInfoChanged: true })
  // }

  handleIndexChange = (stateName, hasInfoChanged = false) => e => {
    this.setState({
      [stateName]: parseInt(e.detail.value, 10),
      hasInfoChanged,
    },
    () => {
      if (stateName === 'sourceIndex') {
        this.getSources()
      }
    })
  }

  handleSIdInput = e => {
    this.setState({ studentId: e.detail.value, hasInfoChanged: true })
  }

  handleSwitchChange = stateName => e => {
    Taro.vibrateShort()
    this.setState({ [stateName]: e.detail.value })
  }

  // handleSave = async () => {
  //   let hexId = this.state.hexId

  //   // const regexWeb = /^((http):\/\/)+timetablingunnc+\.nottingham+\.ac+\.uk:8005+(\/reporting)+(\/Individual)+\;Student+\+Set+\;id+\;[A-Z0-9]{32}[?]days[=]1[-]5+\&weeks[=]2[-]14[&]+periods[=]1[-]24+\&template[=]Student[+]Set[+]Individual+\&height[=]100+\&week[=]100/;
  //   const regexHexId = /[A-Z0-9]{32}/
  //   const match = hexId.match(regexHexId)
  //   if (match && match.length === 1) {
  //     hexId = match[0]
  //   } else {
  //     await Taro.showModal({
  //       title: Taro.T._('The Glory of Verification'),
  //       content: Taro.T._('Oops! This user has not set the Hex ID correctly!'),
  //       showCancel: false,
  //       confirmText: Taro.T._('Ok'),
  //       confirmColor: '#ff9800',
  //     })
  //     hexId = ''
  //     return
  //   }

  handleSave = async () => {
    let willUpdateToCloud = false
    if (this.state.hasInfoChanged) {
      const { confirm } = await Taro.showModal({
        title: Taro.T._('Re-Sync from Official Timetable'),
        content: Taro.T._(
          'Changes to info are detected. Are you sure you want to re-sync from official timetable? This will erase your current custom changes. (E.g. course addition/deletion.)'
        ),
        cancelText: Taro.T._('No Sync'),
        confirmText: Taro.T._('OK'),
        confirmColor: '#ff9800',
      })
      willUpdateToCloud = confirm
    }

    Taro.showLoading({ title: Taro.T._('Saving'), mask: true })
    // set timetable config
    const timetableConfig = Taro.getStorageSync('timetableConfig') || {}
    timetableConfig.viewModeIndex = this.state.viewModeIndex
    timetableConfig.period = this.state.periods[this.state.periodIndex]
    timetableConfig.isShowWeekend = this.state.isShowWeekend
    timetableConfig.isFitScreen = this.state.isFitScreen
    Taro.setStorageSync('timetableConfig', timetableConfig)

    // update timetable info to server
    // no
    if (!willUpdateToCloud) {
    // if (!regexHexId.test(hexId)) {
      Taro.hideLoading()
      Taro.navigateBack()
      return
    }

    // yes
    try {
      await api.Timetable.save({
        // hexId,
        source: this.state.sources[this.state.sourceIndex].id,
        id:
          this.state.sourceIndex === 0
            ? this.state.studentId
            : this.state.sourceValues[this.state.sourceValueIndex].id,
      })
      if (this.state.sourceIndex === 0) {
        const { studentId } = this.state
        await api.Users.update({ studentId })
      }

      Taro.navigateBack()
    } catch (e) {
      const { errorCode } = JSON.parse(e.message)
      if (errorCode === 152) {
        // Can't access timetable now. (network issue.)
        Taro.showToast({
          title: Taro.T._("Can't access timetable now"),
          icon: 'none',
        })
      } else if (errorCode === 153) {
        // Cannot find this student's timetable from official. (400 bad request from timetable.)
        Taro.showToast({
          title: Taro.T._("Can't find this timetable"),
          icon: 'none',
        })
      }
    } finally {
      Taro.hideLoading()
    }
  }
  isVip = async () => {
    const userInfo = Taro.getStorageSync('userInfo')
    const openid = userInfo.openid
    const isVipUser = await api.Timetable.verifyVip({ openid })
    // console.log(isVipUser);
    if (!isVipUser) {
      Taro.showToast({
        title: Taro.T._('You are not a VIP user.'),
        icon: 'none',
      })
      return false
    }

    return true
  }
  isExportPermitted = () => {
    if (!this.state.hasTimetable) {
      Taro.showToast({
        title: Taro.T._('Please initialize your timetable first'),
        icon: 'none',
      })
      return true
    } else {
      return false
    }
  }

  navToExportToPdf = () => {
    if (!this.isExportPermitted()) {
      Taro.navigateTo({
        url: '/subpackages/timetable/pages/export-pdf/export-pdf',
      })
    }
  }

  navToExportToICal = async () => {
    const res = await this.isVip()
    if (!res) {
      return
    }

    if (!this.isExportPermitted()) {
      Taro.navigateTo({
        url: '/subpackages/timetable/pages/export-ical/export-ical',
      })
    }
  }

  navToAddCustomActivity = async () => {
    if (await this.isVip())
      Taro.navigateTo({
        url:
          '/subpackages/timetable/pages/add-custom-activity/add-custom-activity',
      })
  }

  navToWeChatReminder = () => {
    if (!this.isExportPermitted()) {
      Taro.navigateTo({
        url: '/subpackages/timetable/pages/wechat-reminder/wechat-reminder',
      })
    }
  }

  navToExamShare = async () => {
    Taro.showLoading({ title: Taro.T._('Loading') })
    const myExams = await api.Timetable.getExams()
    const url = await api.Qr.get({
      page: 'pages/timetable/timetable',
      scene: 1,
      auto_color: true,
    })
    const stats = getExamStats(myExams)
    const newPalette = JSON.parse(
      JSON.stringify(examPalette)
        .replace(/__NUMOFEXAMS__/g, stats.numOfExams)
        .replace(/__NUMOFHOURS__/g, stats.numOfHours)
        .replace(/__ONLINENUMBER__/g, stats.numOfOnlineExams)
        .replace(/__FIRST__/g, stats.numOfExamsWording)
        .replace(/__SECOND__/g, stats.goHomeDateWording)
        .replace(/__THIRD__/g, stats.dateSpanWording)
        .replace(/__FOOTNOTE__/g, stats.footnote)
        .replace(/\n/g, '')
        .replace(/\t/g, '')
    )
    Taro.setStorageSync('palette', newPalette)
    Taro.navigateTo({
      url: '/subpackages/share/pages/share/share?login=true&url=' + url,
    })
    Taro.hideLoading()
  }

  navToChangeBackground = async () => {
    const res = await this.isVip()
    if (!res) {
      return
    }
    Taro.navigateTo({
      url: '/subpackages/timetable/pages/change-background/change-background',
    })
  }

  navToShare = async () => {
    if (!this.isExportPermitted()) {
      Taro.showLoading({ title: Taro.T._('Loading') })
      try {
        const url = await api.Qr.get({
          page: 'pages/timetable/timetable',
          scene: 1,
          auto_color: true,
        })
        const myActivities = Taro.getStorageSync('timetableCache')
        // calculate wordings
        const stats = getStats(myActivities)

        const newPalette = JSON.parse(
          JSON.stringify(palette)
            .replace(/__NUMOFCOURSES__/g, stats.numOfCourses)
            .replace(/__NUMOFHOURS__/g, stats.numOfHours)
            .replace(/__RANKING__/g, stats.ranking + '%')
            .replace(/__MORNING__/g, stats.morningsWording)
            .replace(/__PERWEEK__/g, stats.perWeekWording)
            .replace(/__BUSIEST__/g, stats.busiestWording)
            .replace(/__FOOTNOTE__/g, stats.footnote)
            .replace(/\n/g, '')
            .replace(/\t/g, '')
        )
        Taro.setStorageSync('palette', newPalette)
        Taro.navigateTo({
          url: '/subpackages/share/pages/share/share?login=true&url=' + url,
        })
        Taro.hideLoading()
      } catch (e) {
        Taro.hideLoading()
      }
    }
  }

  async showLink() {
    // copy
    const url = 'https://github.com/Steven1677/nottingtable-flask/'

    await Taro.showModal({
      title: url.length < 25 ? url : '',
      content:
        Taro.T._(
          'Timetable service and free export supported by UNNC ITIP Nottingtable project. Free export does not support customized activities or alarms.'
        ) +
        '\n' +
        url,
      showCancel: true,
      cancelText: Taro.T._('OK'),
      confirmText: Taro.T._('Copy Link'),
      confirmColor: '#FF9800',
      success: async res => {
        if (res.confirm) {
          await Taro.setClipboardData({
            data: url,
          })
        }
      },
    })
  }

  handleFreeExport = async () => {
    let source = this.state.sources[this.state.sourceIndex].id;
    let id =
      this.state.sourceIndex === 0
        ? this.state.studentId
        : this.state.sourceValues[this.state.sourceValueIndex].id;

    const url = await api.Timetable.getFreeIcalLink({
      // hexId,
      id,
      source,
    })
    await helper.openWebLink(url)
  }

  handleExamExport = async () => {
    await api.Timetable.addExamsToCustomActivities()
    const url = await api.Timetable.getExamICalLink()
    await helper.openWebLink(url)
  }

  addExamsToCustomActivities = async () => {
    await api.Timetable.addExamsToCustomActivities()
    Taro.showToast({
      title: '完成',
      icon: 'none',
    })
  }

  // showMdHint = () => {
  //   Taro.navigateTo({
  //     url: '/subpackages/course/pages/course-search-md/course-search-md',
  //   })
  // }

  render() {
    return (
      <View className="settings-timetable-page">
        <Navigation title={Taro.T._('Timetable Settings')} />

        <View className="hint">{Taro.T._('Personal Info')}</View>
        
        <Picker
          mode="selector"
          range={this.state.sources}
          rangeKey="name"
          value={this.state.sourceIndex}
          onChange={this.handleIndexChange('sourceIndex', true)}
        >
          <View className="list-item">
            <View className="name">{Taro.T._('Find by')}</View>
            <View className="input">
              {this.state.sources[this.state.sourceIndex] &&
                this.state.sources[this.state.sourceIndex].name}
            </View>
            <UIcon icon-class="icon" icon="enter" />
          </View>
        </Picker>

        {/* Hex id */}
        {/* <View className="list-item">
          <View className="name">{Taro.T._('Hex ID')}</View>
          <Input
            className="input"
            value={this.state.hexId}
            placeholder={`${Taro.T._('Input Hex ID')}`}
            maxlength={10000}
            autoHeight
            onInput={this.handleHexIdInput}
          />
        </View> */}
        {/* student id */}
        {this.state.sourceIndex === 0 && (
          <View className="list-item">
            <View className="name">{Taro.T._('Student ID')}</View>
            <Input
              className="input"
              type="number"
              value={this.state.studentId}
              placeholder={`${Taro.T._(
                'Input student ID'
              )}(e.g. 16522132, 20023333)`}
              onInput={this.handleSIdInput}
            />
          </View>
        )}
        {/* source picker */}
        {this.state.sourceIndex !== 0 && (
          <Picker
            mode="selector"
            range={this.state.sourceValues}
            rangeKey="name"
            value={this.state.sourceValueIndex}
            onChange={this.handleIndexChange('sourceValueIndex', true)}
          >
            <View className="list-item">
              <View className="input">
                {this.state.sourceValues[this.state.sourceValueIndex]
                  ? this.state.sourceValues[this.state.sourceValueIndex].name
                  : Taro.T._('Loading')}
              </View>
              <UIcon icon-class="icon" icon="enter" />
            </View>
          </Picker>
        )}
        {/* <View className="get-hexID" onClick={this.showMdHint}>
          {Taro.T._('How to Get Hex ID?')}
        </View> */}
        <View className="gap" />
        <View className="hint">{Taro.T._('Preference')}</View>
        <Picker
          mode="selector"
          range={this.state.viewModes}
          value={this.state.viewModeIndex}
          onChange={this.handleIndexChange('viewModeIndex')}
        >
          <View className="list-item">
            <View className="name">{Taro.T._('Mode')}</View>
            <View className="input">
              {this.state.viewModes[this.state.viewModeIndex]}
            </View>
            <UIcon icon-class="icon" icon="enter" />
          </View>
        </Picker>
        {this.state.viewModeIndex === 0 && (
          <Picker
            mode="selector"
            range={this.state.periods}
            rangeKey="name"
            value={this.state.periodIndex}
            onChange={this.handleIndexChange('periodIndex')}
          >
            <View className="list-item">
              <View className="name">{Taro.T._('Period')}</View>
              <View className="input">
                {this.state.periods[this.state.periodIndex] &&
                  this.state.periods[this.state.periodIndex].name}
              </View>
              <UIcon icon-class="icon" icon="enter" />
            </View>
          </Picker>
        )}
        {this.state.viewModeIndex === 0 && (
          <View className="list-item">
            <View className="name">{Taro.T._('Show Weekend')}</View>
            <View>
              <Switch
                color="#ff9800"
                checked={this.state.isShowWeekend}
                onChange={this.handleSwitchChange('isShowWeekend')}
              />
            </View>
          </View>
        )}
        {this.state.viewModeIndex === 0 && (
          <View className="list-item">
            <View className="name">{Taro.T._('Fit Screen')}</View>
            <View>
              <Switch
                color="#ff9800"
                checked={this.state.isFitScreen}
                onChange={this.handleSwitchChange('isFitScreen')}
              />
            </View>
          </View>
        )}

        <View className="list-item">
          <View className="name">{Taro.T._('Force to Update')}</View>
          <View>
            <Switch
              color="#ff9800"
              checked={this.state.hasInfoChanged}
              onChange={this.handleSwitchChange('hasInfoChanged')}
            />
          </View>
        </View>

        <View className="gap" />

        <Btn
          type="primary"
          size="long"
          text={Taro.T._('Save')}
          onClick={this.handleSave}
          // disabled={!this.state.hexId}
          disabled={this.state.sourceIndex === 0 && !this.state.studentId}
        />

        <View className="hint">{Taro.T._('Services')}</View>
        {/* <View className="list-item" onClick={this.navToExamShare}>
          <View className="name">🔥 考试统计</View>
          <UIcon icon-class="icon" icon="enter" />
        </View>
        <View className="list-item" onClick={this.handleExamExport}>
          <View className="name">将考试日程导出为日历</View>
          <UIcon icon-class="icon" icon="enter" />
        </View>
        <View className="list-item" onClick={this.addExamsToCustomActivities}>
          <View className="name">重新添加考试日程到课表</View>
          <UIcon icon-class="icon" icon="enter" />
        </View> */}
        {/* <View className="list-item" onClick={this.navToShare}>
          <View className="name">🔥 {Taro.T._('Statistics')}</View>
          <UIcon icon-class="icon" icon="enter" />
        </View> */}
        <View className="list-item" onClick={this.navToWeChatReminder}>
          <View className="name">{Taro.T._('WeChat Reminder')}</View>
          <UIcon icon-class="icon" icon="enter" />
        </View>
        <View className="list-item" onClick={this.navToChangeBackground}>
          <View className="name">
            {Taro.T._('Change Timetable Background (VIP)')}
          </View>
          <UIcon icon-class="icon" icon="enter" />
        </View>
        {/* <View className="list-item" onClick={this.navToExportToPdf}>
          <View className="name">{Taro.T._('Export to PDF')}</View>
          <UIcon icon-class="icon" icon="enter" />
        </View> */}
        <View className="list-item" onClick={this.navToAddCustomActivity}>
          <View className="name">{Taro.T._('Add DIY Timetable (VIP)')}</View>
          <UIcon icon-class="icon" icon="enter" />
        </View>
        <View className="list-item" onClick={this.navToExportToICal}>
          <View className="name">
            {Taro.T._('Customized Timetable Export to iCal (VIP)')}
          </View>
          <UIcon icon-class="icon" icon="enter" />
        </View>

        <View className="hint">{Taro.T._('Nottingtable')}</View>

        <View className="list-item" onClick={this.handleFreeExport}>
          <View className="name">{Taro.T._('Free Export to iCal')}</View>
          <UIcon icon-class="icon" icon="enter" />
        </View>

        <View className="list-item" onClick={this.showLink}>
          <View className="name">{Taro.T._('Link')}</View>
          <UIcon icon-class="icon" icon="enter" />
        </View>

        <View className="gap" />
        <View className="gap" />
        <View className="gap" />
      </View>
    )
  }
}
