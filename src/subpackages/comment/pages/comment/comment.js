import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import TextareaToast from '../../../../components/TextareaToast/TextareaToast'
import Loading from '../../../../components/Loading/Loading'
import BottomBar from '../comments/components/BottomBar/BottomBar'
import Comments from './components/Comments'
import api from '../../../../utils/api'
import './comment.scss'

export default class Comment extends Component {
  state = {
    parent: { user: {} },
    children: [],
    isFinished: false,
    orderBy: 'like_count',
  }

  componentWillMount() {
    this.initBrowse()
    this.fetchNextComments()
  }

  onReachBottom() {
    this.fetchNextComments()
  }

  initBrowse = (order = this.state.orderBy) => {
    const { id, evalId, topicId } = this.$router.params
    if (!!evalId) {
      this.browse = api.Comments.retrieve(id, { order })
    } else if (!!topicId) {
      this.browse = api.TopicComments.retrieve(id, { order })
    }
  }

  fetchNextComments = async () => {
    const next = this.browse.next()
    const data = await next.value
    if (!next.done && data.child_comment.length > 0) {
      const { child_comment } = data
      delete data.child_comment
      this.setState(prevState => {
        return {
          parent: data,
          children: prevState.children.concat(child_comment),
          isFinished: child_comment.length < 10,
        }
      })
    } else {
      this.setState({ isFinished: true })
    }
  }

  refreshComments = (newOrder = this.state.orderBy) => {
    if (newOrder !== this.state.orderBy) {
      this.setState({ orderBy: newOrder })
    }
    this.refreshChildren()
    this.initBrowse(newOrder)
    this.fetchNextComments()
  }

  refreshChildren = () => {
    return new Promise(r => {
      this.setState({ children: [], isFinished: false }, () => r())
    })
  }

  render() {
    const { id, evalId, topicId } = this.$router.params
    const commentType = evalId ? 'eval' : 'topic'

    return (
      <View className="comment-page">
        <Navigation title={Taro.T._('Reply Details')} />
        {this.state.parent.content && (
          <Comments
            parent={this.state.parent}
            childs={this.state.children}
            type={commentType}
          />
        )}
        {!this.state.isFinished && <Loading color="primary" />}
        <BottomBar
          params={{
            parentId: id,
            placeholder: `${Taro.T._('Reply to')} @${
              this.state.parent.user.nickname
            }：`,
          }}
          onOrderChange={this.refreshComments}
        />
        <TextareaToast
          evalId={evalId}
          topicId={topicId}
          onSubmit={this.refreshComments}
        />
      </View>
    )
  }
}
