import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import UIcon from '../../../../components/UIcon/UIcon'
import time from '../../../../utils/time'
import helper from '../../../../utils/helper'
import './Table.scss'

const weeks = [
  Taro.T._('Mon'),
  Taro.T._('Tue'),
  Taro.T._('Wed'),
  Taro.T._('Thu'),
  Taro.T._('Fri'),
  Taro.T._('Sat'),
  Taro.T._('Sun'),
]

export default class Table extends Component {
  static defaultProps = {
    dataSource: [],
    isoWeek: time.moment().isoWeek(),
  }

  constructor(props) {
    super(props)
    this.state = {
      systemInfo: {},
      now: time.now(),
      activitiesInCurrentWeek: [],
      monthInCurrentWeek: time.now().monthShort, // Jan
      schoolWeekInCurrentWeek: helper.convertStandardWeekToSchoolWeek(), // 23
      datesInCurrentWeek: this.getDates(time.now().week), // ['11st', '12rd', ...]
      period: { start: 9, end: 18 },
      isShowWeekend: false,
      isFitScreen: true,
    }
  }

  componentWillMount() {
    this.initSystemInfo()
    this.initConfig()
    this.handleWeekChange(this.props.isoWeek)
  }

  componentWillReceiveProps(props) {
    this.initConfig()
    this.handleWeekChange(props.isoWeek)
  }

  handleWeekChange = isoWeek => {
    const monthInCurrentWeek = time
      .moment()
      .isoWeeks(isoWeek)
      .isoWeekday(1)
      .format('MMM')
    this.setState(
      {
        monthInCurrentWeek,
        schoolWeekInCurrentWeek: helper.convertStandardWeekToSchoolWeek(
          isoWeek
        ),
        datesInCurrentWeek: this.getDates(isoWeek),
      },
      () => {
        this.getActivitiesInCurrentWeek(this.props.dataSource)
      }
    )
  }

  initSystemInfo = () => {
    if (!Taro.systemInfo) {
      Taro.systemInfo = Taro.getSystemInfoSync()
    }
    this.setState({
      systemInfo: Taro.systemInfo,
    })
  }

  initConfig = () => {
    const timetableConfig = Taro.getStorageSync('timetableConfig') || {}
    if (
      timetableConfig.period &&
      timetableConfig.period.start &&
      timetableConfig.period.end
    ) {
      this.setState({ period: timetableConfig.period })
    }
    if (timetableConfig.isShowWeekend !== undefined) {
      this.setState({ isShowWeekend: timetableConfig.isShowWeekend })
    }
    if (timetableConfig.isFitScreen !== undefined) {
      this.setState({ isFitScreen: timetableConfig.isFitScreen })
    }
  }

  getDates = isoWeek => {
    // return the current shown dates
    // i.e. the moment
    const currentShownDate = time
      .moment()
      .isoWeekday(1)
      .isoWeeks(isoWeek)
    return [...Array(7).keys()].map(i =>
      currentShownDate.isoWeekday(i + 1).format('Do')
    )
  }

  getPeriods = () => {
    const { start, end } = this.state.period
    const periods = Array(end - start)
      .fill()
      .map((_, i) => start + i + ':00')
    return periods
  }

  getWeekdayPeriods = () => {
    const num = this.state.isShowWeekend ? 7 : 5
    return [...Array(num).keys()].map(i => i + 1)
  }

  getActivitiesInCurrentWeek = activities => {
    const currentWeek = this.state.schoolWeekInCurrentWeek
    const res = activities
      .filter(data => data.weeks.includes(currentWeek))
      .map(data => {
        const map = {
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
          Sunday: 7,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
          Sun: 7,
        }
        data.weekday = map[data.day]
        const [startHour, startMinute] = data.start
          .split(':')
          .map(num => parseInt(num, 10))
        data.startIndex = startHour - this.state.period.start + startMinute / 60
        // duration
        const [durationHour, durationMinute] = data.duration
          .split(':')
          .map(num => parseInt(num, 10))
        data.durationUnit = durationHour + durationMinute / 60
        // is performing
        const startMoment = this.state.now.moment
          .isoWeekday(data.weekday)
          .hour(startHour)
          .minute(startMinute)
        const endMoment = startMoment.add(data.durationUnit, 'hours')
        data.isPerforming = this.state.now.moment.isBetween(
          startMoment,
          endMoment
        )
        return data
      })
      .sort((a, b) => a.weekday > b.weekday)
    this.setState({ activitiesInCurrentWeek: res })
  }

