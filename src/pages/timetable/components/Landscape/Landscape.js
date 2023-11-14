import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import time from '../../../../utils/time'

import './Landscape.scss'

export default class Landscape extends Component {
  static defaultProps = {
    dataSource: [],
    mode: 'landscape', // 'landscape', 'card'
  }

  state = {
    isLoaded: false,
    comingNext: {},
  }

  componentWillMount() {
    this.init(this.props.dataSource)
  }

  componentWillReceiveProps(props) {
    this.init(props.dataSource)
  }

  init = dataSource => {
    if (dataSource.length === 0) {
      // try again (maybe in card mode)
      dataSource = Taro.getStorageSync('timetableCache')
    }
    const performings = []
    let comingNext
    let minDiff
    for (let activity of dataSource) {
      for (let event of activity.events) {
        const isBetween = time.moment().isBetween(event.start, event.end)
        if (isBetween) {
          activity.event = event // inject this event
          performings.push(activity)
        } else {
          // check diff for next
          const diff = time.moment(event.start).diff(time.moment()) // diff > 0 if future
          if (diff > 0 && (!minDiff || minDiff > diff)) {
            activity.event = event // inject this event
            comingNext = activity
            minDiff = diff
          }
        }
      }
    }
    console.log(performings, comingNext)

    this.setState({
      // TODO:
      comingNext: performings.length > 0 ? performings[0] : comingNext,
      performings,
      isLoaded: dataSource.length > 0,
    })
  }

  navToActivity = () => {
    Taro.navigateTo({
      url:
        '/subpackages/timetable/pages/activity/activity?id=' +
        this.state.comingNext._id +
        '&mode=old',
    })
  }

  render() {
    return (
      <View>
        {this.props.mode === 'landscape' && (
          <View className="landscape-page">
            {this.state.isLoaded ? (
              <View className="main">
                <View className="indicator">
                  {this.state.performings.length > 0 ? 'Now' : 'Coming next...'}
                </View>
                <View className="title">{this.state.comingNext.module}</View>
                <View className="info">
                  <View>{this.state.comingNext.room}</View>
                  <View>{this.state.comingNext.name_of_type}</View>
                  <View>{`${this.state.comingNext.start} ~ ${this.state.comingNext.end} ${this.state.comingNext.day}`}</View>
                </View>
              </View>
            ) : (
              <View>{Taro.T._('No courses now')}</View>
            )}
          </View>
        )}

        {this.props.mode === 'card' && this.state.isLoaded && (
          <View className="card" onClick={this.navToActivity}>
            <View className="indicator">
              {this.state.performings.length > 0 ? 'Now' : 'Coming next...'}
            </View>
            <View className="title">{this.state.comingNext.module}</View>
            <View className="info">
              <View>{this.state.comingNext.room}</View>
              <View>{this.state.comingNext.name_of_type}</View>
              <View>{`${this.state.comingNext.start} ~ ${this.state.comingNext.end} ${this.state.comingNext.day}`}</View>
            </View>
          </View>
        )}
      </View>
    )
  }
}
