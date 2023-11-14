import Taro, { Component } from '@tarojs/taro'
import { View, Button, Textarea, Switch } from '@tarojs/components'
import api from '../../../../../../utils/api'
import time from '../../../../../../utils/time'
import UIcon from '../../../../../../components/UIcon/UIcon'
import Avatar from '../../../../../../components/Avatar/Avatar'
import ReplyDup from '../ReplyDup/ReplyDup'
import './Reply.scss'

export default class Reply extends Component {
  state = {
    isThumbedUp: 0,
    like_counts: 0,
    userInfo: {
      nickname: 'Loading',
      avatar: null,
    },
    replyList: [],
    showReplyList: false,
    isToastShow: false,
    contentLen: 0,
    is_anonymous_: false,
  }
  componentWillMount() {
    this.setState({
      isThumbedUp: this.props.like_by_me,
      like_counts: this.props.like_count,
    })
    !this.props.is_anonymous && this.getUserInfo()
    this.props.reply_count !== 0 && this.getReplyList()
  }
  thumbClick = async () => {
    const data = await api.CourseQA.thumbUp(
      this.props.course_code,
      this.props.question_id,
      this.props.reply_id
    )
    this.setState({
      isThumbedUp: data.data === undefined,
    })
    this.setState(prevState => ({
      like_counts:
        data.data === undefined
          ? prevState.like_counts + 1
          : prevState.like_counts - 1,
    }))
  }
  replyClick = () => {
    this.setState(prevState => ({
      showReplyList: !prevState.showReplyList,
    }))
  }
  getUserInfo = async () => {
    const userInfo = await api.Users.retrieve(this.props.user_id)
    this.setState({
      userInfo: userInfo,
    })
  }
  getReplyList = async () => {
    const replyList = await api.CourseQA.getReplyList(
      this.props.course_code,
      this.props.question_id,
      this.props.reply_id
    )
    this.setState({
      replyList: replyList,
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
      is_anonymous: this.state.is_anonymous_,
      content: this.state.reply_content,
    }
    Taro.showLoading({
      title: Taro.T._('Publishing'),
      mask: true,
    })
    const replyToAnswer = await api.CourseQA.reply(
      this.props.course_code,
      this.props.question_id,
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
        is_anonymous_: !prevState.is_anonymous_,
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

  render() {
    return (
      <View>
        <View className="answer">
          <View className="answer-small-detail">
            {this.props.is_anonymous ? (
              <View>{Taro.T._('Anonymous User')}</View>
            ) : (
              <View className="user-info">
                {this.state.userInfo.avatar && (
                  <Avatar
                    src={this.state.userInfo.avatar}
                    size={32}
                    uid={this.props.user_id}
                  />
                )}
                <View className="user-info-nickname">
                  {this.state.userInfo.nickname}
                </View>
              </View>
            )}
            <View>{time.fromNow(this.props.created_at)}</View>
          </View>
          <View className="answer-content">{this.props.content}</View>
          <View className="answer-bottom">
            <View className="display-content">
              <View
                onClick={this.thumbClick}
                className={
                  this.state.isThumbedUp ? 'reply-icon-red' : 'reply-icon'
                }
              >
                <UIcon icon-class="thumb" icon="thumb" />
                <View className="thumb-up">
                  {this.state.like_counts}
                  {Taro.T._('Likes')}
                </View>
              </View>
              <View
                onClick={this.replyClick}
                className={
                  this.state.showReplyList ? 'reply-icon-red' : 'reply-icon'
                }
              >
                <UIcon icon-class="reply" icon="reply" />
                <View className="thumb-up">
                  {this.props.reply_count}
                  {Taro.T._('Replies')}
                </View>
              </View>
              <View className="ask-btn" onClick={this.openToast.bind(this)}>
                {Taro.T._('Reply')}
              </View>
              <View className="ask-btn" onClick={this.handleReport}>
                {Taro.T._('Report')}
              </View>
            </View>
          </View>
        </View>
        {this.state.showReplyList &&
          (this.props.reply_count === 0 ? (
            <View className="zero-answer">
              <View className="zero-answer-tag">
                {Taro.T._('This answer has not been replied ~')}
              </View>
            </View>
          ) : (
            this.state.replyList.map(item => (
              <ReplyDup
                key={item.id}
                content={item.content}
                reply_count={item.reply_count}
                like_count={item.like_count}
                is_anonymous={item.is_anonymous}
                user_id={item.user_id}
                course_code={this.props.course_code}
                question_id={this.props.question_id}
                reply_id={item.id}
                like_by_me={item.like_by_me}
                created_at={item.created_at}
              />
            ))
          ))}
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
                  checked={this.state.is_anonymous_}
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
                onClick={this.handleReplySubmit.bind(this, this.props.reply_id)}
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
