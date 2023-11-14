import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import CourseInfo from './components/CourseInfo/CourseInfo'
import EvalList from './components/EvalList/EvalList'
import Askall from './components/Askall/Askall'
import EvalTempList from './components/EvalTempList/EvalTempList'
import Loading from '../../../../components/Loading/Loading'
import Abnor from '../../../../components/Abnor/Abnor'
import TimetableEntry from './components/TimetableEntry/TimetableEntry'
import api from '../../../../utils/api'
import { shareImageUrls } from '../../../../utils/data'
import helper from '../../../../utils/helper'
import './course.scss'

export default class Course extends Component {
  state = {
    courseInfo: {},
    myEval: null,
    count: 0,
    rows: [],
    isFinished: false,
    askall: null,
    askall_length: 0,
    isLoggedIn: false,
  }

  componentWillMount() {
    const { code } = this.$router.params
    this.setState({}) // make init update for $router cache
    this.initEvalsBrowse(code)
    this.fetchCourseInfo()
    this.fetchNextEvals()
    this.fetchAskAll()
    this.registerEvents()
  }

  componentWillUnmount() {
    Taro.eventCenter.off('refreshEvals')
  }

  componentDidShow() {
    const isLoggedIn = helper.isLoggedIn()
    this.setState({ isLoggedIn })
  }

  onShareAppMessage() {
    const { code, title, school_code } = this.state.courseInfo
    const { nickname = '' } = Taro.getStorageSync('userInfo')
    const randImage =
      shareImageUrls[Math.floor(Math.random() * shareImageUrls.length)]

    return {
      title: `${nickname} ${Taro.T._(
        'invites you to evaluate'
      )} ${title} (${code})`,
      path: `/subpackages/course/pages/course/course?code=${code}&title=${title}&school_code=${school_code}`,
      imageUrl: randImage,
    }
  }

  onReachBottom() {
    this.fetchNextEvals()
  }

  fetchCourseInfo = async () => {
    const { code } = this.$router.params
    const courseInfo = await api.Courses.retrieve(code)
    this.setState({ courseInfo })
  }

  initEvalsBrowse = (courseCode, order = 'vote_pro_count') => {
    this.browseEvals = api.Evals.browse({ courseCode, order })
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
    const { code } = this.$router.params
    await this.refreshRows()
    switch (type) {
      case Taro.T._('Latest'):
        this.initEvalsBrowse(code, 'created_at')
        this.fetchNextEvals()
        break
      case Taro.T._('Hottest'):
        this.initEvalsBrowse(code, 'vote_pro_count')
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

  fetchAskAll = async () => {
    const courseQAInfo = await api.CourseQA.get(this.$router.params.code)
    this.setState(() => {
      return {
        askall:
          courseQAInfo.length > 2
            ? [courseQAInfo[0], courseQAInfo[1]]
            : courseQAInfo,
        askall_length: courseQAInfo.length,
      }
    })
  }

  render() {
    const { title, school_code } = this.$router.params
    return (
      <View className="course-page">
        <Navigation title={title} align="left" />

        <CourseInfo
          info={this.state.courseInfo}
          title={title}
          schoolCode={school_code}
          myEval={this.state.myEval}
        />

        {this.state.isLoggedIn && this.state.askall && (
          <Askall
            list={this.state.askall}
            list_length={this.state.askall_length}
            course_code={this.state.courseInfo.code}
            title={title}
            schoolCode={school_code}
            isFinished={this.state.isFinished}
          />
        )}

        <View
          style={{
            marginTop: '-80rpx',
          }}
        >
          <EvalTempList />

          <EvalList
            title={title}
            rows={this.state.rows}
            count={this.state.count}
            myEval={this.state.myEval}
            onOrderChange={this.handleOrderChange}
          />

          {this.state.isFinished && this.state.rows.length === 0 && (
            <Abnor title={Taro.T._('No one has evaluated this course yet')} />
          )}

          {!this.state.isFinished && <Loading color="primary" />}
        </View>
      </View>
    )
  }
}
