import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'
import './course-detail.scss'

export default class CourseInfo extends Component {
  state = {
    en: undefined,
    zh: undefined,
    current: 'en',
    info: {},
  }

  async componentWillMount() {
    Taro.showLoading({ title: Taro.T._('Loading'), mask: true })
    const { code } = this.$router.params
    let en = await api.Courses.retrieve(code, 'official')
    // en = JSON.parse(JSON.stringify(en).replace(/\\n\\n/g, '\\n'))
    this.setState({ en, info: en, current: 'en' })
    Taro.hideLoading()
  }

  handleTranslate = async () => {
    if (this.state.current === 'en') {
      // to zh
      if (!this.state.zh) {
        // init zh
        Taro.showLoading({ title: Taro.T._('Translating'), mask: true })
        const { code } = this.$router.params
        let zh = await api.Courses.retrieve(code, 'official', {
          lang: 'zh-cn',
        })
        zh = JSON.parse(
          JSON.stringify(zh)
            .replace(/Full year China/gi, '全年 中国校区')
            .replace(/Autumn China/gi, '秋季 中国校区')
            .replace(/Spring China/gi, '春季 中国校区')
            .replace(/hours and/gi, '小时')
            .replace(/hour and/gi, '小时')
            .replace(/hours/gi, '小时')
            .replace(/hour/gi, '小时')
            .replace(/minutes/gi, '分钟')
            .replace(/weeks/g, '周')
            .replace(/week/g, '周')
            // classes
            .replace(/Computing/gi, '上机')
            .replace(/Lecture/gi, '大课')
            .replace(/Workshop/gi, '研讨课')
            .replace(/Seminar/gi, '研讨课')
            .replace(/Practicum/gi, '实践')
            .replace(/Project/gi, '项目')
            // assessment
            .replace(/Assignment/gi, '作业')
            .replace(/Group Coursework/gi, '小组作业')
            .replace(/Coursework/gi, '作业')
            .replace(/Class Attendence/gi, '课堂出勤率')
            .replace(/Business Plan/gi, '商业计划')
            .replace(/Dissertation/gi, '论文')
            .replace(/Inclass Exam/gi, '随堂测验')
            .replace(/Examinations/gi, '考试')
            .replace(/Examination/gi, '考试')
            .replace(/Exam/gi, '考试')
            .replace(/lab secion/gi, '实验')
            .replace(/Laboratory/gi, '实验')
            .replace(/Oral/gi, '口试')
            .replace(/Overall/gi, '综合')
            .replace(/Participation/gi, '参与')
            .replace(/Practical/gi, '练习')
            .replace(/Group Presentation/gi, '小组演讲')
            .replace(/Presentation/gi, '讲演')
            .replace(/Quiz/gi, '小测')
            .replace(/Reflective/gi, '反思')
            .replace(/Report/gi, '报告')
            .replace(/Screening/gi, '拍摄')
            .replace(/Tutorial/gi, '指导')
            .replace(/Viva voce/gi, '口头测验')
            .replace(/Written/gi, '书面')
          // .replace(/\\n\\n/g, '\\n')
        )
        this.setState({ zh, info: zh, current: 'zh' })
        Taro.hideLoading()
      } else {
        // use cache
        this.setState({ info: this.state.zh, current: 'zh' })
      }
    } else {
      // to en
      this.setState({ info: this.state.en, current: 'en' })
    }
  }

  render() {
    return (
      <View className="course-detail-page">
        <Navigation title={Taro.T._('Course Details')} />
        {this.state.en && (
          <View className="info-container">
            <View className="course-title">
              {this.state.info.title}
              {` (${this.state.info.code})`}
            </View>

            {this.state.info.credits && (
              <View className="field">
                <View className="key">学分 CREDITS</View>
                <Text className="value">{this.state.info.credits}</Text>
              </View>
            )}

            {this.state.info.level && (
              <View className="field">
                <View className="key">等级 LEVEL</View>
                <Text className="value">{this.state.info.level}</Text>
              </View>
            )}

            {this.state.info.summary && (
              <View className="field">
                <View className="key">概况 SUMMARY</View>
                <Text className="value">{this.state.info.summary}</Text>
              </View>
            )}

            {this.state.info.aims && (
              <View className="field">
                <View className="key">目标 AIMS</View>
                <Text className="value">{this.state.info.aims}</Text>
              </View>
            )}

            {this.state.info.semester && (
              <View className="field">
                <View className="key">学期 SEMESTER</View>
                <Text className="value">{this.state.info.semester}</Text>
              </View>
            )}

            {this.state.info.requisites && (
              <View className="field">
                <View className="key">要求 REQUISITES</View>
                <Text className="value">{this.state.info.requisites}</Text>
              </View>
            )}

            {this.state.info.outcome && (
              <View className="field">
                <View className="key">成果 OUTCOMES</View>
                <Text className="value">{this.state.info.outcome}</Text>
              </View>
            )}

            {this.state.info.belongsTo.name && (
              <View className="field">
                <View className="key">提供 OFFERED BY</View>
                <Text className="value">{this.state.info.belongsTo.name}</Text>
              </View>
            )}

            {this.state.info.class.length > 0 && (
              <View className="field">
                <View className="key">课时 CLASSES</View>
                <View className="value">
                  <View className="table">
                    <View className="row title">
                      {['类型', '每次时长', '每周次数', '周数'].map(cell => (
                        <View className="cell" key={cell}>
                          {cell}
                        </View>
                      ))}
                    </View>
                    {this.state.info.class.map((c, i) => (
                      <View className="row" key={i}>
                        {[
                          c.activity,
                          c.sessionDuration,
                          c.numOfSessions,
                          c.numOfWeeks,
                        ].map(cell => (
                          <View className="cell" key={cell}>
                            {cell}
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {this.state.info.assessment.length > 0 &&
            this.state.info.assessment[0].type !== ' ' && ( // 有的有长度但是是空内容
                <View className="field">
                  <View className="key">考评 ASSESSMENTS</View>
                  <View className="value">
                    <View className="table">
                      <View className="row title">
                        {['类型', '要求', '权重'].map(cell => (
                          <View className="cell" key={cell}>
                            {cell}
                          </View>
                        ))}
                      </View>
                      {this.state.info.assessment.map((a, i) => (
                        <View className="row" key={i}>
                          {[a.type, a.requirements, a.weight].map(cell => (
                            <View className="cell" key={cell}>
                              {cell}
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}

            <View className="hint">
              {`* ${Taro.T._(
                'All information is synchronized from the UNNC course query website. Through '
              )}`}
              <Text className="link">u.nu/course</Text>
              {Taro.T._(
                ', you can also visit the official website for your own inquiry.'
              )}
            </View>

            <View className="hint">
              {`* ${Taro.T._(
                'Chinese is based on Google Translate, but we do not guarantee semantic accuracy.'
              )}`}
            </View>

            <View className="translate-btn">
              <Btn
                type="primary"
                shape="round"
                text={
                  this.state.current === 'en' ? Taro.T._('zh') : Taro.T._('en')
                }
                ripple
                onClick={this.handleTranslate}
              />
            </View>
          </View>
        )}
      </View>
    )
  }
}
