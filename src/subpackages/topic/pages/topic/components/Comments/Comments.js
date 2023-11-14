import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CommentList from '../../../../../comment/pages/comments/components/CommentList/CommentList'
import Loading from '../../../../../../components/Loading/Loading'
import api from '../../../../../../utils/api'

export default class Comments extends Component {
  state = {
    rows: [],
    isFinished: false,
  }

  static defaultProps = {
    topicId: null,
  }

  componentWillMount() {
    this.initBrowse()
    this.fetchNext()
    Taro.eventCenter.on('onReachTopicBottom', () => {
      this.fetchNext()
    })
    Taro.eventCenter.on('onRefreshComments', () => {
      this.refreshRows()
      this.initBrowse()
      this.fetchNext()
    })
  }

  initBrowse = (order = 'like_count') => {
    this.browse = api.TopicComments.browse({
      topicId: this.props.topicId,
      order,
    })
  }

  fetchNext = async () => {
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

  render() {
    return (
      <View>
        <CommentList rows={this.state.rows} topicId={this.props.topicId} />
        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
