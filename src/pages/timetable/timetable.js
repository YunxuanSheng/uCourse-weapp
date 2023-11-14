import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../components/Navigation/Navigation'
import Table from './components/Table/Table'
import Btn from '../../components/Btn/Btn'
import Abnor from '../../components/Abnor/Abnor'
import UIcon from '../../components/UIcon/UIcon'
// import FixedBtn from './components/FixedBtn/FixedBtn'
import Landscape from './components/Landscape/Landscape'
import time from '../../utils/time'
import api from '../../utils/api'
import PopUp from '../../components/PopUp/PopUp'
import moment from 'moment'

import './timetable.scss'

export default class Timetable extends Component {
  config = {
    pageOrientation: 'auto',
  }

  state = {
    errorCode: 200,
    dataSource: Taro.getStorageSync('timetableCache'),
    isoWeek: time.moment().isoWeek(),
    deviceOrientation: 'portrait', // portrait, landscape
  }

  componentDidShow() {
    this.fetchTimetable(this.state.dataSource.length === 0)
  }

  // onResize(res) {
  //   console.log(res)
  //   this.setState({ deviceOrientation: res.deviceOrientation })
  // }
  // disable landsacpe mode due to bugs

  fetchNotice = async () => {
    let res = await api.Timetable.getNotice()
    try {
      let latestNT = parseInt(Taro.getStorageSync('latestNT')) || 0
      if (parseInt(res[0].timestamp) > latestNT && res[0].content != '') {
        await Taro.showModal({
          title: '提示',
          content: res[0].content,
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#ff9800',
        })
        Taro.setStorageSync('latestNT', res[0].timestamp)
      }
    } catch (e) {
      await Taro.showModal({
        title: '错误',
        content: '无法获取公告信息',
        showCancel: false,
        confirmText: '确认',
        confirmColor: '#ff9800',
      })
    }
  }

  fetchExam = async () => {
    const lastTime = Taro.getStorageSync('ExamAddedLastTime') || 0
    const currentTime = moment()
    if (!(lastTime && currentTime.diff(lastTime, 'hours') < 24)) {
      await api.Timetable.addExamsToCustomActivities()
      Taro.setStorageSync('ExamAddedLastTime', moment())
    }
  }

  fetchTimetable = async (showLoading = true) => {
    await this.fetchExam()
    let res
    try {
      showLoading && Taro.showLoading({ title: Taro.T._('Loading') })
      res = await api.Timetable.browse()
      this.setState({ errorCode: 200 })
    } catch (e) {
      const { errorCode, message } = JSON.parse(e.message)
      this.setState({ errorCode })
      console.log(message)
      if (errorCode === 151) {
        // Can't find student_id for the current user.
      } else if (errorCode === 152) {
        // Can't access timetable now. (network issue.)
      } else if (errorCode === 153) {
        // Cannot find this student's timetable from official. (400 bad request from timetable.)
      }
    } finally {
      if (res) {
        this.setState({ dataSource: res })
        Taro.setStorageSync('timetableCache', res)
      } else {
        // Taro.removeStorageSync('timetableCache')
      }
      showLoading && Taro.hideLoading()
      this.fetchNotice()
    }
  }

  handleWeekChange = diff => {
    this.setState(prevState => ({ isoWeek: prevState.isoWeek + diff }))
  }

  navToSetting = () => {
    Taro.navigateTo({
      url: '/subpackages/settings/pages/settings-timetable/settings-timetable',
    })
  }

  navToPromotion = () => {
    api.Log.post({
      type: 'ad',
      description: 'user clicked on timetable ad',
      info: {},
    })
    Taro.navigateTo({
      url: `/subpackages/web-view-page/pages/web-view-page/web-view-page?url=https://mp.weixin.qq.com/s/0JLp2GVxATjHxzwaAhBPPg`,
    })
  }

  render() {
    return (
      <View className="timetable-page">
        {this.state.deviceOrientation === 'portrait' && (
          <View>
            <Navigation>
              <View className="nav">
                <View className="setup-icon">
                  <Btn onClick={this.navToSetting}>
                    <UIcon icon="setup" />
                  </Btn>
                </View>
                {/* <View className="promotion-icon">
                  <Btn onClick={this.navToPromotion}>
                    <Image
                      src="../../assets/orange.png"
                      className="promotion-img"
                    />
                  </Btn>
                </View> */}
                <View className="segments">
                  <View
                    className="segment"
                    onClick={this.handleWeekChange.bind(this, -1)}
                  >
                    {Taro.T._('Last Week')}
                  </View>
                  <View
                    className="segment"
                    onClick={this.handleWeekChange.bind(this, 1)}
                  >
                    {Taro.T._('Next Week')}
                  </View>
                </View>
              </View>
            </Navigation>

            {/* <View className="fixed-btn">
          <FixedBtn />
        </View> */}

            {this.state.errorCode === 200 && (
              <Table
                dataSource={this.state.dataSource}
                schoolWeek={this.state.schoolWeek}
                isoWeek={this.state.isoWeek}
              />
            )}

            {this.state.errorCode === 151 && (
              <Abnor
                type="MESSAGE"
                title={Taro.T._("You haven't set your student ID")}
                btnText={Taro.T._('Initialize My Timetable')}
                url="/subpackages/settings/pages/settings-timetable/settings-timetable"
              />
            )}

            {this.state.errorCode === 153 && (
              <Abnor
                type="MESSAGE"
                title={Taro.T._("Can't find this timetable")}
                btnText={Taro.T._('Reset My Timetable')}
                url="/subpackages/settings/pages/settings-timetable/settings-timetable"
              />
            )}

            {this.state.errorCode === 157 && (
              <Abnor
                type="MESSAGE"
                title={Taro.T._("Timetable hasn't been initialized.")}
                btnText={Taro.T._('Initialize My Timetable')}
                url="/subpackages/settings/pages/settings-timetable/settings-timetable"
              />
            )}
          </View>
        )}

        {this.state.deviceOrientation === 'landscape' && (
          <Landscape dataSource={this.state.dataSource} />
        )}
      </View>
    )
  }
}
