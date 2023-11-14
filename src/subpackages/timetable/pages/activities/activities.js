import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Loading from '../../../../components/Loading/Loading'
import api from '../../../../utils/api'
import './activities.scss'

export default class Activities extends Component {
  state = {
    activities: [],
    isLoading: false,
  }

  componentWillMount() {
    this.fetchActivities()
  }

  fetchActivities = async () => {
    this.setState({ isLoading: true })
    const { moduleCode } = this.$router.params
    const activities = await api.Timetable.browse({ moduleCode })
    console.log(activities)
    this.setState({ activities, isLoading: false })
  }

  navToActivity = id => {
    Taro.navigateTo({
      url: '/subpackages/timetable/pages/activity/activity?id=' + id,
    })
  }

  render() {
    return (
      <View className="activities-page">
        <Navigation title={this.$router.params.moduleCode} align="left" />

        <View>
          {this.state.activities.map(a => (
            <View
              key={a.activity}
              className="card"
              onClick={this.navToActivity.bind(this, a.activity_id)}
            >
              <View className="header">
                <View>{`${a.start} ~ ${a.end} ${a.day}`}</View>
                <View>{a.name_of_type}</View>
              </View>
              <View className="title">{a.activity}</View>
              <View className="footer">
                <View>{a.staff.join(', ')}</View>
                <View>{a.room}</View>
              </View>
            </View>
          ))}
        </View>

        {this.state.isLoading && <Loading color="primary" />}
      </View>
    )
  }
}
