import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../components/Navigation/Navigation'
import Banner from './components/Banner/Banner'
import Content from './components/Content/Content'
import Skeleton from './components/Skeleton/Skeleton'
// import RefreshHint from './components/RefreshHint/RefreshHint'
import LocaleHint from './components/LocaleHint/LocaleHint'
import PopUp from '../../components/PopUp/PopUp'
import SearchNav from '../../components/SearchNav/SearchNav'
import FormIdReporter from '../../components/FormIdReporter/FormIdReporter'
import api from '../../utils/api'
import { shareImageUrls } from '../../utils/data'
import config from '../../config'
import helper from '../../utils/helper'
import './index.scss'

export default class Index extends Component {
  state = {
    resourse: {},
    isFinished: false,
    school_code: '',
    isLoggedIn: false,
    // hasSeenRefreshHint: false,
  }

  componentWillMount() {
    this.fetch()
    this.initLoginInfo()
    // this.setRefreshHint()
  }

  componentDidShow() {
    // check if logged in
    const isLoggedIn = helper.isLoggedIn()
    this.setState({ isLoggedIn })
    // when user set the major and nav back to this page
    this.refreshMyCourse()
  }

  // onTabItemTap() {
  //   if (this.state.isFinished === false) {
  //     return
  //   }
  //   if (!this.state.hasSeenRefreshHint) {
  //     Taro.setStorage({ key: 'hasSeenRefreshHint', data: true })
  //     this.setState({ hasSeenRefreshHint: true })
  //   }
  //   this.setState({ isFinished: false })
  //   this.fetch()
  // }

  onShareAppMessage() {
    const { nickname = '' } = Taro.getStorageSync('userInfo')
    const randImage =
      shareImageUrls[Math.floor(Math.random() * shareImageUrls.length)]

    return {
      title: `${nickname} ${Taro.T._(
        "invites you to evaluate UNNC's courses"
      )}`,
      imageUrl: randImage,
    }
  }

  // setRefreshHint = () => {
  //   const hasSeenRefreshHint = Taro.getStorageSync('hasSeenRefreshHint')
  //   if (hasSeenRefreshHint) {
  //     this.setState({ hasSeenRefreshHint: true })
  //   }
  // }

  fetch = async () => {
    try {
      const resourse = await api.Home.overview()
      this.setState({ resourse, isFinished: true })
    } catch (e) {
      setTimeout(() => {
        this.fetch()
      }, 3000)
    }
  }

  initLoginInfo = async () => {
    const isLoggedIn = helper.isLoggedIn()
    const { school_code } = Taro.getStorageSync('userInfo') || {}
    // for cheacking userInfo updating
    this.setState({ isLoggedIn: isLoggedIn })
    if (school_code) {
      this.setState({ school_code })
    }
    const info = await api.Timetable.getInfo()
    const { id = '' } = info
    if ( id !== '') {
      return
    } else {
      await Taro.showModal({
        title: Taro.T._('The Glory of Verification'),
        content: Taro.T._("You haven't set your student ID"),
        showCancel: false,
        confirmText: Taro.T._('To Set Up'),
        confirmColor: '#ff9800',
        success(res) {
          if (res.confirm) {
            Taro.navigateTo({
              url:
                '/subpackages/settings/pages/settings-timetable/settings-timetable',
            })
          }
        },
      })
    }
  }

  refreshMyCourse = async () => {
    const { my_courses } = this.state.resourse
    if (my_courses && my_courses.length === 0) {
      // has been loaded but empty
      const { school_code } = Taro.getStorageSync('userInfo')
      if (this.state.school_code !== school_code) {
        // userInfo updated
        this.setState({ isFinished: false })
        const value = await api.Home.browse({ target: 'myCourses' }).next()
          .value
        this.setState(prevState => ({
          resourse: { ...prevState.resourse, my_courses: value },
          isFinished: true,
          isLoggedIn: true,
          school_code,
        }))
      }
    }
  }

  render() {
    return (
      <FormIdReporter>
        <PopUp />
        <View className="index">
          <Navigation align="left">
            <SearchNav />
          </Navigation>
          <Banner />

          <official-account />

          <LocaleHint />

          {this.state.isFinished ? (
            <Content
              courseQuestions={this.state.resourse.courseQuestions}
              myCourses={this.state.resourse.my_courses}
              topEvals={this.state.resourse.top_evals}
              recentEvals={this.state.resourse.recent_evals}
              topCourses={this.state.resourse.top_courses}
              hotCourses={this.state.resourse.hot_courses}
              isLoggedIn={this.state.isLoggedIn}
            />
          ) : (
            <Skeleton />
          )}

          {/* {!this.state.hasSeenRefreshHint && <RefreshHint />} */}

          <View className="footer">uCourse v{config.version}</View>
        </View>
      </FormIdReporter>
    )
  }
}
