import Taro, { Component } from '@tarojs/taro'
import { View, Button, Switch, Textarea } from '@tarojs/components'
import UIcon from '../../../../../../components/UIcon/UIcon'
import Avatar from '../../../../../../components/Avatar/Avatar'
import api from '../../../../../../utils/api'
import time from '../../../../../../utils/time'
import './Reply.scss'

export default class Reply extends Component {
  state = {
    isToastShow: false,
    userInfo: {
      nickname: 'Loading',
      avatar: null,
    },
    reply_content: '',
    is_anonymous_: false,
    contentLen: 0,
  }
  componentDidMount() {
    this.setState({
      reply_content: this.props.content,
      is_anonymous_: this.props.is_anonymous,
    })
  }
  handleModify = () => {
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
  async handleReplySubmit() {
    const body = {
      is_anonymous: this.state.is_anonymous_,
      content: this.state.reply_content,
    }
    Taro.showLoading({
      title: Taro.T._('Publishing'),
      mask: true,
    })
    const replyToAnswer = await api.CourseQA.update_reply(
      this.props.course_code,
      this.props.question_id,
      this.props.reply_id,
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
  handleReply(e) {
    const content = e.detail.value
    this.setState({
      reply_content: content,
      contentLen: content.length.toLocaleString(),
    })
  }
  render() {
    return (
      <View className={`answer ${this.props.half ? 'answer-half' : ''}`}>
        <View className="answer-small-detail">
          {/* this.props.is_anonymous ? (
            <View>{Taro.T._('Anonymous User')}</View>
          ) : (
            <View className="user-info">
              <Avatar
                src={this.state.userInfo.avatar}
                size={32}
                uid={this.props.user_id}
              />
              <View className="userinfo-nickname">
                {this.state.userInfo.nickname}
              </View>
            </View>
          ) */}
          <View>{time.fromNow(this.props.created_at)}</View>
        </View>
        <View className="asr-btn">
          <View className="answer-content">{this.props.content}</View>
          {this.props.edit && (
            <View className="ask-btn" onClick={this.handleModify}>
              {Taro.T._('Modify')}
            </View>
          )}
        </View>
        {this.state.isToastShow && (
          <View className="reply-input-wrapper">
            <Textarea
              value={this.state.reply_content}
              placeholder="我想说..."
              onInput={this.handleReply}
              maxlength={1000}
              className="textarea"
              autoHeight
            />
            <View className="reply-input-toolbar">
              <View className="switch">
                <View className="anoy">匿名</View>
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
                关闭
              </Button>
              <Button
                className="props-right"
                onClick={this.handleReplySubmit.bind(this)}
              >
                提交
              </Button>
            </View>
          </View>
        )}
      </View>
    )
  }
}
