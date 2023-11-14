import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Image } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Btn from '../../../../components/Btn/Btn'
import UIcon from '../../../../components/UIcon/UIcon'
import api from '../../../../utils/api'

// import { majorData as dataSource } from '../../utils/data'

import { majorData, years, levels } from '../../../../utils/data'

import './profile-edit-major.scss'

let dataSource = majorData.filter(m => m.majors.length > 0)
.sort((a, b) => {
  if (a.school < b.school) {return -1; }
  else if (a.school > b.school) {return 1; }
  else {return 0; }
})
for (let m of dataSource) {
  m.majors.sort((major_i, major_j) => {
    if (major_i.name < major_j.name) return -1;
    else if (major_i.name > major_j.name) return 1;
    else return 0;
  });
}

const schools = dataSource.map(d => d.school)

export default class ProfileEditMajor extends Component {
  state = {
    range: [schools, dataSource[0].majors.map(major => major.name)],
    majorName: '点击选择专业',
    majorIcon: '',
    schoolCode: '',
    majorCode: '',
    btnDisabled: true,
    level: 0,
    yearIndex: 0,
  }

  async componentWillMount() {
    const userInfo = Taro.getStorageSync('userInfo')
    const { school_code, major_code, level, year } = userInfo
    console.log(dataSource)
    if (school_code) {
      const major = dataSource
        .filter(d => d.school === school_code)[0]
        .majors.filter(m => m.code === major_code)[0]
      const yearIndex = years.map(y => y.value).findIndex(v => v === year)

      this.setState({
        schoolCode: school_code,
        majorCode: major_code,
        majorName: major.name,
        majorIcon: major.icon,
        level,
        yearIndex,
      })
    }
  }

  handleMajorChange = e => {
    const { value } = e.detail
    // console.log(value)
    const school = dataSource[value[0] || 0]
    const major = school.majors[value[1] || 0]
    // console.log(major)
    this.setState({
      majorName: major.name,
      majorIcon: major.icon,
      schoolCode: school.school,
      majorCode: major.code,
      btnDisabled: false,
    })
  }

  handleColumnChange = e => {
    const { column, value } = e.detail
    if (column === 0) {
      this.changeRange(value)
    }
  }

  handleLevelChange = e => {
    const level = parseInt(e.detail.value, 10)
    this.setState({ level })
    if (this.state.schoolCode) {
      this.setState({ btnDisabled: false })
    }
  }

  handleYearChange = e => {
    const yearIndex = parseInt(e.detail.value, 10)
    this.setState({ yearIndex })
    if (this.state.schoolCode) {
      this.setState({ btnDisabled: false })
    }
  }

  changeRange = index => {
    const majors = dataSource[index].majors.map(major => major.name)
    this.setState({ range: [schools, majors] })
  }

  handleSubmit = async () => {
    Taro.showLoading({ title: Taro.T._('Saving'), mask: true })
    const { schoolCode, majorCode, level, yearIndex } = this.state
    const year = years[yearIndex].value
    await api.Users.update({ schoolCode, majorCode, level, year })
    Taro.hideLoading()
    Taro.navigateBack()
  }

  showPrompt = e => {
    e.stopPropagation()
    Taro.showModal({
      title: Taro.T._('Select Your Major'),
      content: Taro.T._(
        'Currently my courses are classified according to the department. Freshmen who have not yet been divided into small majors can choose one of their majors after choosing their own department.'
      ),
      showCancel: false,
      confirmText: '好',
      confirmColor: '#ff9800',
    })
  }

  render() {
    const yearRange = years.map(y => y.year)
    return (
      <View className="edit-major-page">
        <Navigation title={Taro.T._('Edit Major')} />

        <View className="gap" />

        <Picker
          mode="multiSelector"
          range={this.state.range}
          onChange={this.handleMajorChange}
          onColumnChange={this.handleColumnChange}
        >
          <View className="list-item">
            {this.state.majorIcon && (
              <Image className="icon" src={this.state.majorIcon} />
            )}
            <View className="name">{this.state.majorName}</View>

            <View className="prompt-icon" onClick={this.showPrompt}>
              <UIcon icon="prompt" />
            </View>
          </View>
        </Picker>

        <Picker
          mode="selector"
          range={yearRange}
          onChange={this.handleYearChange}
        >
          <View className="list-item">
            {Taro.T._('Start Year')}：{yearRange[this.state.yearIndex]}
          </View>
        </Picker>

        <Picker
          mode="selector"
          range={levels}
          onChange={this.handleLevelChange}
        >
          <View className="list-item">
            {Taro.T._('Grade')}：{levels[this.state.level]}
          </View>
        </Picker>

        <View className="gap" />

        <Btn
          type="primary"
          size="long"
          text={Taro.T._('Save')}
          onClick={this.handleSubmit}
          disabled={this.state.btnDisabled}
        />
      </View>
    )
  }
}
