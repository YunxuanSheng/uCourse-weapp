import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Loading from '../../../../../../components/Loading/Loading'
import Rate from '../../../../../../components/Rate/Rate'
import TopicCourseVote from '../../../../../../components/TopicCourseVote/TopicCourseVote'

import api from '../../../../../../utils/api'

import './TopicCourses.scss'

export default class TopicCourses extends Component {
  state = {
    rows: [],
    isFinished: false,
  }

  componentWillMount() {
    this.initBrowse()
    this.fetchNext()
    Taro.eventCenter.on('onReachTopicBottom', () => {
      this.fetchNext()
    })
  }

  componentWillUnmount() {
    Taro.eventCenter.off('onReachTopicBottom')
  }

  initBrowse = () => {
    const { topicId } = this.props
    this.browse = api.Topics.Courses.browse({ topicId })
  }

  fetchNext = async () => {
    const next = this.browse.next()
    const rows = await next.value
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

  navToCourse = c => {
    const code = c.course_code
    const { title, school_code } = c.course
    Taro.navigateTo({
      url: `/subpackages/course/pages/course/course?title=${title}&code=${code}&school_code=${school_code}`,
    })
  }

  render() {
    return (
      <View className="topic-courses">
        {this.state.rows.map((c, index) => {
          const scoreComp = (
            c.course.prop.score_comp / (c.course.prop.eval_count || 1)
          ).toFixed(1)
          const schoolCode = c.course.school_code.replace('CSC-', '')
          const evalInfo = `${c.course.prop.eval_count} ${Taro.T._(
            'Evaluations'
          )}`
          const ranking = index + 1

          return (
            <View
              key={c.id}
              className="course-card"
              onClick={this.navToCourse.bind(this, c)}
            >
              <View className="header">
                <View className="header-left">
                  <View className={'ranking ranking-' + ranking}>
                    {ranking}
                  </View>
                  <View>{c.course_code}</View>
                </View>
                <View className="header-right">
                  <View className={'school ' + c.course.school_code}>
                    {schoolCode}
                  </View>
                  <Rate defaultValue={scoreComp} disabled size={32} />
                  <View className="rate">{scoreComp}</View>
                </View>
              </View>

              <View className="content">
                <View className="content-title">{c.course.title}</View>
              </View>

              <View className="footer">
                <View className="footer-left">{evalInfo}</View>
                <View className="footer-right">
                  <View className="vote-count">
                    <TopicCourseVote
                      courseCode={c.course_code}
                      count={c.vote_count}
                      topicCourseId={c.id}
                      isVoted={c.topic_course_vote.length !== 0}
                    />
                  </View>
                </View>
              </View>
            </View>
          )
        })}

        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
