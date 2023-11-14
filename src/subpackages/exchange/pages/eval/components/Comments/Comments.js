import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Avatar from '../../../../../../components/Avatar/Avatar'
import CommentLike from '../../../../../../components/CommentLike/CommentLike'
import './Comments.scss'

export default class Comments extends Component {
  static defaultProps = {
    evalId: 0,
    count: 0,
    comments: [],
  }

  componentDidMount() {
    const { avatar } = Taro.getStorageSync('userInfo') || {}
    if (avatar) {
      this.setState({ avatar })
    }
  }

  navToComments = () => {
    const { evalId, count } = this.props
    Taro.navigateTo({
      url: `/subpackages/comment/pages/comments/comments?evalId=${evalId}&count=${count}`,
    })
  }

  showTextarea = (parentId = null, nickname = undefined) => {
    Taro.eventCenter.trigger('showTextarea', {
      parentId,
      placeholder: nickname
        ? `${Taro.T._('Reply to')} @${nickname}：`
        : undefined,
    })
  }

  render() {
    return (
      <View className="comments-container">
        <View className="comment-title">{Taro.T._('Comments')}</View>
        {this.props.comments.map(comment => (
          <View
            className="comment"
            key={comment.id}
            onClick={this.showTextarea.bind(
              this,
              comment.id,
              comment.user.nickname
            )}
          >
            <View className="left">
              <Avatar
                src={comment.user.avatar}
                size={60}
                uid={comment.user_id}
              />
            </View>
            <View className="right">
              <View className="header">
                <View className="nickname">{comment.user.nickname}</View>
                <CommentLike
                  isLiked={comment.like.length > 0}
                  commentId={comment.id}
                  count={comment.like_count}
                />
              </View>
              <View className="content">{comment.content}</View>
            </View>
          </View>
        ))}
        {this.props.comments.length === 0 ? (
          <View className="placeholder">
            {/* <UIcon icon-class='comment-icon' icon='interactive-o' /> */}
            <Image
              className="comment-icon"
              src="https://i.loli.net/2018/07/17/5b4daa33defa8.png"
            />
            <View className="hint">
              {Taro.T._('No one has commented yet')} ╮(╯▽╰)╭
            </View>
          </View>
        ) : (
          <View className="see-all-link" onClick={this.navToComments}>
            {`${Taro.T._('See all')} ${this.props.count} ${Taro.T._(
              'comments'
            )}`}
          </View>
        )}
        <View className="comment-bar">
          <View className="avatar">
            <Avatar src={this.state.avatar} size={60} />
          </View>
          <View className="input-area" onClick={this.showTextarea}>
            {Taro.T._('Post a comment')}
          </View>
          {/* <UIcon icon-class='send-icon' icon='enterinto' /> */}
        </View>

        <View className="header">
          {/* <View className='nickname'>{this.props.author.nickname}</View>
          <UIcon icon={helper.parseGender(this.props.author.gender)} /> */}
        </View>
        <View className="content">
          <Text>{this.props.theEval.content}</Text>
        </View>
        <View className="footer" />
      </View>
    )
  }
}
