import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import PicWall from './components/PicWall/PicWall'
import UIcon from '../../../../components/UIcon/UIcon'
import SchoolInfo from './components/SchoolInfo/SchoolInfo'
import Btn from '../../../../components/Btn/Btn'
import Abnor from '../../../../components/Abnor/Abnor'
import EvalList from './components/EvalList/EvalList'
import Loading from '../../../../components/Loading/Loading'
import helper from '../../../../utils/helper'
import api from '../../../../utils/api'

/**
 * TODO: Simplify Import Path
 * Reference: https://dev.to/georgedoescode/simplify-your-imports-with-webpack-aliases-59f
 */
import { flags } from '../../../../utils/data'

import './school.scss'

export default class School extends Component {
  state = {
    school: {},
    imgList: [],
    isInfoShow: false,
    myEval: null,
    count: 0,
    rows: [],
    isFinished: false,
  }

  componentWillMount() {
    if (this.$router.params.scene) {
      const scene = decodeURIComponent(this.$router.params.scene)
      this.$router.params.id = scene
    }
    const { id } = this.$router.params
    this.fetchSchool(id)
    this.initEvalsBrowse(id)
    this.fetchNextEvals()
    this.registerEvents()
  }

  componentWillUnmount() {
    Taro.eventCenter.off('refreshEvals')
  }

  fetchSchool = async id => {
    const res = await api.Exchanges.retrieve(id)
    this.setState({ school: res })
    // fetch img
    const data = await api.ImgSo.getImages({ q: res.title + ' school' })
    this.setState({ imgList: data })
  }

  toggleInfo = () => {
    this.setState(prevState => ({ isInfoShow: !prevState.isInfoShow }))
  }

  navToEvalNew = () => {
    if (this.state.myEval) {
      const { id } = this.state.myEval
      Taro.navigateTo({
        url: `/subpackages/exchange/pages/eval/eval?id=${id}`,
      })
      return
    }
    const { id } = this.state.school
    Taro.navigateTo({
      url: `/subpackages/exchange/pages/school-eval-new/school-eval-new?schoolId=${id}`,
    })
  }

  initEvalsBrowse = (schoolId, order = 'vote_pro_count') => {
    this.browseEvals = api.Exchanges.Evals.browse({ schoolId, order })
  }

  fetchNextEvals = async () => {
    const next = this.browseEvals.next()
    const evalsData = await next.value
    const { my_eval, evals } = evalsData
    const { count, rows } = evals
    this.setState({ myEval: my_eval, count })
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

  handleOrderChange = async type => {
    const { id } = this.$router.params
    await this.refreshRows()
    switch (type) {
      case Taro.T._('Latest'):
        this.initEvalsBrowse(id, 'created_at')
        this.fetchNextEvals()
        break
      case Taro.T._('Hottest'):
        this.initEvalsBrowse(id, 'vote_pro_count')
        this.fetchNextEvals()
        break
      default:
    }
  }

  registerEvents = () => {
    Taro.eventCenter.on('refreshEvals', newEval => {
      this.setState(prevState => {
        return {
          myEval: newEval,
          rows: [newEval].concat(prevState.rows),
        }
      })
    })
  }

  render() {
    const avgScore = helper.calcScoreAvg({
      total: this.state.school.score,
      count: this.state.school.eval_count,
    })

    return (
      <View className="school-page">
        <Navigation title={this.state.school.title || '...'} align="left" />

        <View className="pic-wall">
          <PicWall imgList={this.state.imgList} />
          {this.state.school.title && (
            <View className="title">
              <View className="main">{flags[this.state.school.country]} {this.state.school.title}</View>
              <View className="line">
                <View className="item">
                  <UIcon icon="browse" />
                  <View className="value">{this.state.school.view_count}</View>
                </View>
                <View className="item">
                  <UIcon icon="brush" />
                  <View className="value">{this.state.school.eval_count}</View>
                </View>
                <View className="item">
                  <UIcon icon="collection" />
                  <View className="value">{avgScore}</View>
                </View>
              </View>
            </View>
          )}
        </View>

        {this.state.school.title && (
          <View
            className={`school-info ${
              this.state.isInfoShow ? 'school-info--show' : 'school-info--hide'
            }`}
            onClick={this.toggleInfo}
          >
            <View className="arrow">
              <UIcon icon={this.state.isInfoShow ? 'unfold' : 'packup'} />
            </View>
            <SchoolInfo info={this.state.school} />
          </View>
        )}

        <View className="btns">
          <View className="btn">
            <Btn type="info" shape="circle" onClick={this.toggleInfo}>
              <View className="btn-content">
                <UIcon icon="document" />
                <Text className="btn-text">{Taro.T._('See Details')}</Text>
              </View>
            </Btn>
          </View>
          <View className="btn">
            <Btn
              type="primary"
              shape="circle"
              onClick={this.navToEvalNew}
              // disabled={!this.state.isFinished}
              disabled
            >
              <View className="btn-content">
                <UIcon icon="brush" />
                <Text className="btn-text">
                  {this.state.myEval
                    ? Taro.T._('My Evaluation')
                    : Taro.T._('New Evaluation')}
                </Text>
              </View>
            </Btn>
          </View>
        </View>

        <View>
          <EvalList
            title={this.state.school.title}
            rows={this.state.rows}
            count={this.state.count}
            myEval={this.state.myEval}
            onOrderChange={this.handleOrderChange}
          />
        </View>

        {this.state.isFinished &&
          this.state.rows.length === 0 && (
            <Abnor title={Taro.T._('No one has evaluated this course yet')} />
          )}

        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