  navToActivity = id => {
    const standardWeek = helper.convertSchoolWeekToStandardWeek(
      this.state.schoolWeekInCurrentWeek
    )
    const month = time
      .moment()
      .week(standardWeek)
      .month()
    // month for bg (for fun...)
    Taro.navigateTo({
      url:
        '/subpackages/timetable/pages/activity/activity?id=' +
        id +
        '&month=' +
        month +
        '&mode=old',
    })
  }

  render() {
    const tableHeightInPx =
      this.state.systemInfo.windowHeight -
      this.state.systemInfo.statusBarHeight -
      46
    const itemWidth = this.state.isFitScreen
      ? 700 / this.getWeekdayPeriods().length
      : 200
    const tableHeight =
      (tableHeightInPx / this.state.systemInfo.windowWidth) * 750
    const periodHeight = this.state.isFitScreen
      ? (tableHeight - 75) / (this.state.period.end - this.state.period.start)
      : 200
    
    const background_url = Taro.getStorageSync('background_url');
    const styleStr = background_url ? `height: ${tableHeightInPx}px; background-image: url('${background_url}');  background-size: 100% 100%;` : `height: ${tableHeightInPx}px;`;
    // console.log(styleStr)
    // console.log(background_url)
    return (
      <View className={background_url ? "timetable-comp" : "timetable-comp-default timetable-comp"}
        style={styleStr}>
        {/* <View className="fixed-btns">
          <View className="btn left">
            <UIcon icon="return" />
          </View>
          <View className="btn right">
            <UIcon icon="enter" />
          </View>
        </View> */}
        <View className="body">
          <View className="left-column">
            <View className="month-indicator">
              <View>{this.state.monthInCurrentWeek}</View>
              <View>{this.state.schoolWeekInCurrentWeek}周</View>
            </View>
            {this.getPeriods().map(t => {
              return (
                <View
                  key={t}
                  className="time-indicator"
                  style={`height: ${periodHeight}rpx`}
                >
                  {t}
                </View>
              )
            })}
          </View>
          <View className="content">

            {time.moment().isoWeek() === this.props.isoWeek &&
            <View 
              className="current-timeline"
              style={{
              display: ((time.now().hour+1)>this.state.period.end)?"none":"block",
              width: itemWidth*(this.state.isShowWeekend?7:5)+"rpx",
              top: Math.floor(time.getLastedHours(this.state.period.start)*periodHeight)+75+"rpx",
            }}></View>}

            {this.getWeekdayPeriods().map(weekday => {
              const activitiesInCurrentDay = this.state.activitiesInCurrentWeek.filter(
                a => a.weekday === weekday
              )
              const week = weeks[weekday - 1]
              const date = this.state.datesInCurrentWeek[weekday - 1]
              const isToday =
                this.state.monthInCurrentWeek === this.state.now.monthShort &&
                date === time.moment().format('Do')
              return (
                <View
                  key={weekday}
                  className="column"
                  style={`width: ${itemWidth}rpx`}
                >
                  <View
                    className={`week-indicator ${isToday ? 'today' : ''}`}
                    style={`width: ${itemWidth}rpx`}
                  >
                    <View>{week}</View>
                    <View className="date">{date}</View>
                  </View>
                  {activitiesInCurrentDay.map(a => {
                    const height = a.durationUnit * periodHeight
                    const top = a.startIndex * periodHeight + 75
                    const style = `height: ${height}rpx; top: ${top}rpx; width: ${itemWidth -
                      10}rpx`
                    return (
                      <View
                        key={a.activity}
                        className={`item ${a.isPerforming ? 'performing' : ''}`}
                        style={style}
                        onClick={this.navToActivity.bind(this, a.activity_id)}
                      >
                        <View className="module">{a.module}</View>
                        <View className="type">{a.name_of_type}</View>
                        <View className="room">{a.room}</View>
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}
