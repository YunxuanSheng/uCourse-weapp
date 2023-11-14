import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../UIcon/UIcon'
import api from '../../utils/api'

import './TopicCourseVote.scss'

export default class CommentLike extends Component {
  static defaultProps = {
    isVoted: false,
    count: 0,
    topicCourseId: null,
    courseCode: null,
  }

  state = {
    hasInited: false,
    isVotedState: false,
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
      isVotedState: props.isVoted,
      countState: props.count,
    })
  }

  handleVote = async e => {
    e.stopPropagation()
    if (this.state.isVotedState) {
      return
    } else {
      // create
      Taro.vibrateShort()
      api.Topics.Courses.Votes.create({
        topicCourseId: this.props.topicCourseId,
      })
      this.setState(prevState => ({
        isVotedState: true,
        countState: ++prevState.countState,
      }))

      // nav to course page
      const { confirm } = await Taro.showModal({
        title: Taro.T._('Voted'),
        content: Taro.T._(
          'Voted! Would you like to provide a more detailed feedback for this course?'
        ),
        confirmColor: '#ff9800',
        confirmText: Taro.T._('OK'),
        cancelText: Taro.T._('Later'),
      })
      if (confirm) {
        Taro.navigateTo({
          url:
            '/subpackages/course/pages/course/course?code=' +
            this.props.courseCode,
        })
      }
    }
  }

  render() {
    return (
      <View className="topic-course-vote" onClick={this.handleVote}>
        <UIcon
          icon-class={`icon${this.state.isVotedState ? '' : '-o'}`}
          icon={`praise${this.state.isVotedState ? '' : '-o'}`}
        />
        {this.state.countState}
      </View>
    )
  }
}
