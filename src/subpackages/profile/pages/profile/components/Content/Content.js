import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import Tabs from '../../../../../../components/Tabs/Tabs'
import UIcon from '../../../../../../components/UIcon/UIcon'
import Abnor from '../../../../../../components/Abnor/Abnor'
import Loading from '../../../../../../components/Loading/Loading'
import api from '../../../../../../utils/api'
import helper from '../../../../../../utils/helper'
import time from '../../../../../../utils/time'

import './Content.scss'

export default class Content extends Component {
  static defaultProps = {
    userId: 'self',
  }

  state = {
    statusBarHeight: 0,
    count: 0,
    rows: [],
    isFinished: false,
    tabs: ['动态', '评测'],
    tabIndex: 0,
    orderByList: ['最新', '最热'],
    orderBy: '最新',
  }

  componentWillMount() {
    this.setState({
      statusBarHeight: Taro.systemInfo.statusBarHeight,
      tabs: [Taro.T._('Activities'), Taro.T._('The Evaluations')],
      orderByList: [Taro.T._('Latest'), Taro.T._('Hottest')],
      orderBy: Taro.T._('Latest'),
    })

    Taro.eventCenter.on('onReachProfileBottom', () => {
      this.fetchNext()
    })

    this.initFetch()
    this.fetchNext()
  }

  onTabChange = i => {
    this.setState({
      isFinished: false,
      tabIndex: i,
      orderBy: this.state.orderByList[0],
    })
    this.refreshRows()
    this.initFetch(i)
    this.fetchNext({ isTabChange: true })
  }

  onOrderChange = e => {
    this.setState({ orderBy: this.state.orderByList[e.detail.value] }, () => {
      this.setState({ isFinished: false })
      this.refreshRows()
      const order = e.detail.value === '1' ? 'vote_pro_count' : 'created_at'
      this.initFetch(this.state.tabIndex, { order })
      this.fetchNext()
    })
  }

  initFetch = (type = 0, query = {}) => {
    const { userId = 'self' } = this.props
    // const { id = 'self' } = this.$scope.options || this.$router.params
    switch (type) {
      case 0:
        this.fetch = api.Users.Activities.browse(userId)
        break
      case 1:
        this.fetch = api.Users.Evals.browse(userId, query)
        break
      default:
    }
  }

  fetchNext = async ({ isTabChange = false } = {}) => {
    const next = this.fetch.next()
    const { count, rows } = (await next.value) || 0
    console.log({ count, rows })
    if (count) {
      this.setState({ count })
    }
    if (!next.done && rows.length > 0) {
      this.setState(prevState => {
        if (isTabChange) {
          return {
            rows,
            isFinished: rows.length < 10,
          }
        } else {
          return {
            rows: prevState.rows.concat(rows),
            isFinished: rows.length < 10,
          }
        }
      })
    } else {
      this.setState({ isFinished: true })
    }
  }

  refreshRows = () => {
    this.setState({ rows: [], count: 0 })
  }

  navTo = ({ type, id, title }) => {
    switch (type) {
      case 'EVAL':
        Taro.navigateTo({
          url: `/subpackages/eval/pages/eval/eval?id=${id}&title=${title}`,
        })
        break
      case 'ESEVAL':
        Taro.navigateTo({
          url: `/subpackages/exchange/pages/eval/eval?id=${id}`,
        })
      default:
    }
  }

  render() {
    return (
      <View className="content-container">
        <View
          className="tab-container"
          style={`top: ${this.state.statusBarHeight + 46}px`}
        >
          <Tabs tabs={this.state.tabs} onChange={this.onTabChange} />
        </View>

        <View className="activity-container">
          {this.state.isFinished && this.state.count === 0 && (
            <View>
              <Abnor title={Taro.T._('Nothing here...')} />
            </View>
          )}

          {this.state.tabIndex === 0 &&
            this.state.rows.map(row => {
              const action = helper.parseAction(row.action)
              const type = helper.parseObject(row.object_type)
              const navArg = {
                type: row.object_type,
                id: row.object_id,
                title: row.course,
              }
              // TODO: re-design
              return (
                <View
                  key={row.id}
                  className="activity"
                  onClick={this.navTo.bind(this, navArg)}
                >
                  <View className="activity-header">
                    {row.user.nickname}
                    {action}
                    {type} · {time.fromNow(row.created_at)}
                  </View>

                  {row.content && (
                    <View className="comment">{row.content}</View>
                  )}
                  {row.course && <View className="title">{row.course}</View>}

                  {row.object_type === 'EVAL' && row.eval && (
                    <View>
                      <View className="content">{row.eval.content_short}</View>

                      <View className="score">
                        {row.eval.vote_pro_count} 赞同 · 设计:{' '}
                        {row.eval.score_design}分 质量: {row.eval.score_qlty}分
                        难易: {row.eval.score_spl}分
                      </View>
                    </View>
                  )}

                  {row.object_type === 'ESEVAL' && row.exchange_school_eval && (
                    <View>
                      <View className="content">
                        {row.exchange_school_eval.content_short}
                      </View>

                      <View className="score">
                        {row.exchange_school_eval.vote_pro_count} 赞同 · 评分:{' '}
                        {row.exchange_school_eval.score}分
                      </View>
                    </View>
                  )}
                </View>
              )
            })}

          {this.state.tabIndex === 1 && this.state.count > 0 && (
            <View>
              <View className="header-bar">
                <View>{`${this.state.count.toLocaleString()} ${Taro.T._(
                  'Evaluations'
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
              {this.state.rows.map(row => {
                const navArg = {
                  type: 'EVAL',
                  id: row.id,
                  title: row.course && row.course.title,
                }
                return (
                  <View
                    key={row.id}
                    className="activity"
                    onClick={this.navTo.bind(this, navArg)}
                  >
                    <View className="title">
                      {row.course && row.course.title}
                    </View>

                    <View className="content">{row.content_short}</View>

                    <View className="score">
                      {row.vote_pro_count} 赞同 · 设计: {row.score_design}分
                      质量: {row.score_qlty}分 难易: {row.score_spl}分 ·{' '}
                      {time.fromNow(row.created_at)}
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>

        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
