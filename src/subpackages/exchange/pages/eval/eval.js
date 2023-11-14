import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import EvalContent from './components/EvalContent/EvalContent'
import BottomBar from './components/BottomBar/BottomBar'
import Comments from './components/Comments/Comments'
import TextareaToast from '../../../../components/TextareaToast/TextareaToast'
import Skeleton from './components/Skeleton/Skeleton'
import ShareActionSheet from '../../../../components/ShareActionSheet/ShareActionSheet'
import UIcon from '../../../../components/UIcon/UIcon'
import FormIdReporter from '../../../../components/FormIdReporter/FormIdReporter'
import UAd from '../../../../components/UAd/UAd'
import helper from '../../../../utils/helper'
import api from '../../../../utils/api'
import palette from './palette'

import './eval.scss'

export default class Eval extends Component {
  state = {
    theEval: {},
    author: {},
    myVote: null,
    myFav: null,
    comments: [],
    isLoading: true,
    show: false,
    title: '',
    palette: null,
    isMyEval: false,
    showRedirectNav: false,
  }

  componentWillMount() {
    this.setState({ title: this.$router.params.title })
    this.initRedirectNav()
    if (this.$router.params.scene) {
      const scene = decodeURIComponent(this.$router.params.scene)
      this.$router.params.id = scene
    }

    this.fetchEval()
    // this.fetchComments()
    this.registerEvents()
  }

  componentWillUnmount() {
    Taro.eventCenter.off('refreshEval')
  }

  onShareAppMessage() {
    const {
      title,
      author: { nickname },
      theEval: { id },
    } = this.state

    return {
      title: `${title} - ${nickname}${Taro.T._("'s Evaluation")}`,
      path: `/subpackages/exchange/pages/eval/eval?title=${title}&id=${id}`,
    }
  }

  fetchEval = async () => {
    const { id } = this.$router.params
    const theEval = await api.Exchanges.Evals.retrieve(id)
    const { user, my_vote, my_fav } = theEval
    const isMyEval = Taro.getStorageSync('userInfo').id === user.id
    this.setState({
      title: theEval.exchange_school.title,
      theEval,
      author: user,
      myVote: my_vote,
      myFav: my_fav,
      isLoading: false,
      isMyEval,
    })
  }

  fetchComments = async () => {
    const { id } = this.$router.params
    const comments = await api.Comments.browse({
      evalId: id,
      limit: 2,
      order: 'like_count',
    }).next().value
    this.setState({
      comments,
    })
  }

  registerEvents = () => {
    Taro.eventCenter.on('refreshEval', () => {
      this.setState({ isLoading: true })
      this.fetchEval()
      this.fetchComments()
    })
  }

  refreshComments = () => {
    const { id, comment_count } = this.state.theEval
    Taro.navigateTo({
      url: `/subpackages/comment/pages/comments/comments?evalId=${id}&count=${comment_count}`,
    })
  }

  handleShowShareAS = () => {
    this.setState({ show: true })
  }

  handleCloseShareAS = () => {
    this.setState({ show: false })
  }

  handleAskForPalette = async () => {
    Taro.showLoading({ title: Taro.T._('Preparing to draw') })
    const url = await api.Qr.get({
      page: 'subpackages/exchange/pages/eval/eval',
      scene: this.$router.params.id,
      auto_color: true,
    })
    Taro.hideLoading()
    console.log(url)
    console.log('qr code got')
    const {
      user: { avatar, nickname },
      content,
    } = this.state.theEval
    const newPalette = helper.paletteReplacer({
      palette,
      replaceMap: {
        __QRCODE__: url,
        __AVATAR__: avatar,
        __NICKNAME__: nickname,
        __CONTENT__: content,
        __TITLE__: this.state.title,
      },
    })
    console.log(newPalette)
    this.setState({ palette: newPalette })
  }

  handlePosterSuccess = () => {
    this.setState({ palette: {} })
    Taro.showToast({
      title: Taro.T._('Long press to save the picture'),
      icon: 'none',
    })
  }

  initRedirectNav = () => {
    const pages = Taro.getCurrentPages()
    const noNavBack = pages.length === 1
    const notCourseParent =
      pages.length > 1 &&
      pages[pages.length - 2].route !==
        'subpackages/exchange/pages/school/school'
    if (noNavBack || notCourseParent) {
      this.setState({ showRedirectNav: true })
    }
  }

  navToSchool = () => {
    if (this.state.showRedirectNav) {
      const { id } = this.state.theEval.exchange_school
      Taro.redirectTo({
        url: `/subpackages/exchange/pages/school/school?id=${id}`,
      })
    }
  }

  render() {
    return (
      <FormIdReporter>
        <View className="eval-page">
          <Navigation align="left">
            <View className="nav" onClick={this.navToSchool}>
              <View className="title">{this.state.title}</View>
              {this.state.showRedirectNav && (
                <View className="see-all">
                  {Taro.T._('See all evaluations')}
                  <UIcon icon="enter" />
                </View>
              )}
            </View>
          </Navigation>

          {this.state.isLoading ? (
            <Skeleton />
          ) : (
            <View>
              <CensorshipHint
                show={this.state.theEval.is_censored}
                reason={this.state.theEval.censor_reason}
              />

              <EvalContent
                theEval={this.state.theEval}
                author={this.state.author}
              />
              {/*
              <Comments
                evalId={this.state.theEval.id}
                comments={this.state.comments}
                count={this.state.theEval.comment_count}
              />
              */}

              <UAd unitId="adunit-d6a7f6588dd59a4a" />

              <TextareaToast
                evalId={this.state.theEval.id}
                onSubmit={this.refreshComments}
              />
              <ShareActionSheet
                show={this.state.show}
                onClose={this.handleCloseShareAS}
                onAskForPalette={this.handleAskForPalette}
                palette={this.state.palette}
                onPosterSuccess={this.handlePosterSuccess}
              />
            </View>
          )}

          <BottomBar
            evalId={this.state.theEval.id}
            pro={this.state.theEval.vote_pro_count}
            myVote={this.state.myVote}
            myFav={this.state.myFav}
            count={this.state.theEval.comment_count}
            onShowShareAS={this.handleShowShareAS}
            isMyEval={this.state.isMyEval}
          />
        </View>
      </FormIdReporter>
    )
  }
}
