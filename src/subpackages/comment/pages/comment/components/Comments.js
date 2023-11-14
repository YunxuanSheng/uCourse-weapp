import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Avatar from '../../../../../components/Avatar/Avatar'
import CommentLike from '../../../../../components/CommentLike/CommentLike'
import time from '../../../../../utils/time'
import './Comments.scss'

export default class Comments extends Component {
  static defaultProps = {
    parent: { comment_count: 0, user: {}, like: 0 },
    childs: [],
    type: 'eval',
  }

  showTextarea = (parentId, nickname, userId) => {
    Taro.eventCenter.trigger('showTextarea', {
      parentId,
      placeholder: `${Taro.T._('Reply to')} @${nickname}：`,
      toUserId: userId,
    })
  }

  render() {
    return (
      <View className="comments">
        <View
          className="comment"
          key={this.props.parent.id}
          onClick={this.showTextarea.bind(
            this,
            this.props.parent.id,
            this.props.parent.user.nickname
          )}
        >
          <View className="left">
            <Avatar
              src={this.props.parent.user && this.props.parent.user.avatar}
              size={60}
              uid={this.props.parent.user_id}
            />
          </View>
          <View className="right">
            <View className="header">
              <View className="left">
                <View className="nickname">
                  {this.props.parent.user.nickname}
                </View>
                <View className="time">
                  {time.fromNowOrFormat(this.props.parent.created_at)}
                </View>
              </View>
              <View className="like">
                <CommentLike
                  isLiked={this.props.parent.like.length > 0}
                  commentId={this.props.parent.id}
                  count={this.props.parent.like_count}
                  type={this.props.type}
                />
              </View>
            </View>
            <View className="content">{this.props.parent.content}</View>
          </View>
        </View>

        <View className="children">
          <View className="count">
            {`${this.props.parent.comment_count} ${Taro.T._('replies')}`}
          </View>
          {this.props.childs.map(c => (
            <View
              className="comment"
              key={c.id}
              onClick={this.showTextarea.bind(
                this,
                this.props.parent.id,
                c.user.nickname,
                c.user_id
              )}
            >
              <View className="left">
                <Avatar
                  src={c.user && c.user.avatar}
                  size={60}
                  uid={c.user_id}
                />
              </View>
              <View className="right">
                <View className="header">
                  <View className="left">
                    <View className="nickname">
                      {c.user.nickname}
                      {c.user_to && c.user_to.nickname
                        ? ` @${c.user_to.nickname}`
                        : ''}
                    </View>
                    <View className="time">
                      {time.fromNowOrFormat(c.created_at)}
                    </View>
                  </View>
                  <View className="like">
                    <CommentLike
                      isLiked={c.like.length > 0}
                      commentId={c.id}
                      count={c.like_count}
                      type={this.props.type}
                    />
                  </View>
                </View>
                <View className="content">{c.content}</View>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
