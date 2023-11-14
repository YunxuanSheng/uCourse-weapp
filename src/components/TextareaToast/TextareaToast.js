import Taro, { Component } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import Btn from '../Btn/Btn'
import api from '../../utils/api'
import './TextareaToast.scss'

export default class TextareaToast extends Component {
  static defaultProps = {
    evalId: null,
    topicId: null,
    onSubmit: () => {},
  }

  state = {
    content: '',
    wordLen: 0,
    parentId: null,
    toUserId: null,
    placeholder: '评论……',
    show_state: false,
    initPos: 0,
  }

  componentWillMount() {
    this.setState({
      placeholder: Taro.T._('Comment...'),
    })
  }

  componentDidMount() {
    console.log('mount textarea')
    const initPos = Taro.getCurrentPages().length
    this.setState({ initPos })
    Taro.eventCenter.on(
      'showTextarea',
      ({
        parentId = null,
        placeholder = Taro.T._('Comment...'),
        toUserId = null,
      } = {}) => {
        console.log('show textarea')
        const currentPos = Taro.getCurrentPages().length
        if (currentPos !== this.state.initPos) {
          // 防止页面隐藏后通过另一个 TextareaToast 触发此方法
          return
        }
        console.log({ parentId, placeholder, toUserId })
        this.setState({
          parentId,
          placeholder,
          toUserId,
          content: '',
          wordLen: 0,
          show_state: true,
        })
      }
    )
  }

  // componentWillUnmount() {
  //   console.log('unmount textarea')
  //   Taro.eventCenter.off('showTextarea')
  // }

  hideTextarea = () => {
    this.setState({ show_state: false })
  }

  handleInput = e => {
    const { value } = e.detail
    const wordLen = value.length
    this.setState({ content: value, wordLen })
  }

  handleSubmit = async () => {
    try {
      Taro.showLoading({
        title: Taro.T._('Sending'),
        mask: true,
      })
      const obj = {
        parentId: this.state.parentId,
        toUserId: this.state.toUserId,
        content: this.state.content,
      }
      if (this.props.evalId) {
        obj.evalId = this.props.evalId
        await api.Comments.create(obj)
      } else if (this.props.topicId) {
        obj.topicId = this.props.topicId
        await api.TopicComments.create(obj)
      }

      // console.log(this)
      // this.hideTextarea()
      this.setState({ show_state: false })
      this.props.onSubmit()
    } catch (e) {
      console.error(e)
    } finally {
      Taro.hideLoading()
    }
  }

  render() {
    return (
      <View className={`textarea-toast ${this.state.show_state ? 'show' : ''}`}>
        <View className="mask" onClick={this.hideTextarea} />
        <View className="toast">
          <View className="textarea-container">
            <Textarea
              className="textarea"
              placeholder={this.state.placeholder}
              focus={this.props.show}
              maxLength={140}
              value={this.state.content}
              onInput={this.handleInput}
            />
            <View className="wordLen">{this.state.wordLen} / 140</View>
          </View>
          <View className="send-btn">
            <Btn
              type="primary"
              text={Taro.T._('Send')}
              disabled={this.state.wordLen === 0}
              onClick={this.handleSubmit}
            />
          </View>
        </View>
      </View>
    )
  }
}
