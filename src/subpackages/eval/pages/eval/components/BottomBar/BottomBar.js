import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import UIcon from '../../../../../../components/UIcon/UIcon'

import api from '../../../../../../utils/api'
import helper from '../../../../../../utils/helper'

import './BottomBar.scss'

export default class BottomBar extends Component {
  static defaultProps = {
    evalId: null,
    pro: null,
    con: null,
    myVote: null,
    myFav: null,
    count: 0, // comment count
    isMyEval: false,
    onShowShareAS: () => {},
    onShowTrans: () => {
      Taro.eventCenter.trigger('showTrans')
    },
  }

  state = {
    hasInited: false,
    proIcon: 'spin',
    conIcon: 'spin',
    proCount: 0,
    conCount: 0,
    isFaved: false,
    vote: {},
    isTranslated: false,
  }

  componentWillReceiveProps(props) {
    this.initData(props)
  }

  componentWillUnmount() {
    this.handleFavTask()
    this.handleVoteTask()
  }

  initData = props => {
    if (!this.state.hasInited && props.pro !== null) {
      const { myVote, myFav, pro = 0, con = 0 } = props
      this.setState({
        hasInited: true,
        vote: myVote || {},
        isFaved: !!myFav,
        proIcon: 'packup',
        conIcon: 'unfold',
        proCount: pro,
        conCount: con,
      })
    }
  }

  handleVote = async type => {
    const isLoading = [this.state.proIcon, this.state.conIcon].some(
      icon => icon === 'spin'
    )
    if (isLoading) {
      return
    }

    try {
      this.handleVoteState(type === 1 ? 'pro' : 'con')
    } catch (e) {
      throw e
    }
  }

  handleVoteState = async (voteType = 'pro') => {
    const unvoteType = voteType === 'pro' ? 'con' : 'pro'
    const voteTypeNum = voteType === 'pro' ? 1 : 2
    const unvoteTypeNum = voteType === 'pro' ? 2 : 1

    const { type } = this.state.vote
    let vote = {}
    if (type === voteTypeNum) {
      // cancel
      // await api.Votes.delete(id)
      Taro.setStorageSync('voteEvalTask', {
        evalId: this.props.evalId,
        type: 'delete',
      })
      vote = {}
      this.setState(prevState => ({
        [voteType + 'Count']: --prevState[voteType + 'Count'],
      }))
    } else if (type === unvoteTypeNum) {
      // flip
      // vote = await api.Votes.update(id, { type: 1 })
      Taro.vibrateShort()
      Taro.setStorageSync('voteEvalTask', {
        evalId: this.props.evalId,
        type: voteType,
      })
      vote = { type: voteTypeNum }
      this.setState(prevState => ({
        [voteType + 'Count']: ++prevState[voteType + 'Count'],
        [unvoteType + 'Count']: --prevState[unvoteType + 'Count'],
      }))
    } else {
      // new
      // vote = await api.Votes.create({ evalId: this.props.evalId, type: 1 })
      Taro.vibrateShort()
      Taro.setStorageSync('voteEvalTask', {
        evalId: this.props.evalId,
        type: voteType,
      })
      vote = { type: voteTypeNum }
      this.setState(prevState => ({
        [voteType + 'Count']: ++prevState[voteType + 'Count'],
      }))
    }
    this.setState({ vote })
  }

  handleFavEval = () => {
    if (this.state.isFaved) {
      // cancel
      Taro.setStorageSync('favEvalTask', {
        evalId: this.props.evalId,
        type: 'delete',
      })
      Taro.showToast({
        title: Taro.T._('Cancel favorite'),
        icon: 'none',
      })
      this.setState({ isFaved: false })
    } else {
      // fav
      Taro.vibrateShort()
      Taro.setStorageSync('favEvalTask', {
        evalId: this.props.evalId,
        type: 'post',
      })
      Taro.showToast({
        title: Taro.T._('Favorited'),
        icon: 'none',
      })
      this.setState({ isFaved: true })
    }
  }

