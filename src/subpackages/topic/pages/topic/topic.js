import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Tabs from '../../../../components/Tabs/Tabs'
import TextareaToast from '../../../../components/TextareaToast/TextareaToast'
import TopicInfo from './components/TopicInfo/TopicInfo'
import TopicCourses from './components/TopicCourses/TopicCourses'
import Comments from './components/Comments/Comments'
import FloatHint from './components/FloatHint/FloatHint'
import Btns from './components/Btns/Btns'
import api from '../../../../utils/api'

import './topic.scss'

export default class Topic extends Component {
  state = {
    topicId: null,
    topicInfo: {},
    activeTabIndex: 0,
  }

  componentWillMount() {
    if (this.$router.params.scene) {
      const scene = decodeURIComponent(this.$router.params.scene)
      this.$router.params.id = scene
    }
    const { id } = this.$router.params
    this.fetchTopic(id)
    this.setState({
      topicId: id,
      statusBarHeight: Taro.systemInfo.statusBarHeight,
    })
  }

  fetchTopic = async id => {
    const topic = await api.Topics.retrieve(id)
    this.setState({ topicInfo: topic })
  }

  onTabChange = index => {
    this.setState({ activeTabIndex: index })
  }

  handleCommentSubmit = () => {
    Taro.showToast({ title: Taro.T._('Sent') })
    Taro.eventCenter.trigger('onRefreshComments')
  }

  onReachBottom() {
    Taro.eventCenter.trigger('onReachTopicBottom')
  }

  onShareAppMessage() {
    const {
      topicId: id,
      topicInfo: { title },
    } = this.state

    const { nickname } = Taro.getStorageSync('userInfo')
    return {
      title: `${nickname} ${Taro.T._('invites you to talk about')}: ${title}`,
      path: `/subpackages/topic/pages/topic/topic?id=${id}`,
    }
  }

  render() {
    return (
      <View className="topic-page">
        <Navigation title={this.state.topicInfo.title || Taro.T._('Topic')} />

        <TopicInfo
          title={this.state.topicInfo.title}
          img={this.state.topicInfo.img}
          description={this.state.topicInfo.description}
          is_ended={this.state.topicInfo.is_ended}
        />

        <View
          className="tab-container"
          style={`top: ${this.state.statusBarHeight + 46}px`}
        >
          <Tabs
            tabs={[Taro.T._('Ranking'), Taro.T._('Comments')]}
            onChange={this.onTabChange}
          />
        </View>

        {this.state.topicId &&
          this.state.activeTabIndex === 0 && (
            <TopicCourses topicId={this.state.topicId} />
          )}

        {this.state.topicId &&
          this.state.activeTabIndex === 1 && (
            <Comments topicId={this.state.topicId} />
          )}

        {this.state.topicId && (
          <TextareaToast
            topicId={this.state.topicId}
            onSubmit={this.handleCommentSubmit}
          />
        )}

        <FloatHint />

        {this.state.topicId && (
          <Btns topicId={this.state.topicId} topicInfo={this.state.topicInfo} />
        )}
      </View>
    )
  }
}
