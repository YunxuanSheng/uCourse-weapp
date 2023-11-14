import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Loading from '../../../../components/Loading/Loading'
import api from '../../../../utils/api'
import time from '../../../../utils/time'
import { calendarBgUrls } from '../../../../utils/data'
import './activity.scss'

export default class Activity extends Component {
  state = {
    name: '',
    calendarBg: '',
    originalInfo: {}, // used to store the activity clicked in
    info: {}, // used to change between different groups
    isGroupToggle: false,
    isGroupLoading: false,
    hasGroupLoaded: false,
    groups: [],
    isDeleteEnabled: false,
    isUpdateEnabled: false,
    isCreateEnabled: false,
    isEvalEnabled: false,
  }

  componentWillMount() {
    const { id, name, month, mode } = this.$router.params
    this.setState({ name })
    this.fetchActivity(id)
    this.initBg(month)
    this.initFunctions(mode)
  }

  initFunctions = async mode => {
    // mode: 'old', 'new'
    // - old: allow delete, update, go to eval
    // - new: allow create
    if (mode === 'old') {
      this.setState({
        isDeleteEnabled: true,
        isUpdateEnabled: true,
        isEvalEnabled: true,
      })
    } else if (mode === 'new') {
      this.setState({
        isCreateEnabled: true,
      })
    } else {
      const myActivities = await api.Timetable.browse().then(res =>
        res.map(a => a.activity)
      )
      if (myActivities.includes(this.$router.params.name)) {
        this.initFunctions('old')
      } else {
        this.initFunctions('new')
      }
    }
  }

  fetchActivity = async id => {
    Taro.showLoading({ title: Taro.T._('Loading') })
    let res
    try {
      res = await api.Timetable.browse({ activityId: id })
      res = res.length > 0 ? res[0] : null
    } catch (e) {
      throw e
    } finally {
      Taro.hideLoading()
    }

    this.setState({ info: res, originalInfo: res })
  }

  initBg = (month = time.moment().month()) => {
    this.setState({ calendarBg: calendarBgUrls[month] })
  }

  navToCourse = code => {
    Taro.navigateTo({
      url: `/subpackages/course/pages/course/course?title=${this.state.info.module}&code=${code}&school_code=${this.state.info.department}`,
    })
  }

  showGroups = async () => {
    this.setState(prevState => ({
      isGroupToggle: !prevState.isGroupToggle,
    }))
    if (this.state.hasGroupLoaded) {
      return
    }
    this.setState({ isGroupLoading: true })
    const res = await api.Timetable.browse({
      moduleCode: this.state.info.module_code.toString(),
      nameOfType: this.state.info.name_of_type,
    })

    this.setState({ isGroupLoading: false, groups: res, hasGroupLoaded: true })
  }

  navToActivity = activityName => {
    // change to another group
    Taro.vibrateShort()
    const targetGroupIndex = this.state.groups.findIndex(
      group => group.activity === activityName
    )
    this.setState({ info: this.state.groups[targetGroupIndex] })
  }

