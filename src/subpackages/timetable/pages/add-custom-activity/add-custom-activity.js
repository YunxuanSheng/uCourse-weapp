import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Switch, Input } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'
import './add-custom-activity.scss'
import helper from '../../../../utils/helper'
import moment from 'moment'

export default class AddCustomActivity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activity: null,
      day: 'Monday',
      dayIndex: 0,
      start: '09:00',
      end: '11:00',
      module: '',
      room: '',
      staff: [],
      weeks: [],
      staffRaw: '',
      weeksRaw: '',
      name_of_type: '',
      act_list: [],
      submission_allowed: true,
    }
  }

  clear = () => {
    this.setState({
      activity: null,
      day: 'Monday',
      dayIndex: 0,
      start: '09:00',
      end: '11:00',
      module: '',
      room: '',
      staff: [],
      weeks: [],
      staffRaw: '',
      weeksRaw: '',
      name_of_type: '',
    })
  }

  componentDidShow() {
    this.fetchActList()
  }

  weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  fetchActList = async () =>{
    try {
      Taro.showLoading({ title: Taro.T._('Loading') })
      this.setState({act_list: await api.Timetable.getCustomActivities()})
    } catch (e) {
      const { errorCode, message } = JSON.parse(e.message)
      console.log(message)
      if (errorCode === 151) {
        // Can't find student_id for the current user.
      } else if (errorCode === 152) {
        // Can't access timetable now. (network issue.)
      } else if (errorCode === 153) {
        // Cannot find this student's timetable from official. (400 bad request from timetable.)
      }
    } finally {
      Taro.hideLoading()
    }
  }

  modActivity = (act) => {
    this.setState({
      ...act,
      staffRaw: act.staff.join(", "),
      weeksRaw: act.weeks.join(","),
    })
  }

  weekParser = weeks => {
    let resArray = new Array();
    weeks = weeks.replace("，", ",").replace("——", "-").replace("_", "-");
    try {
      let commaSeparatedParts = weeks.split(",");
      for (let part of commaSeparatedParts) {
        if (part.search('-') > -1) {
          let [from, to] = part.split('-');
          for (let i = parseInt(from); i <= parseInt(to); i++) {
            resArray.push(i);
          }
        } else {
          resArray.push(parseInt(part));
        }
      }
    } finally {
      return resArray;
    }
  }

  onDayChange = e => {
    this.setState({
      dayIndex: e.detail.value,
      day: this.weekDays[e.detail.value]
    })
  }

  onStartTimeChange = e => {
    this.setState({start: e.detail.value})
  }

  onEndTimeChange = e => {
    this.setState({end: e.detail.value})
  }

  onModuleChange = e => {
    this.setState({module: e.detail.value})
  }

  onRoomChange = e => {
    this.setState({room: e.detail.value})
  }

  onStaffChange = e => {
    this.setState({
      staffRaw: e.detail.value,
      staff: e.detail.value.split(',')
    })
  }

  onWeeksChange = e => {
    this.setState({
      weeksRaw: e.detail.value,
      weeks: this.weekParser(e.detail.value)
    })
  }

  onTypeChange = e => {
    this.setState({name_of_type: e.detail.value})
  }

  onSubmit = async e => {
    if (this.state.weeks.length<1){
      Taro.showModal({
        title: '错误',
        content: '周数无效',
        showCancel: false
      })
      return
    }

    let duTime = moment.duration(this.state.end).subtract(moment.duration(this.state.start))
    if (duTime.get('hours') < 0 || (duTime.get('hours') == 0 && duTime.get('minutes') <= 0)) {
      Taro.showModal({
        title: '错误',
        content: '开始时间必须在结束时间之前',
        showCancel: false
      })
      return
    }

    if (!this.state.module) {
      Taro.showModal({
        title: '错误',
        content: '名称不能为空',
        showCancel: false
      })
      return
    }

    let act = {
      activity: this.state.activity,
      day: this.state.day,
      duration: duTime.get('hours')+':'+duTime.get('minutes'),
      start: this.state.start,
      end: this.state.end,
      module: this.state.module,
      room: this.state.room,
      staff: this.state.staff,
      weeks: this.state.weeks,
      name_of_type: this.state.name_of_type,
      module_code: [],
    }
    try {
      Taro.showLoading({ title: Taro.T._('Loading') })
      this.setState({
        submission_allowed: false
      });
      const res = await  api.Timetable.customActivity({activityDetails: act})
      Taro.hideLoading();
      this.setState({
        submission_allowed: true
      });
      await Taro.showModal({
        title: '提示',
        content: '添加成功',
        showCancel: false
      })
    } catch (e) {
      console.log(e)
      await Taro.showModal({
        title: '错误',
        content: '添加失败',
        showCancel: false
      })
    } finally {
      Taro.navigateBack()
    }
  }

  render() {
    return (
      <View className="add-custom-activity">
        <Navigation title={this.state.activity||'添加自定义课程'} />

        <View className="hint">课程信息</View>

        <Picker
            mode="selector"
            range={this.weekDays}
            value={this.state.dayIndex}
            onChange={this.onDayChange}
          >
            <View className="list-item">
              <View className="name">星期</View>
              <View className="input">
                {this.weekDays[this.state.dayIndex]}
              </View>
              <UIcon icon-class="icon" icon="enter" />
            </View>
          </Picker>
        <Picker mode='time' value={this.state.start} onChange={this.onStartTimeChange}>
            <View className="list-item">
              <View className="name">开始时间</View>
              <View className="input">{this.state.start}</View>
              <UIcon icon-class="icon" icon="enter" />
            </View>
          </Picker>
        <Picker mode='time' value={this.state.end} onChange={this.onEndTimeChange}>
            <View className="list-item">
              <View className="name">结束时间</View>
              <View className="input">{this.state.end}</View>
              <UIcon icon-class="icon" icon="enter" />
            </View>
          </Picker>
        <View className="list-item">
          <View className="name">名称</View>
          <View className="input">
            <Input type='text' 
              placeholder='如：中国文化课，体育课'
              value={this.state.module}
              onChange={this.onModuleChange} />
          </View>
        </View>
        <View className="list-item">
          <View className="name">地点</View>
          <View className="input">
            <Input type='text'
            //  placeholder='地点'
              value={this.state.room}
              onChange={this.onRoomChange} />
          </View>
        </View>
        <View className="list-item">
          <View className="name">组织者</View>
          <View className="input">
            <Input type='text' 
            // placeholder={'组织者'+(this.state.activity?' 默认不修改':'')}
              value={this.state.staffRaw}
              onChange={this.onStaffChange} />
          </View>
        </View>
        <View className="list-item">
          <View className="name">周号</View>
          <View className="input">
            <Input type='text' 
              placeholder={'如：2,4-14'}
              value={this.state.weeksRaw}
              onChange={this.onWeeksChange} />
          </View>
        </View>
        <View className="list-item">
          <View className="name">活动类型</View>
          <View className="input">
            <Input type='text' 
              placeholder='如：Lecture, Seminar, PE'
              value={this.state.name_of_type}
              onChange={this.onTypeChange} />
          </View>
        </View>

      <View className="gap" />

      <View className="list-item" onClick={this.clear}>取消</View>

      <View className="gap" />

      {this.state.submission_allowed && 
      <Btn
        type="primary"
        size="long"
        text={this.state.activity?'修改':'添加'}
        onClick={this.onSubmit}
      />}
      <View className="gap" />
      <View className="hint">已有自定义课程</View>

      {this.state.act_list && this.state.act_list.map((v) => (v.activity.startsWith('USER'))&&(
        <View className="list-item" onClick={()=>this.modActivity(v)} key={v.activity}>
          {v.module} {this.state.activity == v.activity ? '✅' : ''}
        </View>
      ))}

        <View className="gap" />
        <View className="gap" />
        <View className="gap" />
      </View>


    )
  }
}
