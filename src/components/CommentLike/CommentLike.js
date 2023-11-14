import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../UIcon/UIcon'
import api from '../../utils/api'

import './CommentLike.scss'

export default class CommentLike extends Component {
  static defaultProps = {
    isLiked: false,
    count: 0,
    commentId: null,
    type: 'eval',
  }

  state = {
    hasInited: false,
    isLikedState: false,
    countState: 0,
  }

  componentWillMount() {
    if (!this.state.hasInited) {
      this.initState(this.props)
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.hasInited) {
      this.initState(props)
    }
  }

  initState = props => {
    this.setState({
      hasInited: true,
      isLikedState: props.isLiked,
      countState: props.count,
    })
  }

  handleLike = async e => {
    e.stopPropagation()
    if (this.state.isLikedState) {
      return
    } else {
      // create
      Taro.vibrateShort()
      if (this.props.type === 'eval') {
        api.CommentLikes.create({ commentId: this.props.commentId })
      } else if (this.props.type === 'topic') {
        api.TopicCommentLikes.create({ commentId: this.props.commentId })
      }

      this.setState(prevState => ({
        isLikedState: true,
        countState: ++prevState.countState,
      }))
    }
  }

  render() {
    return (
      <View className="comment-like" onClick={this.handleLike}>
        <UIcon
          icon-class="icon"
          icon={`like${this.state.isLikedState ? '' : '-o'}`}
        />
        {this.state.countState}
      </View>
    )
  }
}
