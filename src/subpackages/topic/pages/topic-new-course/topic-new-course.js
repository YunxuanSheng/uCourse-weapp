import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Abnor from '../../../../components/Abnor/Abnor'
import Loading from '../../../../components/Loading/Loading'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'

import './topic-new-course.scss'

export default class TopicNewCourse extends Component {
  state = {
    rows: [],
    isFinished: false,
  }

  componentWillMount() {
    this.fetchMyEvals()
  }

  componentDidMount() {
    this.showHint()
  }

  showHint = async () => {
    await Taro.showModal({
      title: Taro.T._('Nominate a New Course'),
      content: Taro.T._(
        'You can nominate courses you reviewed to this topic leaderboard.'
      ),
      confirmColor: '#ff9800',
      confirmText: Taro.T._('OK'),
      showCancel: false,
    })
  }

  fetchMyEvals = async () => {
    if (!this.browse) {
      this.browse = api.Users.Evals.browse()
    }

    const next = this.browse.next()
    const res = await next.value
    const rows = res.rows
    if (!next.done && rows.length > 0) {
      this.setState(prevState => {
        return {
          rows: prevState.rows.concat(rows),
          isFinished: rows.length < 10,
        }
      })
    } else {
      this.setState({ isFinished: true })
    }
  }

  navToSearch = () => {
    Taro.navigateTo({
      url: '/subpackages/search/pages/search/search?from=myCourses',
    })
  }

  createNewCourse = async code => {
    const { confirm } = await Taro.showModal({
      title: code,
      content: Taro.T._('Nominate this course?'),
      confirmColor: '#ff9800',
      confirmText: Taro.T._('OK'),
    })
    if (confirm) {
      Taro.showLoading({ title: Taro.T._('Loading') })
      try {
        const { topicId } = this.$router.params
        await api.Topics.Courses.create({ topicId, courseCode: code })
        Taro.hideLoading()
        Taro.navigateBack()
      } catch (e) {
        Taro.hideLoading()
        Taro.showToast({ title: Taro.T._('Something wrong'), icon: 'none' })
      }
    }
  }

  onReachBottom() {
    if (this.state.isFinished) {
      return
    }
    this.fetchMyEvals()
  }

  render() {
    return (
      <View className="my-evals-page">
        <Navigation title={Taro.T._('My Evaluations')} />

        {this.state.rows.map(e => {
          const { title, code } = e.course
          const content_short = e.content_short

          return (
            <View
              className="my-evals"
              key={e.id}
              onClick={this.createNewCourse.bind(this, code)}
            >
              <View className="title">{title}</View>
              <View className="content">{content_short}</View>
            </View>
          )
        })}

        {this.state.isFinished && this.state.rows.length === 0 && (
          <View>
            <Abnor title={Taro.T._('Nothing here...')} />

            <View className="create-btn">
              <Btn type="primary" size="medium" onClick={this.navToSearch}>
                {Taro.T._('Create an evaluation')}
              </Btn>
            </View>
          </View>
        )}

        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
