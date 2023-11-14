import Taro, { Component } from '@tarojs/taro'
import { View, Textarea, Button, Switch } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import api from '../../../../utils/api'
import time from '../../../../utils/time'
import Loading from '../../../../components/Loading/Loading'
import Reply from './components/Reply/Reply'
import './askall-detail.scss'

export default class AskallDetail extends Component {
  state = {
    QAInfo: [],
    isLoading: true,
    reply_content: '',
    contentLen: 0,
    isToastShow: false,
    is_anonymous: false,
    isWatched: false,
  }
  componentWillMount() {
    this.isWatchedByMe()
    this.fetchQuestionDetail()
  }
  async fetchQuestionDetail() {
    const QAInfo = await api.CourseQA.getById(
      this.$router.params.course_code,
      this.$router.params.question_id
    )
    this.setState({
      QAInfo,
      isLoading: false,
    })
  }

  async isWatchedByMe() {
    const res = await api.CourseQA.watched(
      this.$router.params.course_code,
      this.$router.params.question_id
    )
    console.log('watch ', res)

    this.setState({
      isWatched: res === true,
    })
  }

  handleReply(e) {
    const content = e.detail.value
    this.setState({
      reply_content: content,
      contentLen: content.length.toLocaleString(),
    })
  }

  async handleReplySubmit(reply_id) {
    const body = {
      reply_id,
      is_anonymous: this.state.is_anonymous,
      content: this.state.reply_content,
    }
    Taro.showLoading({
      title: Taro.T._('Publishing'),
      mask: true,
    })
    const replyToAnswer = await api.CourseQA.reply(
      this.$router.params.course_code,
      this.$router.params.question_id,
      body
    )
    Taro.hideLoading()
    if (replyToAnswer.content) {
      Taro.showToast({
        title: Taro.T._('Published'),
        icon: 'success',
        mask: true,
        duration: 1000,
      })
      this.timer = setTimeout(() => {
        this.setState({
          isToastShow: false,
        })
        Taro.navigateBack()
      }, 1500)
    }
  }
  openToast() {
    this.setState({ isToastShow: true })
  }
  shutdownToast() {
    this.setState({ isToastShow: false })
  }
  handleAnonymousChange() {
    this.setState(prevState => {
      return {
        is_anonymous: !prevState.is_anonymous,
      }
    })
  }

  handleReport = async () => {
    const { tapIndex } = await Taro.showActionSheet({
      itemList: [Taro.T._('Report')],
      itemColor: '#e64340',
    })
    if (tapIndex === 0) {
      // 举报确认
      Taro.showToast({
        title: Taro.T._('Reported'),
        icon: 'none',
      })
    }
  }

  handleWatch = async question_id => {
    this.clickWatch = true
    this.setState(prevState => ({
      isWatched: !prevState.isWatched,
    }))
    const course_code = this.$router.params.id
      ? this.$router.params.id
      : this.$router.params.course_code
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
      <View className="askall-detail-page">
        <Navigation align="left">
          <View>{this.$router.params.course_title}</View>
        </Navigation>
        <View className="question">
          <View className="question-title">
            <UIcon
              icon-class="orange"
              icon="orange"
              className="question-icon"
            />
            <View>{this.$router.params.question_content}</View>
          </View>
          <View className="small-detail">
            <View>
              {this.$router.params.created_at &&
                `${Taro.T._('Question created at')} ${time.fromNow(
                  this.$router.params.created_at
                )}`}
            </View>
            {!this.state.isLoading && (
              <View className="display-content">
                <View
                  className={
                    this.state.isWatched ? 'ask-btn-2-active' : 'ask-btn-2'
                  }
                  onClick={this.handleWatch.bind(
                    this,
                    this.$router.params.question_id
                  )}
                >
                  {this.state.isWatched
                    ? Taro.T._('Followed')
                    : Taro.T._('+Follow')}
                </View>
                <View className="ask-btn-2" onClick={this.openToast.bind(this)}>
                  {Taro.T._('Answer')}
                </View>
                <View className="ask-btn-2" onClick={this.handleReport}>
                  {Taro.T._('Report')}
                </View>
              </View>
            )}
          </View>
        </View>
        {this.state.isLoading && <Loading color="primary" />}
        {!this.state.isLoading && this.state.QAInfo.length === 0 && (
          <View className="zero-answer">
            <View className="zero-answer-tag">
              {Taro.T._('This question has not been answered ~')}
            </View>
          </View>
        )}
        {this.state.QAInfo.map(item => {
          return (
            <Reply
              key={item.id}
              content={item.content}
              reply_count={item.reply_count}
              like_count={item.like_count}
              is_anonymous={item.is_anonymous}
              user_id={item.user_id}
              course_code={this.$router.params.course_code}
              question_id={this.$router.params.question_id}
              reply_id={item.id}
              like_by_me={item.like_by_me}
              created_at={item.created_at}
            />
          )
        })}
        {this.state.isToastShow && (
          <View className="reply-input-wrapper">
            <Textarea
              value={this.state.reply_content}
              placeholder={Taro.T._('I want to say ...')}
              onInput={this.handleReply}
              maxlength={1000}
              className="textarea"
              autoHeight
            />
            <View className="reply-input-toolbar">
              <View className="switch">
                <View className="anoy">{Taro.T._('Anonymous')}</View>
                <Switch
                  checked={this.state.is_anonymous}
                  onChange={this.handleAnonymousChange}
                  color="#ff9800"
                />
              </View>
              <View className="word-count">
                {this.state.contentLen.toLocaleString()} / 1000
              </View>
            </View>
            <View className="props">
              <Button className="props-right" onClick={this.shutdownToast}>
                {Taro.T._('Close')}
              </Button>
              <Button
                className="props-right"
                onClick={this.handleReplySubmit.bind(this, null)}
              >
                {Taro.T._('Submit')}
              </Button>
            </View>
          </View>
        )}
      </View>
    )
  }
}