  handleDelete = async () => {
    Taro.vibrateShort()
    const { confirm } = await Taro.showModal({
      title: Taro.T._('Delete') + ' ' + this.state.originalInfo.activity,
      content: Taro.T._(
        'Are you sure you want to delete this activity from your timetable?'
      ),
      cancelText: Taro.T._('No'),
      confirmText: Taro.T._('OK'),
      confirmColor: '#f40',
    })
    if (!confirm) {
      return
    }
    Taro.showLoading({ title: Taro.T._('Loading') })
    try {
      await api.Timetable.delete({
        activityName: this.state.originalInfo.activity,
      })
      Taro.hideLoading()
      Taro.navigateBack()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: Taro.T._('Failed'), icon: 'none' })
    }
  }

  handleUpdate = async () => {
    Taro.vibrateShort()
    if (this.state.info.activity === this.state.originalInfo.activity) {
      Taro.showToast({ title: Taro.T._('Nothing to update'), icon: 'none' })
      return
    }
    const { confirm } = await Taro.showModal({
      title: Taro.T._('Change to') + ' ' + this.state.info.activity,
      content: Taro.T._(
        'Are you sure you want to change the group of this course?'
      ),
      cancelText: Taro.T._('No'),
      confirmText: Taro.T._('OK'),
      confirmColor: '#f40',
    })
    if (!confirm) {
      return
    }
    Taro.showLoading({ title: Taro.T._('Loading') })
    try {
      await api.Timetable.update({
        oldActivityName: this.state.originalInfo.activity,
        newActivityName: this.state.info.activity,
      })
      Taro.hideLoading()
      Taro.navigateBack()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: Taro.T._('Failed'), icon: 'none' })
    }
  }

  handleCreate = async () => {
    Taro.vibrateShort()
    const { confirm } = await Taro.showModal({
      title: Taro.T._('Add') + ' ' + this.state.info.activity,
      content: Taro.T._(
        'Are you sure you want to add this activity to your timetable?'
      ),
      cancelText: Taro.T._('No'),
      confirmText: Taro.T._('OK'),
      confirmColor: '#f40',
    })
    if (!confirm) {
      return
    }
    Taro.showLoading({ title: Taro.T._('Loading') })
    try {
      await api.Timetable.create({
        activityName: this.state.info.activity,
      })
      Taro.hideLoading()
      Taro.navigateBack()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: Taro.T._('Failed'), icon: 'none' })
    }
  }

  render() {
    return (
      <View className="activity-page">
        <Navigation title={this.state.name} align="left" mode="transparent" />

        <View className="header">
          <Image
            className="calendar-bg"
            mode="aspectFill"
            src={this.state.calendarBg}
          />
          <View className="title">{this.state.info.module}</View>
        </View>

        <View className="panel">
          <View className="list-item ripple">
            <UIcon icon="manage-o" icon-class="icon" />
            <View className="content">{this.state.info.name_of_type}</View>
          </View>

          <View className="list-item ripple">
            <UIcon icon="time-o" icon-class="icon" />
            {this.state.info.start && (
              <View className="content">
                {`${this.state.info.start} ~ ${this.state.info.end} ${this.state.info.day}`}
              </View>
            )}
          </View>

          <View className="list-item ripple">
            <UIcon icon="createtask-o" icon-class="icon" />
            <View className="content">
              <View className="item">{Taro.T._('Weeks')}:</View>
              {this.state.info.weeks &&
                this.state.info.weeks.map(week => (
                  <View key={week} className="item">
                    {week}
                  </View>
                ))}
            </View>
          </View>

          <View className="list-item ripple">
            <UIcon icon="coordinates-o" icon-class="icon" />
            <View className="content">{this.state.info.room}</View>
          </View>

          <View className="list-item ripple">
            <UIcon icon="people-o" icon-class="icon" />
            <View className="content">
              {this.state.info.staff &&
                this.state.info.staff.map(s => (
                  <View key={s} className="item">
                    {s}
                  </View>
                ))}
            </View>
          </View>

          <View className="list-item ripple">
            <UIcon icon="label-o" icon-class="icon" />
            <View className="content">
              {this.state.info.module_code &&
                this.state.info.module_code.map(module => (
                  <View
                    key={module}
                    className="item label"
                    onClick={this.navToCourse.bind(this, module)}
                  >
                    {module}
                  </View>
                ))}
            </View>
          </View>
        </View>

        <View className="panel">
          <View className="list-item ripple" onClick={this.showGroups}>
            <UIcon icon="group-o" icon-class="icon" />
            <View className="content">{Taro.T._('All Groups')}</View>
            <UIcon
              icon={this.state.isGroupToggle ? 'unfold' : 'enter'}
              icon-class="icon addon"
            />
          </View>

          {this.state.isGroupToggle && (
            <View className="list-item">
              {this.state.isGroupLoading && (
                <View className="loading">
                  <Loading color="primary" />
                </View>
              )}

              {!this.state.isGroupLoading && (
                <View className="modules">
                  {this.state.groups.map((group, i) => (
                    <View
                      className={`module-label ${
                        group.activity === this.state.info.activity
                          ? 'my-module-label'
                          : ''
                      }`}
                      key={i}
                      onClick={this.navToActivity.bind(this, group.activity)}
                    >
                      {group.activity}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        <View className="btns">
          {this.state.isDeleteEnabled && (
            <View className="btn delete" onClick={this.handleDelete}>
              <UIcon icon="empty" icon-class="icon" />
            </View>
          )}
          {this.state.isEvalEnabled && this.state.info.module_code && (
            <View
              key={this.state.info.module_code}
              className="btn eval"
              onClick={this.navToCourse.bind(this, this.state.info.module_code)}
            >
              {/* TODO: replace icon */}
              <UIcon icon="eval" icon-class="icon" />
            </View>
          )}
          {this.state.isUpdateEnabled && (
            <View className="btn update" onClick={this.handleUpdate}>
              <UIcon icon="right" icon-class="icon" />
            </View>
          )}
          {this.state.isCreateEnabled && (
            <View className="btn update" onClick={this.handleCreate}>
              <UIcon icon="add" icon-class="icon" />
            </View>
          )}
        </View>
      </View>
    )
  }
}
