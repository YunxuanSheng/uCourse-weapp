import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Avatar from '../../../../../../components/Avatar/Avatar'
import CommentLike from '../../../../../../components/CommentLike/CommentLike'
import time from '../../../../../../utils/time'
import './CommentList.scss'

export default class CommentList extends Component {
  static defaultProps = {
    evalId: null,
    topicId: null,
    rows: [],
  }

  navToComment = (id, e) => {
    e.stopPropagation()
    if (!!this.props.evalId) {
      Taro.navigateTo({
        url: `/subpackages/comment/pages/comment/comment?id=${id}&evalId=${this.props.evalId}`,
      })
    } else if (!!this.props.topicId) {
      Taro.navigateTo({
        url: `/subpackages/comment/pages/comment/comment?id=${id}&topicId=${this.props.topicId}`,
      })
    }
  }

  showTextarea = (parentId, nickname) => {
    Taro.eventCenter.trigger('showTextarea', {
      parentId,
      placeholder: `${Taro.T._('Reply to')} @${nickname}：`,
    })
  }

  render() {
    const commentType = this.props.evalId ? 'eval' : 'topic'

    return (
      <View className="comments-container">
        <View className="comments">
          {this.props.rows.map(c => (
            <View
              className="comment"
              key={c.id}
              onClick={this.showTextarea.bind(this, c.id, c.user.nickname)}
            >
              <View className="left">
                <Avatar src={c.user.avatar} size={60} uid={c.user_id} />
              </View>
              <View className="right">
                <View className="header">
                  <View className="left">
                    <View className="nickname">{c.user.nickname}</View>
                    <View className="time">
                      {time.fromNowOrFormat(c.created_at)}
                    </View>
                  </View>
                  <View className="like">
                    <CommentLike
                      isLiked={c.like.length > 0}
                      commentId={c.id}
                      count={c.like_count}
                      type={commentType}
                    />
                  </View>
                </View>
                <View className="content">{c.content}</View>
                <View
                  className="children"
                  onClick={this.navToComment.bind(this, c.id)}
                >
                  {c.child_comment.map(cc => (
                    <View className="child" key={cc.id}>
                      <View className="content">
                        <Text className="nickname">{cc.user.nickname}：</Text>
                        {cc.content}
                      </View>
                    </View>
                  ))}
                  {c.comment_count > 2 && (
                    <View className="see-all-link">
                      {`${Taro.T._('See all')} ${c.comment_count} ${Taro.T._(
                        'replies'
                      )}`}
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
