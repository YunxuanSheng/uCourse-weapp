import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'

import './profile-edit-id.scss'

export default class ProfileEditId extends Component {
  state = {
    studentId: '',
    btnDisabled: true,
  }

  async componentWillMount() {
    const { student_id } = Taro.getStorageSync('userInfo')
    if (student_id) {
      this.setState({ studentId: student_id })
    }
  }

  handleInput = e => {
    const { value } = e.detail
    // console.log(value)
    this.setState({ studentId: value, btnDisabled: false })
  }

  handleSubmit = async () => {
    Taro.showLoading({ title: Taro.T._('Saving'), mask: true })
    const { studentId } = this.state
    await api.Users.update({ studentId })
    Taro.hideLoading()
    Taro.navigateBack()
  }

  render() {
    return (
      <View className="edit-id-page">
        <Navigation title={Taro.T._('Edit Student ID')} />
        <View className="gap" />
        <View className="list-item">
          <Input
            className="input"
            type="number"
            value={this.state.studentId}
            placeholder={`${Taro.T._(
              'Input student ID'
            )}(e.g. 16522132, 20023333)`}
            focus
            onInput={this.handleInput}
          />
        </View>
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
