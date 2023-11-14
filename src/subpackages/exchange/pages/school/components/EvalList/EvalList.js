import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import Avatar from '../../../../../../components/Avatar/Avatar'
import Rate from '../../../../../../components/Rate/Rate'
import UIcon from '../../../../../../components/UIcon/UIcon'
import time from '../../../../../../utils/time'

import './EvalList.scss'

export default class EvalList extends Component {
  state = {
    orderByList: ['', ''],
    orderBy: '',
  }

  componentWillMount() {
    this.setState({
      orderByList: [Taro.T._('Hottest'), Taro.T._('Latest')],
      orderBy: Taro.T._('Hottest'),
    })
  }

  static defaultProps = {
    title: 'A School',
    myEval: null,
    count: 0,
    rows: [],
    onOrderChange: () => {},
  }

  onOrderChange = e => {
    this.setState({ orderBy: this.state.orderByList[e.detail.value] }, () => {
      this.props.onOrderChange(this.state.orderBy)
    })
  }

  navToEval = id => {
    Taro.navigateTo({
      url: `/subpackages/exchange/pages/eval/eval?id=${id}`,
    })
  }

  render() {
    return (
      <View className="eval-list-container">
        <View className="header">
          <View>{`${this.props.count.toLocaleString()} ${Taro.T._(
            'Evaluations',
          )}`}</View>
          <View>
            <Picker
              mode="selector"
              range={this.state.orderByList}
              onChange={this.onOrderChange}
            >
              <Text className="order-by">{this.state.orderBy}</Text>
              <UIcon icon="unfold" />
            </Picker>
          </View>
        </View>
        {this.props.rows.map(row => {
          return (
            <View
              className="eval-container"
              key={row.id}
              onClick={this.navToEval.bind(this, row.id)}
            >
              <View className="eval-container-header">
                <View className="eval-container-header-left">
                  <Avatar src={row.user.avatar} uid={row.user.id} size={32} />
                  <View className="nickname">{row.user.nickname}</View>
                </View>
                <View className="eval-container-header-right">
                  <View className="rate">{row.score}</View>
                  <Rate defaultValue={row.score} disabled size={32} />
                </View>
              </View>
              <View className="content">{row.content_short}</View>
              <View className="info">
                {`${row.vote_pro_count} ${Taro.T._('Pros')} · ${time.fromNow(
                  row.created_at,
                )}`}
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}
