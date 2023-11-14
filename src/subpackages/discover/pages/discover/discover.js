import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Loading from '../../../../components/Loading/Loading'
import Avatar from '../../../../components/Avatar/Avatar'
import Rate from '../../../../components/Rate/Rate'
import Btn from '../../../../components/Btn/Btn'
import UIcon from '../../../../components/UIcon/UIcon'
import api from '../../../../utils/api'
import helper from '../../../../utils/helper'
import time from '../../../../utils/time'
import './discover.scss'

const navs = [
  {
    name: Taro.T._('Popular Evaluations'),
    id: 'topEvals',
  },
  {
    name: Taro.T._('Recent Evaluations'),
    id: 'recentEvals',
  },
  {
    name: Taro.T._('Hot Courses'),
    id: 'hotCourses',
  },
  {
    name: Taro.T._('Top Courses'),
    id: 'topCourses',
  },
  {
    name: Taro.T._('People Asking'),
    id: 'courseQuestions',
  },
]

export default class Discover extends Component {
  state = {
    currentNav: navs[0],
    topEvals: [],
    recentEvals: [],
    hotCourses: [],
    topCourses: [],
    courseQuestions: [],
    statusBarHeight: 0,
    isFinished: false,
  }

  componentWillMount() {
    const { statusBarHeight } = Taro.systemInfo
    const { id = 'topEvals' } = this.$router.params
    if (id) {
      this.fetch(id)
    }
    const currentNav = navs.filter(nav => nav.id === id)[0]
    this.setState({ currentNav, statusBarHeight })
  }

  initBrowse = stateName => {
    const browseName =
      'browse' + stateName.slice(0, 1).toUpperCase() + stateName.slice(1)
    this[browseName] = api.Home.browse({ target: stateName })
  }

  fetch = async stateName => {
    console.log('fetch')
    // initBrowse if none found
    const browseName =
      'browse' + stateName.slice(0, 1).toUpperCase() + stateName.slice(1)
    if (!this[browseName]) {
      this.initBrowse(stateName)
    }

    //fetch
    this.setState({ isFinished: false })

    const next = this[browseName].next()
    const rows = await next.value
    if (!next.done && rows.length > 0) {
      this.setState(prevState => {
        return {
          [stateName]: prevState[stateName].concat(rows),
          isFinished: true,
        }
      })
    } else {
      this.setState({ isFinished: true })
    }
  }

  handleNavChange = nav => {
    this.setState({ currentNav: nav })
  }

  handleSwiperChange = e => {
    const { current } = e.detail
    this.setState({ currentNav: navs[current] }, () => {
      const stateName = this.state.currentNav.id
      const resourse = this.state[stateName]
      if (resourse.length === 0) {
        this.fetch(stateName)
      }
    })
  }

  handleScrollToLower = () => {
    this.fetch(this.state.currentNav.id)
  }

