import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import Btn from '../../../../components/Btn/Btn'
import Avatar from '../../../../components/Avatar/Avatar'
// import Rate from '../../../../components/Rate/Rate'
import helper from '../../../../utils/helper'
import './Content.scss'

export default class Content extends Component {
  static defaultProps = {
    courseQuestions: [],
    myCourses: [],
    topEvals: [],
    recentEvals: [],
    topCourses: [],
    hotCourses: [],
    isLoggedIn: false,
  }

  state = {
    shuffledMyCourses: [],
    scrollMyCoursesId: null,
  }

  componentDidMount() {
    this.shuffleMyCourses(this.props.myCourses)
    this.scrollMyCourses()
  }

  componentWillReceiveProps(props) {
    this.shuffleMyCourses(props.myCourses)
  }

  componentWillUnmount() {
    this.scrollMyCoursesTimer && clearInterval(this.scrollMyCoursesTimer)
  }

  shuffleMyCourses = myCourses => {
    if (myCourses.length > 0) {
      // shuffle array for random
      const shuffledMyCourses = helper.shuffleArray(myCourses)
      this.setState({ shuffledMyCourses })
    }
  }

  scrollMyCourses = () => {
    let i = 0
    this.scrollMyCoursesTimer = setInterval(() => {
      try {
        const scrollMyCoursesId = this.state.shuffledMyCourses[i].code
        this.setState({ scrollMyCoursesId })
        i = i + 2
      } catch (e) {
        i = 0
      }
    }, 8000)
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
    } else if (url === '/pages/me/me') {
      Taro.switchTab({ url })
    } else if (
      url === '/subpackages/askall/pages/askall-detail/askall-detail'
    ) {
      Taro.navigateTo({
        url: `${url}?question_id=${params.id}&course_code=${
          params.course_code
        }&created_at=${params.created_at}&question_content=${encodeURIComponent(
          params.content
        )}&course_title=${params.course.title}`,
      })
    } else {
      Taro.navigateTo({ url })
    }
  }

  render() {
    return (
      <View className="content-wrap">
        <View className="field">
          <View className="field-title">
            <View>{Taro.T._('Courses of My Faculty')}</View>
            <View
              className="see-more"
              onClick={this.navTo.bind(
                this,
                '/subpackages/search/pages/search/search?from=myCourses'
              )}
            >
              {Taro.T._('See More')}
            </View>
          </View>
          <View className="field-content">
            <ScrollView
              className="scroll-view"
              scrollX
              scrollIntoView={this.state.scrollMyCoursesId}
              scrollWithAnimation
            >
              {this.state.shuffledMyCourses.map(c => (
                <View
                  id={c.code}
                  key={c.code}
                  className="my-course-card-container"
                >
                  <View
                    className={`my-course-card ${c.belongsTo.code}`}
                    onClick={this.navTo.bind(
                      this,
                      '/subpackages/course/pages/course/course',
                      c
                    )}
                  >
                    <Text className="course-title">{c.title}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {this.props.isLoggedIn && this.props.myCourses.length === 0 && (
              <View
                className="set-btn"
                onClick={this.navTo.bind(
                  this,
                  '/subpackages/profile-edit/pages/profile-edit-major/profile-edit-major'
                )}
              >
                <Btn
                  type="primary"
                  shape="circle"
                  text={Taro.T._('Edit My Major')}
                />
              </View>
            )}

            {!this.props.isLoggedIn && (
              <View
                className="set-btn"
                onClick={this.navTo.bind(this, '/pages/me/me')}
              >
                <Btn type="primary" shape="circle" text={Taro.T._('Login')} />
              </View>
            )}
          </View>
        </View>

        {this.props.isLoggedIn && this.props.courseQuestions.length > 0 && (
          <View className="field">
            <View className="field-title">
              <View>{Taro.T._('People Asking')}</View>
              <View
                className="see-more"
                onClick={this.navTo.bind(
                  this,
                  '/subpackages/discover/pages/discover/discover?id=courseQuestions'
                )}
              >
                {Taro.T._('See More')}
              </View>
            </View>
            <View className="field-content">
              <ScrollView className="scroll-view" scrollX>
                {this.props.courseQuestions.map(e => {
                  return (
                    <View
                      className="courseqa-card"
                      key={e.id}
                      onClick={this.navTo.bind(
                        this,
                        '/subpackages/askall/pages/askall-detail/askall-detail',
                        e
                      )}
                    >
                      <View className="course-title">{e.course.title}</View>
                      <View className="eval-content">{e.content}</View>
                      <View className="user">
                        {`${e.reply_count} ${Taro.T._('Answers')}`}
                        <Text className="dot">·</Text>
                        {`${e.watch_count} ${Taro.T._('Followers')}`}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {this.props.topEvals.length > 0 && (
          <View className="field">
            <View className="field-title">
              <View>{Taro.T._('Popular Evaluations Monthly')}</View>
              <View
                className="see-more"
                onClick={this.navTo.bind(
                  this,
                  '/subpackages/discover/pages/discover/discover?id=topEvals'
                )}
              >
                {Taro.T._('See More')}
              </View>
            </View>
            <View className="field-content">
              <ScrollView className="scroll-view" scrollX>
                {this.props.topEvals.map(e => {
                  const schoolCode = e.course.school_code.replace('CSC-', '')
                  return (
                    <View
                      className="eval-card"
                      key={e.id}
                      onClick={this.navTo.bind(
                        this,
                        '/subpackages/eval/pages/eval/eval',
                        e
                      )}
                    >
                      <View
                        className="course-title"
                        onClick={this.navTo.bind(
                          this,
                          '/subpackages/course/pages/course/course',
                          e.course
                        )}
                      >
                        {e.course.title}
                      </View>
                      <View className="eval-content">{e.content_short}</View>
                      <View className="user">
                        <View className="avatar">
                          <Avatar
                            src={e.user.avatar}
                            uid={e.user.id}
                            size={32}
                          />
                        </View>
                        <Text
                          className="nickname"
                          onClick={this.navTo.bind(
                            this,
                            '/subpackages/profile/pages/profile/profile?id=' +
                              e.user.id
                          )}
                        >
                          {e.user.nickname}
                        </Text>
                        <Text className="dot">·</Text>
                        {/* <Rate defaultValue={5} disabled size={30} /> */}
                        {`${e.vote_pro_count} ${Taro.T._('Pros')}`}
                      </View>
                      <View className={`school ${e.course.school_code}`}>
                        {schoolCode}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {this.props.recentEvals.length > 0 && (
          <View className="field">
            <View className="field-title">
              <View>{Taro.T._('Recent Evaluations')}</View>
              <View
                className="see-more"
                onClick={this.navTo.bind(
                  this,
                  '/subpackages/discover/pages/discover/discover?id=recentEvals'
                )}
              >
                {Taro.T._('See More')}
              </View>
            </View>
            <View className="field-content">
              <ScrollView className="scroll-view" scrollX>
                {this.props.recentEvals.map(e => {
                  const schoolCode = e.course.school_code.replace('CSC-', '')
                  return (
                    <View
                      className="eval-card"
                      key={e.id}
                      onClick={this.navTo.bind(
                        this,
                        '/subpackages/eval/pages/eval/eval',
                        e
                      )}
                    >
                      <View
                        className="course-title"
                        onClick={this.navTo.bind(
                          this,
                          '/subpackages/course/pages/course/course',
                          e.course
                        )}
                      >
                        {e.course.title}
                      </View>
                      <View className="eval-content">{e.content_short}</View>
                      <View className="user">
                        <View className="avatar">
                          <Avatar
                            src={e.user.avatar}
                            uid={e.user.id}
                            size={32}
                          />
                        </View>
                        <Text
                          className="nickname"
                          onClick={this.navTo.bind(
                            this,
                            '/subpackages/profile/pages/profile/profile?id=' +
                              e.user.id
                          )}
                        >
                          {e.user.nickname}
                        </Text>
                        <Text className="dot">·</Text>
                        {`${e.vote_pro_count} ${Taro.T._('Pros')}`}
                      </View>
                      <View className={`school ${e.course.school_code}`}>
                        {schoolCode}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {this.props.topCourses.length > 0 && (
          <View className="field">
            <View className="field-title">
              <View>{Taro.T._('Top Courses')}</View>
              <View
                className="see-more"
                onClick={this.navTo.bind(
                  this,
                  '/subpackages/discover/pages/discover/discover?id=topCourses'
                )}
              >
                {Taro.T._('See More')}
              </View>
            </View>
            <View className="field-content">
              <ScrollView className="scroll-view" scrollX>
                {this.props.topCourses.map(c => {
                  const schoolCode = c.school_code.replace('CSC-', '')
                  const rate = (
                    c.prop.score_comp / c.prop.eval_count || 0
                  ).toFixed(1)
                  return (
                    <View
                      className="course-card"
                      key={c.code}
                      onClick={this.navTo.bind(
                        this,
                        '/subpackages/course/pages/course/course',
                        c
                      )}
                    >
                      <View>
                        {/* <View>
                        <Rate defaultValue={rate} disabled />
                      </View> */}
                        <View className="course-title">{c.title}</View>
                        <View className="count">
                          {`${c.prop.eval_count} ${Taro.T._('Evaluations')}`}
                        </View>
                      </View>
                      <View className="rate">{rate}</View>

                      <View className={`school ${c.school_code}`}>
                        {schoolCode}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {this.props.hotCourses.length > 0 && (
          <View className="field">
            <View className="field-title">
              <View>{Taro.T._('Hot Courses')}</View>
              <View
                className="see-more"
                onClick={this.navTo.bind(
                  this,
                  '/subpackages/discover/pages/discover/discover?id=hotCourses'
                )}
              >
                {Taro.T._('See More')}
              </View>
            </View>
            <View className="field-content">
              <ScrollView className="scroll-view" scrollX>
                {this.props.hotCourses.map(c => {
                  const schoolCode = c.school_code.replace('CSC-', '')
                  const rate = (
                    c.prop.score_comp / c.prop.eval_count || 0
                  ).toFixed(1)
                  return (
                    <View
                      className="course-card"
                      key={c.code}
                      onClick={this.navTo.bind(
                        this,
                        '/subpackages/course/pages/course/course',
                        c
                      )}
                    >
                      <View>
                        {/* <View>
                        <Rate defaultValue={rate} disabled />
                      </View> */}
                        <View className="course-title">{c.title}</View>
                        <View className="count">
                          {`${c.prop.eval_count} ${Taro.T._('Evaluations')}`}
                        </View>
                      </View>
                      <View className="rate">{rate}</View>

                      <View className={`school ${c.school_code}`}>
                        {schoolCode}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    )
  }
}
