import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../../../../../components/UIcon/UIcon'
import time from '../../../../../../utils/time'
import './Question.scss'

export default class Question extends Component {
  navToQuestion = async () => {
    Taro.navigateTo({
      url: `/subpackages/askall/pages/askall-detail/askall-detail?created_at=${this.props.created_at}&question_id=${this.props.question_id}&course_title=${this.props.course_code}&course_code=${this.props.course_code}&question_content=${encodeURIComponent(this.props.question_content)}`,
    })
  }
  render() {
    const isFullSize = this.props.area === 0 || this.props.area === 2
    return (
      <View className={`question ${this.props.isFullSize?'':'question-half'}`} onClick={this.navToQuestion.bind(this)}>
        <View className="qs-title">
          <View className="question-title">
            <UIcon
              icon-class="orange"
              icon="orange"
              className="question-icon"
            />
            <View className="question-title-text">
              {this.props.question_content}
            </View>
          </View>
          <View className="class-code">{this.props.course_code}</View>
        </View>
        {isFullSize && (
          <View className="small-detail">
            <View>{
              this.props.area === 0
              ? `${Taro.T._('Question followed at')} ${time.fromNow(this.props.followed_at)}`
              : `${Taro.T._('Question created at')} ${time.fromNow(this.props.created_at)}`
            }</View>
            <View className="btn-enter">
              <UIcon icon-class="enter" icon="enter" />
            </View>
          </View>
        )}
      </View>
    )
  }
}
