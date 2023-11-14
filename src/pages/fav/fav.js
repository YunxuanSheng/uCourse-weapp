import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../components/Navigation/Navigation'
import Avatar from '../../components/Avatar/Avatar'
import Rate from '../../components/Rate/Rate'
import Loading from '../../components/Loading/Loading'
import Abnor from '../../components/Abnor/Abnor'
import helper from '../../utils/helper'
import api from '../../utils/api'
import time from '../../utils/time'
import './fav.scss'

export default class FavPage extends Component {
  state = {
    evals: [],
    isFinished: false,
  }

  componentWillMount() {
    this.initBrowse()
    this.fetchFavEval()
  }

  onReachBottom() {
    this.fetchFavEval()
  }

  initBrowse = () => {
    this.browse = api.Users.Favs.Evals.browse()
  }

  fetchFavEval = async () => {
    const next = this.browse.next()
    const rows = await next.value
    if (!next.done && rows.length > 0) {
      this.setState(prevState => {
        return {
          evals: prevState.evals.concat(rows),
          isFinished: rows.length < 10,
        }
      })
    } else {
      this.setState({ isFinished: true })
    }
  }

  navTo = (url, params, e) => {
    if (e) {
      e.stopPropagation()
    }
    if (url === '/subpackages/course/pages/course/course') {
      const title = params.title
      const code = params.code
      const school_code = params.school_code || params.belongsTo.code
      Taro.navigateTo({
        url: `${url}?title=${title}&code=${code}&school_code=${school_code}`,
      })
    } else if (url === '/subpackages/eval/pages/eval/eval') {
      Taro.navigateTo({
        url: `${url}?title=${params.course.title}&id=${params.id}`,
      })
    } else {
      Taro.navigateTo({ url })
    }
  }

  render() {
    return (
      <View className="fav-page">
        <Navigation title={Taro.T._('My Favorite')} />
        {this.state.evals.map(favEval => {
          const { score_design, score_qlty, score_spl } = favEval.eval
          const score_comp = helper.calcScoreComp({
            score_design,
            score_qlty,
            score_spl,
          })
          const createdAt = time.fromNow(favEval.eval.created_at)
          const schoolCode =
            favEval.eval.course &&
            favEval.eval.course.school_code.replace('CSC-', '')

          return (
            <View
              key={favEval.eval.id}
              className="eval-card"
              onClick={this.navTo.bind(
                this,
                '/subpackages/eval/pages/eval/eval',
                favEval.eval
              )}
            >
              <View className="header">
                <View className="header-left">
                  <View>
                    <Avatar
                      src={favEval.eval.user.avatar}
                      uid={favEval.eval.user.id}
                      size={32}
                    />
                  </View>
                  <View className="nickname">{favEval.eval.user.nickname}</View>
                </View>
                <View className="header-right">
                  <View className={'school ' + favEval.eval.course.school_code}>
                    {schoolCode}
                  </View>
                  <Rate defaultValue={score_comp} disabled size={32} />
                </View>
              </View>

              <View className="content">
                <View
                  className="content-title"
                  onClick={this.navTo.bind(
                    this,
                    '/subpackages/course/pages/course/course',
                    favEval.eval.course
                  )}
                >
                  {favEval.eval.course.title}
                </View>
                <View className="content-short">
                  {favEval.eval.content_short}
                </View>
              </View>

              <View className="footer">
                <View className="footer-left">
                  {`${favEval.eval.vote_pro_count} ${Taro.T._('Pros')}`}
                </View>
                <View className="footer-right">{createdAt}</View>
              </View>
            </View>
          )
        })}
        {this.state.isFinished && this.state.evals.length === 0 && (
          <Abnor title={Taro.T._('No favorites')} />
        )}
        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
