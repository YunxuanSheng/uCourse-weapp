import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import api from '../../../../utils/api'
import Loading from '../../../../components/Loading/Loading'
import Question from './components/Question/Question'
import Reply from './components/Reply/Reply'
import './course-qa.scss'

export default class CourseQA extends Component {
  state = {
    area: 2,
    isLoading: true,
    question_list: [],
    reply_list: [],
    my_question_list: [],
    my_reply_list: [],
  }
  componentDidMount() {
    this.fetchInfo()
  }
  fetchInfo = async () => {
    this.fetchLikedQuestions()
    this.fetchLikedReplies()
    this.fetchMyQuestions()
    this.fetchMyReplies()
    this.setState({ isLoading: false })
  }

  fetchLikedQuestions = async () => {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo.id) {
      const res = await api.CourseQA.liked_questions(userInfo.id)
      console.log('liked_questions:', res)
      this.setState({ question_list: res })
    }
  }

  fetchLikedReplies = async () => {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo.id) {
      const res = await api.CourseQA.liked_replies(userInfo.id)
      console.log('liked_replies:', res)
      this.setState({ reply_list: res })
    }
  }
  fetchMyQuestions = async () => {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo.id) {
      const res = await api.CourseQA.my_questions(userInfo.id)
      console.log('my_questions:', res)
      this.setState({ my_question_list: res })
    }
  }

  fetchMyReplies = async () => {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo.id) {
      const res = await api.CourseQA.my_replies(userInfo.id)
      console.log('my_replies:', res)
      this.setState({ my_reply_list: res })
    }
  }
  render() {
    return (
      <View className="course-qa-page">
        <Navigation align="center" title={Taro.T._('Course QA')} />
        <View className="tabbar">
          <View
            className={this.state.area === 0 ? 'bar-active' : 'bar'}
            onClick={()=>this.setState({ area: 0 })}
          >
            {Taro.T._('Favorite Questions')}
          </View>
          <View
            className={this.state.area === 1 ? 'bar-active' : 'bar'}
            onClick={()=>this.setState({ area: 1 })}
          >
            {Taro.T._('Favorite Responses')}
          </View>
          <View
            className={this.state.area === 2 ? 'bar-active' : 'bar'}
            onClick={()=>this.setState({ area: 2 })}
          >
            {Taro.T._('Created questions')}
          </View>
          <View
            className={this.state.area === 3 ? 'bar-active' : 'bar'}
            onClick={()=>this.setState({ area: 3 })}
          >
            {Taro.T._('Created responses')}
          </View>
        </View>
        {this.state.isLoading && <Loading color="primary" />}

        {/* 我收藏的问题 */}
        {!this.state.isLoading && this.state.area === 0 &&
          this.state.question_list.map(item => (
            <Question
              key={`${item.question.course_code}${item.question.id}`}
              question_content={item.question.content}
              course_code={item.question.course_code}
              question_id={item.question.id}
              created_at={item.question.created_at}
              followed_at={item.created_at}
              area={0}
            />
          ))}

        {/* 我收藏的回复 */}
        {!this.state.isLoading && this.state.area === 1 &&
          this.state.reply_list.map(item => (
            <View
              key={`${item.reply.content}${item.reply.id}`}
              className="reply-card"
            >
              <Question
                question_content={item.reply.question.content}
                course_code={item.reply.question.course_code}
                question_id={item.reply.question.id}
                created_at={item.reply.question.created_at}
                area={1}
              />
              <Reply
                is_anonymous={item.reply.is_anonymous}
                content={item.reply.content}
                created_at={item.created_at}
                user_id={item.reply.user_id}
                half={true}
              />
            </View>
          ))}

        {/* 我创建的问题 */}
        {!this.state.isLoading && this.state.area === 2 &&
          this.state.my_question_list.map(item => (
            <Question
              key={`${item.course_code}${item.id}`}
              question_content={item.content}
              created_at={item.created_at}
              course_code={item.course_code}
              question_id={item.id}
              area={2}
            />
          ))}

        {/* 我创建的回复 */}
        {!this.state.isLoading && this.state.area === 3 &&
          this.state.my_reply_list.map(item => (
            <View
              key={`${item.question.course_code}${item.question.id}`}
              className="reply-card"
            >
              <Question
                question_content={item.question.content}
                course_code={item.question.course_code}
                question_id={item.question.id}
                created_at={item.question.created_at}
                area={3}
              />
              <Reply
                content={item.content}
                created_at={item.created_at}
                question_id={item.question.id}
                reply_id={item.id}
                is_anonymous={item.is_anonymous}
                course_code={item.question.course_code}
                edit={true} // can edit reply
                half={true}
              />
            </View>
          ))}
      </View>
    )
  }
}
