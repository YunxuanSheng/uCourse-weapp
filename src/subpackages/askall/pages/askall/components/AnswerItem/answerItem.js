import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../../../../../components/UIcon/UIcon'
import api from '../../../../../../utils/api'
import time from '../../../../../../utils/time'
import './answerItem.scss'

export default class AnswerItem extends Component {
  clickWatch = false
  state = {
    isWatched: false,
    watch_count_: 0,
  }
  componentWillMount() {
    this.setState({
      watch_count_: this.props.watch_count,
      isWatched: this.props.watch_by_me,
    })
  }
  navToAskAllDetail = async (question_id, question_content, created_at) => {
    setTimeout(() => {
      if (!this.clickWatch) {
        Taro.navigateTo({
          url: `/subpackages/askall/pages/askall-detail/askall-detail?question_id=${question_id}&created_at=${created_at}&course_title=${
            this.props.course_title
          }&course_code=${
            this.props.course_code
          }&question_content=${encodeURIComponent(question_content)}`,
        })
      } else {
        this.clickWatch = false
      }
    }, 100)
  }
  handleWatch = async question_id => {
    this.clickWatch = true
    this.setState(prevState => ({
      isWatched: !prevState.isWatched,
    }))
    const course_code = this.props.course_code
    const res = await api.CourseQA.watch(course_code, question_id)
    this.setState({
      isWatched: res.data === undefined,
    })
    this.setState(prevState => ({
      watch_count_:
        res.data === undefined
          ? prevState.watch_count_ + 1
          : prevState.watch_count_ - 1,
    }))
  }
  render() {
    return (
      <View
        className="question-item"
        onClick={this.navToAskAllDetail.bind(
          this,
          this.props.question_id,
          this.props.content,
          this.props.created_at
        )}
      >
        <View className="flex-view">
          <View className="question-title">
            <UIcon
              icon-class="orange"
              icon="orange"
              className="question-icon"
            />
            <View className="question-title-text">{this.props.content}</View>
          </View>
          <View className="btn-enter">
            <UIcon icon-class="enter" icon="enter" />
          </View>
        </View>

        <View className="question-item-bottom">
          <View className="created-at">
            {`${Taro.T._('Question created at')} ${time.fromNow(
              this.props.created_at
            )}`}
          </View>
          <View className="question-item-bottom-right">
            <View className="question-count">{`${
              this.props.reply_count
            } ${Taro.T._('Answers')}`}</View>
            <View className="question-count">{`${
              this.state.watch_count_
            } ${Taro.T._('Follows')}`}</View>
            <View
              className={
                this.state.isWatched ? 'ask-btn-2-active' : 'ask-btn-2'
              }
              onClick={this.handleWatch.bind(this, this.props.question_id)}
            >
              {this.state.isWatched
                ? Taro.T._('Followed')
                : Taro.T._('+Follow')}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
