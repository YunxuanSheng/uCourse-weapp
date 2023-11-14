import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import CourseList from './components/CourseList/CourseList'
import Loading from '../../../../components/Loading/Loading'
import Search from '../../../../components/Search/Search'
import Abnor from '../../../../components/Abnor/Abnor'
import UIcon from '../../../../components/UIcon/UIcon'
import api from '../../../../utils/api'

import './search.scss'

export default class SearchPage extends Component {
  state = {
    courses: [],
    isFinished: false,
    statusBarHeight: 0,
    fromMyCourses: true,
  }

  componentWillMount() {
    const { from = '', schoolCode, level } = this.$router.params
    const fromMyCourses = from === 'myCourses'
    this.setState({
      statusBarHeight: Taro.systemInfo.statusBarHeight,
      fromMyCourses,
    })
    this.initBrowse({ schoolCode, level }, from)
    this.fetchNext()
  }

  onReachBottom() {
    this.fetchNext()
  }

  initBrowse = (params = {}, from) => {
    // remove all undefined keys
    Object.keys(params).forEach(
      key => params[key] == null && delete params[key]
    )

    if (from === 'myCourses') {
      this.browse = api.Home.browse({ target: 'myCourses', limit: 100 })
    } else {
      this.browse = api.Courses.browse(params)
    }
  }

  fetchNext = async () => {
    const next = this.browse.next()
    if (!next.done) {
      this.setState({ isFinished: false })
      const courses = await next.value
      // 小程序单次最大的 setData 容量是 1024k
      // 下面是为了减少数据长度，去掉无用字段
      courses.forEach(c => {
        delete c.createdAt
        delete c.updatedAt
        delete c.objectId
      })
      this.setState(
        prevState => ({
          courses: prevState.courses.concat(courses),
        }),
        () => {
          if (this.state.courses.length < 100) {
            this.setState({ isFinished: true })
          }
        }
      )
    }
  }

  handleSearch = params => {
    console.log(params)
    this.setState({ courses: [] })
    this.initBrowse(params)
    this.fetchNext()
  }

  handleModeChange = () => {
    this.setState(
      prevState => ({ fromMyCourses: !prevState.fromMyCourses }),
      () => {
        this.setState({ courses: [] })
        this.initBrowse({}, this.state.fromMyCourses ? 'myCourses' : '')
        this.fetchNext()
      }
    )
  }

  render() {
    const title = this.state.fromMyCourses
      ? Taro.T._('My Courses')
      : Taro.T._('All Courses')

    return (
      <View className="search-page">
        <Navigation borderless={!this.state.fromMyCourses}>
          <View onClick={this.handleModeChange}>
            {title}
            <UIcon icon="tab" />
          </View>
        </Navigation>

        <View
          className="search-container"
          style={`top: ${this.state.statusBarHeight + 46}px`}
        >
          {!this.state.fromMyCourses && (
            <Search
              mode="navigator"
              placeholder={Taro.T._('Search courses')}
              onSearch={this.handleSearch}
            />
          )}
        </View>

        <CourseList courses={this.state.courses} />

        {this.state.isFinished && this.state.courses.length === 0 && (
          <Abnor title={Taro.T._('No courses')} />
        )}

        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