  handleVoteTask = () => {
    const { evalId, type } = Taro.getStorageSync('voteEvalTask')
    if (type === 'pro' || type === 'con') {
      const voteTypeNum = type === 'pro' ? 1 : 2
      if (!this.props.myVote) {
        // new
        api.Votes.create({ evalId: evalId, type: voteTypeNum })
      } else if (this.props.myVote.type !== voteTypeNum) {
        // update
        api.Votes.update(this.props.myVote.id, {
          type: voteTypeNum,
        })
      }
    } else if (type === 'delete' && !!this.props.myVote) {
      // delete
      api.Votes.delete(this.props.myVote.id)
    }
    Taro.removeStorage({ key: 'voteEvalTask' })
  }

  handleFavTask = () => {
    const { evalId, type } = Taro.getStorageSync('favEvalTask')
    if (type === 'post' && !this.props.myFav) {
      api.Users.Favs.Evals.create({ evalId })
    } else if (type === 'delete' && !!this.props.myFav) {
      api.Users.Favs.Evals.delete(this.props.myFav.id)
    }
    Taro.removeStorage({ key: 'favEvalTask' })
  }

  navToComments = () => {
    const { evalId, count } = this.props
    Taro.navigateTo({
      url: `/subpackages/comment/pages/comments/comments?evalId=${evalId}&count=${count}`,
    })
  }

  navToEvalNew = () => {
    const { evalId } = this.props
    const mode = 'edit'
    Taro.navigateTo({
      url: `/subpackages/eval/pages/eval-new/eval-new?id=${evalId}&mode=${mode}`,
    })
  }

  handleShowShareAS = () => {
    this.props.onShowShareAS()
  }

  handleShowMore = async () => {
    const { tapIndex } = await Taro.showActionSheet({
      itemList: [Taro.T._('Report')],
      itemColor: '#e64340',
    })
    if (tapIndex === 0) {
      // 举报
      // TODO: nav to a new page to complete this step
      Taro.showToast({
        title: Taro.T._('Reported'),
        icon: 'none',
      })
    }
  }

  handleShowTrans = () => {
    // this.props.onShowTrans()
    this.setState(prevState => ({
      isTranslated: !prevState.isTranslated,
    }))
    Taro.eventCenter.trigger('showTrans')
  }

  render() {
    return (
      <View className="bottom-bar">
        <View className="vote-btns">
          <View
            className={`vote-btn ${this.state.vote.type === 1 ? 'active' : ''}`}
            onClick={this.handleVote.bind(this, 1)}
          >
            <UIcon icon={this.state.proIcon} />
            <Text className="pro-detail">
              {`${this.state.proCount} ${Taro.T._('Pros')}`}
            </Text>
          </View>
          <View
            className={`vote-btn ${this.state.vote.type === 2 ? 'active' : ''}`}
            onClick={this.handleVote.bind(this, 2)}
          >
            <UIcon icon={this.state.conIcon} />
          </View>
        </View>

        <View className="func-btns">
          {this.props.isMyEval && (
            <View className="func-btn" onClick={this.navToEvalNew}>
              <UIcon icon="brush" />
            </View>
          )}
          {this.props.evalId && (
            <View className="func-btn" onClick={this.handleFavEval}>
              <UIcon
                icon-class={this.state.isFaved ? 'active' : ''}
                icon="collection"
              />
            </View>
          )}
          <View className="func-btn" onClick={this.navToComments}>
            <UIcon icon="message" />
          </View>
          <View className="func-btn" onClick={this.handleShowShareAS}>
            <UIcon icon="share" />
          </View>
          <View className="func-btn" onClick={this.handleShowTrans}>
            <UIcon
              icon-class={this.state.isTranslated ? 'active' : ''}
              icon="translate"
            />
          </View>
          <View className="func-btn" onClick={this.handleShowMore}>
            <UIcon icon="more" />
          </View>
        </View>
      </View>
    )
  }
}
