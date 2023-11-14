import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import Avatar from '../../../../components/Avatar/Avatar'
import api from '../../../../utils/api'

import './RecentEvals.scss'

export default class RecentEvals extends Component {
  state = {
    rows: [],
  }

  componentWillMount() {
    this.fetchEvals()
  }

  fetchEvals = async () => {
    const res = await api.Home.browse({ target: 'recentExchangeEvals' }).next()
      .value
    this.setState({
      rows: res,
    })
  }

  navToEval = id => {
    Taro.navigateTo({ url: '/subpackages/exchange/pages/eval/eval?id=' + id })
  }

  navToSchool = (id, e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '/subpackages/exchange/pages/school/school?id=' + id,
    })
  }

  navToUser = (id, e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '/subpackages/profile/pages/profile/profile?id=' + id,
    })
  }

  render() {
    return (
      <View className="field-content">
        <ScrollView className="scroll-view" scrollX>
          {this.state.rows.map(e => {
            return (
              <View
                className="eval-card"
                key={e.id}
                onClick={this.navToEval.bind(this, e.id)}
              >
                <View
                  className="course-title"
                  onClick={this.navToSchool.bind(this, e.exchange_school.id)}
                >
                  {e.exchange_school.title}
                </View>
                <View className="eval-content">{e.content_short}</View>
                <View className="user">
                  <View className="avatar">
                    <Avatar src={e.user.avatar} uid={e.user.id} size={32} />
                  </View>
                  <Text
                    className="nickname"
                    onClick={this.navToUser.bind(this, e.user.id)}
                  >
                    {e.user.nickname}
                  </Text>
                  <Text className="dot">·</Text>
                  {/* <Rate defaultValue={5} disabled size={30} /> */}
                  {`${e.vote_pro_count} ${Taro.T._('Pros')}`}
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}
