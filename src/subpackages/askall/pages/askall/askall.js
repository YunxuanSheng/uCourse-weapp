import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import api from '../../../../utils/api'
import AnswerItem from './components/AnswerItem/answerItem'
import './askall.scss'

export default class Askall extends Component {
  state = {
    courseQAInfo: [],
    isLoading: true,
  }
  componentWillMount() {
    this.fetchCourseQAInfo()
  }
  fetchCourseQAInfo = async () => {
    const courseQAInfo = await api.CourseQA.get(this.$router.params.id)
    this.setState({ courseQAInfo, isLoading: false })
  }
  navToAsk = () => {
    Taro.navigateTo({
      url: `/subpackages/askall/pages/askall-post/askall-post?&course_title=${this.$router.params.title}&course_code=${this.$router.params.id}`,
    })
  }

  render() {
    return (
      <View className="askall-page">
        <Navigation align="left">
          <View>{this.$router.params.title}</View>
        </Navigation>
        <View className="course-box">
          <View className="title">
            <View>
              <View>{this.$router.params.title}</View>
              <View className="question-count">
                {this.state.isLoading
                  ? 'Loading...'
                  : `${this.state.courseQAInfo.length}${Taro.T._('Questions')}`}
              </View>
            </View>
            <View className="ask-btn" onClick={this.navToAsk}>
              {Taro.T._('Ask')}
            </View>
          </View>

          <View className="question-list">
            {this.state.courseQAInfo.map(item => {
              return (
                <AnswerItem
                  key={item.id}
                  question_id={item.id}
                  content={item.content}
                  created_at={item.created_at}
                  reply_count={item.reply_count}
                  watch_count={item.watch_count}
                  watch_by_me={item.watch_by_me}
                  course_title={this.$router.params.title}
                  course_code={this.$router.params.id}
                />
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}