  handleRefresh = () => {
    const stateName = this.state.currentNav.id
    this.setState({ [stateName]: [] })
    this.initBrowse(stateName)
    this.fetch(stateName)
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
    } else if (
      url === '/subpackages/askall/pages/askall-detail/askall-detail'
    ) {
      Taro.navigateTo({
        url: `${url}?question_id=${params.id}&course_code=${params.course_code}&created_at=${params.created_at}&question_content=${encodeURIComponent(params.content)}`,
      })
    } else {
      Taro.navigateTo({ url })
    }
  }

  render() {
    const swiperHeight = {
      height: 'calc(100vh - ' + (this.state.statusBarHeight + 46) + 'px)',
    }

    const {
      topEvals,
      recentEvals,
      hotCourses,
      topCourses,
      courseQuestions,
    } = this.state
    return (
      <View className="discover-page">
        <Navigation capsuleRight>
          <ScrollView
            style={{ height: '46px' }}
            className="scroll-nav"
            scrollX
            scrollWithAnimation
            scrollIntoView={this.state.currentNav.id}
          >
            {navs.map(nav => (
              <View
                className={`nav ${
                  this.state.currentNav.id === nav.id ? 'active' : ''
                }`}
                id={nav.id}
                key={nav.id}
                onClick={this.handleNavChange.bind(this, nav)}
              >
                {nav.name}
              </View>
            ))}
          </ScrollView>
        </Navigation>

        <Swiper
          className="swiper-container"
          style={swiperHeight}
          currentItemId={this.state.currentNav.id}
          onChange={this.handleSwiperChange}
          skipHiddenItemLayout
          duration={300}
        >
          {navs.map(nav => (
            <SwiperItem
              className="swiper-item"
              // style={swiperHeight}
              itemId={nav.id}
              key={nav.id}
            >
              <ScrollView
                className="swiper-item-scroll-view"
                style={swiperHeight}
                scrollY
                scrollWithAnimation
                enableBackToTop
                lowerThreshold={10}
                onScrollToLower={this.handleScrollToLower}
              >
                {nav.id === 'topEvals' &&
                  topEvals.map(e => {
                    const { score_design, score_qlty, score_spl } = e
                    const score_comp = helper.calcScoreComp({
                      score_design,
                      score_qlty,
                      score_spl,
                    })
                    const createdAt = time.fromNow(e.created_at)
                    const schoolCode =
                      e.course && e.course.school_code.replace('CSC-', '')
                    const info = `${e.vote_pro_count} ${Taro.T._('Pros')}`

                    return (
                      <View
                        key={e.id}
                        className="eval-card"
                        onClick={this.navTo.bind(
                          this,
                          '/subpackages/eval/pages/eval/eval',
                          e
                        )}
                      >
                        <View className="header">
                          <View className="header-left">
                            <View>
                              <Avatar
                                src={e.user.avatar}
                                uid={e.user.id}
                                size={32}
                              />
                            </View>
                            <View className="nickname">{e.user.nickname}</View>
                          </View>
                          <View className="header-right">
                            <View className={'school ' + e.course.school_code}>
                              {schoolCode}
                            </View>
                            <Rate
                              defaultValue={score_comp}
                              disabled
                              size={32}
                            />
                          </View>
                        </View>

                        <View className="content">
                          <View
                            className="content-title"
                            onClick={this.navTo.bind(
                              this,
                              '/subpackages/course/pages/course/course',
                              e.course
                            )}
                          >
                            {e.course.title}
                          </View>
                          <View className="content-short">
                            {e.content_short}
                          </View>
                        </View>

                        <View className="footer">
                          <View className="footer-left">{info}</View>
                          <View className="footer-right">{createdAt}</View>
                        </View>
                      </View>
                    )
                  })}

                {nav.id === 'recentEvals' &&
                  recentEvals.map(e => {
                    const { score_design, score_qlty, score_spl } = e
                    const score_comp = helper.calcScoreComp({
                      score_design,
                      score_qlty,
                      score_spl,
                    })
                    const createdAt = time.fromNow(e.created_at)
                    const schoolCode =
                      e.course && e.course.school_code.replace('CSC-', '')
                    const info = `${e.vote_pro_count} ${Taro.T._('Pros')}`
                    return (
                      <View
                        key={e.id}
                        className="eval-card"
                        onClick={this.navTo.bind(
                          this,
                          '/subpackages/eval/pages/eval/eval',
                          e
                        )}
                      >
                        <View className="header">
                          <View className="header-left">
                            <View>
                              <Avatar
                                src={e.user.avatar}
                                uid={e.user.id}
                                size={32}
                              />
                            </View>
                            <View className="nickname">{e.user.nickname}</View>
                          </View>
                          <View className="header-right">
                            <View className={'school ' + e.course.school_code}>
                              {schoolCode}
                            </View>
                            <Rate
                              defaultValue={score_comp}
                              disabled
                              size={32}
                            />
                          </View>
                        </View>

                        <View className="content">
                          <View
                            className="content-title"
                            onClick={this.navTo.bind(
                              this,
                              '/subpackages/course/pages/course/course',
                              e.course
                            )}
                          >
                            {e.course.title}
                          </View>
                          <View className="content-short">
                            {e.content_short}
                          </View>
                        </View>

                        <View className="footer">
                          <View className="footer-left">{info}</View>
                          <View className="footer-right">{createdAt}</View>
                        </View>
                      </View>
                    )
                  })}

                {nav.id === 'hotCourses' &&
                  hotCourses.map(c => {
                    const scoreComp = (
                      c.prop.score_comp / (c.prop.eval_count || 1)
                    ).toFixed(1)
                    const schoolCode = c.school_code.replace('CSC-', '')
                    const info = `${c.prop.eval_count} ${Taro.T._(
                      'Evaluations'
                    )}`

                    return (
                      <View
                        key={c.code}
                        className="course-card"
                        onClick={this.navTo.bind(
                          this,
                          '/subpackages/course/pages/course/course',
                          c
                        )}
                      >
                        <View className="header">
                          <View className="header-left">
                            <View>{c.code}</View>
                          </View>
                          <View className="header-right">
                            <View className={'school ' + c.school_code}>
                              {schoolCode}
                            </View>
                            <Rate defaultValue={scoreComp} disabled size={32} />
                          </View>
                        </View>

                        <View className="content">
                          <View className="content-title">{c.title}</View>
                        </View>

                        <View className="footer">
                          <View className="footer-left">{info}</View>
                          <View className="footer-right">{scoreComp}</View>
                        </View>
                      </View>
                    )
                  })}

                {nav.id === 'topCourses' &&
                  topCourses.map(c => {
                    const scoreComp = (
                      c.prop.score_comp / (c.prop.eval_count || 1)
                    ).toFixed(1)
                    const schoolCode = c.school_code.replace('CSC-', '')
                    const info = `${c.prop.eval_count} ${Taro.T._(
                      'Evaluations'
                    )}`

                    return (
                      <View
                        key={c.code}
                        className="course-card"
                        onClick={this.navTo.bind(
                          this,
                          '/subpackages/course/pages/course/course',
                          c
                        )}
                      >
                        <View className="header">
                          <View className="header-left">
                            <View>{c.code}</View>
                          </View>
                          <View className="header-right">
                            <View className={'school ' + c.school_code}>
                              {schoolCode}
                            </View>
                            <Rate defaultValue={scoreComp} disabled size={32} />
                          </View>
                        </View>

                        <View className="content">
                          <View className="content-title">{c.title}</View>
                        </View>

                        <View className="footer">
                          <View className="footer-left">{info}</View>
                          <View className="footer-right">{scoreComp}</View>
                        </View>
                      </View>
                    )
                  })}

                {nav.id === 'courseQuestions' &&
                  courseQuestions.map(c => {
                    const courseTitle = c.course ? c.course.title : c.course_code
                    const createdAt = time.fromNow(c.created_at)
                    return (
                      <View
                        key={c.id}
                        className="eval-card"
                        onClick={this.navTo.bind(
                          this,
                          '/subpackages/askall/pages/askall-detail/askall-detail',
                          c
                        )}
                      >
                        <View className="header">
                          <View className="header-left">
                            <View className="course-code">{c.course_code}</View>
                          </View>
                        </View>

                        <View className="content">
                          <View className="content-title">
                            {courseTitle}
                          </View>
                          <View className="content-short">
                            {c.content}
                          </View>
                        </View>

                        <View className="footer">
                          <View className="footer-left">
                            {c.reply_count} {Taro.T._('Answers')}
                            <Text className="dot">·</Text>
                            {c.watch_count} {Taro.T._('Followers')}
                          </View>
                          <View className="footer-right">{`${Taro.T._('Question created at')} ${createdAt}`}</View>
                        </View>
                      </View>
                    )
                  })}

                {!this.state.isFinished && <Loading color="primary" />}
              </ScrollView>
            </SwiperItem>
          ))}
        </Swiper>

        <View className="refresh-btn">
          <Btn type="primary" shape="round" ripple onClick={this.handleRefresh}>
            <UIcon icon-class="refresh-icon" icon="refresh" />
          </Btn>
        </View>
      </View>
    )
  }
}
