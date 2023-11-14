import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import Rate from '../../../../../../components/Rate/Rate'
import Btn from '../../../../../../components/Btn/Btn'
import UIcon from '../../../../../../components/UIcon/UIcon'
import helper from '../../../../../../utils/helper'
import api from '../../../../../../utils/api'

import './CourseInfo.scss'

export default class CourseInfo extends Component {
  static defaultProps = {
    info: {
      code: 'IDONTKNOW',
      level: '0',
      prop: {
        eval_count: 0,
        score_comp: 0,
        score_count: 0,
        score_design: 0,
        score_qlty: 0,
        score_spl: 0,
        view_count: 0,
      },
      school_code: undefined,
      title: undefined,
    },
    title: 'Course',
    schoolCode: 'UNNC',
    myEval: null,
    hide_new: true,
  }

  getIfHideNew = async () => {
    const info = await api.Timetable.getInfo()
    const { id = '' } = info;
    this.setState({
      hide_new: !id
    })
  }

  componentWillMount() {
    this.getIfHideNew();
  }

  navToEval = () => {
    if (!!this.props.myEval) {
      const { id } = this.props.myEval
      Taro.navigateTo({
        url: `/subpackages/eval/pages/eval/eval?id=${id}&title=${this.props.title}`,
      })
    } else {
      const mode = 'new'
      Taro.navigateTo({
        url: `/subpackages/eval/pages/eval-new/eval-new?code=${this.props.info.code}&mode=${mode}`,
      })
    }
  }

  navToDetail = () => {
    const code = this.props.info.code || this.$scope.options.code
    Taro.navigateTo({
      url: `/subpackages/course/pages/course-detail/course-detail?code=${code}`,
    })
  }

  navToTimetable = () => {
    const code = this.props.info.code || this.$scope.options.code
    Taro.navigateTo({
      url: `/subpackages/timetable/pages/activities/activities?moduleCode=${code}`,
    })
  }

  promptScore = () => {
    Taro.showModal({
      title: Taro.T._('Comprehensive Score'),
      content: Taro.T._(
        'Comprehensive Score = ( Design + Quality ) * 0.4 + Simplicity * 0.2'
      ),
      showCancel: false,
      confirmColor: '#ff9800',
      confirmText: Taro.T._('OK'),
    })
  }

  render() {
    const {
      title = this.props.title,
      prop = {},
      school_code = this.props.schoolCode,
    } = this.props.info
    const {
      eval_count = 0,
      score_comp = 0,
      score_design = 0,
      score_qlty = 0,
      score_spl = 0,
      // view_count,
    } = prop
    const score_comp_fixed = helper.oneDecimal(score_comp, eval_count)
    const score_design_fixed = helper.oneDecimal(score_design, eval_count)
    const score_qlty_fixed = helper.oneDecimal(score_qlty, eval_count)
    const score_spl_fixed = helper.oneDecimal(score_spl, eval_count)
    const scores = [
      { name: Taro.T._('Design'), score: score_design_fixed },
      { name: Taro.T._('Quality'), score: score_qlty_fixed },
      { name: Taro.T._('Simplicity'), score: score_spl_fixed },
    ]

    return (
      <View className="course-info">
        <View className={`title ${school_code}`}>
          <View>{title}</View>
        </View>
        <View className="props">
          <View className="header">
            <View className="props-title">
              <View>{Taro.T._('Comprehensive Score')}</View>
              <View onClick={this.promptScore}>
                <UIcon icon-class="icon" icon="prompt" />
              </View>
            </View>
            <View className="btns">
              <Btn
                type="info"
                shape="circle"
                size="mini"
                text={Taro.T._('Timetable')}
                onClick={this.navToTimetable}
              />
              <Btn
                type="info"
                shape="circle"
                size="mini"
                text={Taro.T._('Course Details')}
                onClick={this.navToDetail}
              />
              {!this.state.hide_new && 
                <Btn
                  type="primary"
                  shape="circle"
                  size="mini"
                  text={
                    !!this.props.myEval
                      ? Taro.T._('My Evaluation')
                      : Taro.T._('New Evaluation')
                  }
                  onClick={this.navToEval}
                  disabled={!this.props.info.code}
                />
              }
            </View>
          </View>

          <View className="body">
            <View className="left">
              <View className="score-comp">{score_comp_fixed}</View>
              <Rate defaultValue={score_comp_fixed} disabled />
            </View>

            <View className="right">
              <View className="score-count">{`${eval_count} ${Taro.T._(
                'Evaluations'
              )}`}</View>
              {scores.map((s, i) => (
                <View key={i} className="scores">
                  {s.name}：{s.score}
                </View>
              ))}
            </View>

            {this.props.info.title && (
              <View className="share">
                <Button openType="share">
                  <UIcon icon-class="share-icon" icon="send" />
                </Button>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}
