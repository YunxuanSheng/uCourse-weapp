import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Loading from '../../../../components/Loading/Loading'
import CommentList from './components/CommentList/CommentList'
import BottomBar from './components/BottomBar/BottomBar'
import TextareaToast from '../../../../components/TextareaToast/TextareaToast'
import api from '../../../../utils/api'
import './comments.scss'

export default class Comments extends Component {
  state = {
    rows: [],
    isFinished: false,
    orderBy: 'like_count',
  }

  async componentWillMount() {
    // const { avatar } = Taro.getStorageSync('userInfo')
    this.initBrowse()
    this.fetchNextComments()
  }

  onReachBottom() {
    this.fetchNextComments()
  }

  initBrowse = (order = 'like_count') => {
    const { evalId } = this.$router.params
    this.browse = api.Comments.browse({ evalId, order })
  }

  fetchNextComments = async () => {
    const next = this.browse.next()
    const rows = await next.value
    if (!next.done && rows.length > 0) {
      this.setState(prevState => {
        return {
          rows: prevState.rows.concat(rows),
          isFinished: rows.length < 10,
        }
      })
    } else {
      this.setState({ isFinished: true })
    }
  }

  refreshRows = () => {
    return new Promise(r => {
      this.setState({ rows: [], isFinished: false }, () => r())
    })
  }

  refreshComments = (newOrder = this.state.orderBy) => {
    if (newOrder !== this.state.orderBy) {
      this.setState({ orderBy: newOrder })
    }
    this.refreshRows()
    this.initBrowse(newOrder)
    this.fetchNextComments()
  }

  render() {
    const { count, evalId } = this.$router.params
    return (
      <View className="comments-page">
        <Navigation
          title={`${Taro.T._('All')} ${count} ${Taro.T._('comments')}`}
        />
        <CommentList rows={this.state.rows} evalId={evalId} />
        {!this.state.isFinished && <Loading color="primary" />}
        <BottomBar onOrderChange={this.refreshComments} />
        <TextareaToast evalId={evalId} onSubmit={this.refreshComments} />
      </View>
    )
  }
}
