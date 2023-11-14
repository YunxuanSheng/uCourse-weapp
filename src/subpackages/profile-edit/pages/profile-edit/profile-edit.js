import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Avatar from '../../../../components/Avatar/Avatar'

import api from '../../../../utils/api'
import helper from '../../../../utils/helper'

import './profile-edit.scss'

export default class ProfileEdit extends Component {
  state = {
    userInfo: {},
    isVisible: false,
  }

  componentWillMount() {
    this.fetchVisibility()
  }

  fetchVisibility = async () => {
    const visibility = await api.ExaminePass.get()
    if (visibility) {
      this.setState({ isVisible: visibility })
    }
  }

  async componentDidShow() {
    const userInfo = Taro.getStorageSync('userInfo')
    console.log(userInfo)
    if (userInfo) {
      // use cache
      this.setState({ userInfo })
    }
    // update info from server
    // const newInfo = await api.Users.retrieve('self')
    // this.setState({ userInfo: newInfo })
    // Taro.setStorageSync('userInfo', newInfo)
  }

  navTo = url => {
    Taro.navigateTo({ url })
  }

  render() {
    return (
      <View className="edit-page">
        <Navigation title={Taro.T._('Edit Profile')} />

        <View className="list">
          <View className="list-item">
            <View className="left">{Taro.T._('Avatar')}</View>
            <View className="right">
              <View>
                <Avatar src={this.state.userInfo.avatar} size={80} />
              </View>
              {/* <UIcon icon-class='enter' icon='enter' /> */}
            </View>
          </View>

          <View className="list-item">
            <View className="left">{Taro.T._('Nickname')}</View>
            <View className="right">
              <View>{this.state.userInfo.nickname}</View>
              {/* <UIcon icon-class='enter' icon='enter' /> */}
            </View>
          </View>

          <View className="list-item">
            <View className="left">{Taro.T._('Gender')}</View>
            <View className="right">
              <View>
                <UIcon icon={helper.parseGender(this.state.userInfo.gender)} />
              </View>
              {/* <UIcon icon-class='enter' icon='enter' /> */}
            </View>
          </View>

          <View className="list-item">
            <View className="left">{Taro.T._('Location')}</View>
            <View className="right">
              <View>
                {this.state.userInfo.country} {this.state.userInfo.province}{' '}
                {this.state.userInfo.city}
              </View>
              {/* <UIcon icon-class='enter' icon='enter' /> */}
            </View>
          </View>

          <View>
            {this.state.isVisible
              ? (
              <View>
                <View className="gap" />

                <View
                  className="list-item"
                  onClick={this.navTo.bind(
                    this,
                    '/subpackages/profile-edit/pages/profile-edit-email/profile-edit-email'
                  )}
                >
                  <View className="left">
                    {Taro.T._('Email')}
                    {!this.state.userInfo.is_verified && <View className="red-dot" />}
                  </View>
                  <View className="right">
                    <View>{this.state.userInfo.email || Taro.T._('Not Set')}</View>
                    <UIcon icon-class="enter" icon="enter" />
                  </View>
                </View>

                <View
                  className="list-item"
                  onClick={this.navTo.bind(
                    this,
                    '/subpackages/profile-edit/pages/profile-edit-major/profile-edit-major'
                  )}
                >
                  <View className="left">
                    {Taro.T._('Major & Level')}
                    {!this.state.userInfo.major_code && <View className="red-dot" />}
                  </View>
                  <View className="right">
                    <View>
                      {helper.parseMajor(this.state.userInfo.major_code) ||
                        Taro.T._('Not Set')}
                    </View>
                    <UIcon icon-class="enter" icon="enter" />
                  </View>
                </View>

                {/* <View className='list-item'>
                  <View className='left'>年级</View>
                  <View className='right'>
                    <View>{this.state.userInfo.level || '未设置'}</View>
                    <UIcon icon-class='enter' icon='enter' />
                  </View>
                </View> */}

                <View
                  className="list-item"
                  onClick={this.navTo.bind(
                    this,
                    '/subpackages/profile-edit/pages/profile-edit-id/profile-edit-id'
                  )}
                >
                  <View className="left">
                    {Taro.T._('Student ID')}
                    {!this.state.userInfo.student_id && <View className="red-dot" />}
                  </View>
                  <View className="right">
                    <View>
                      {this.state.userInfo.student_id || Taro.T._('Not Set')}
                    </View>
                    <UIcon icon-class="enter" icon="enter" />
                  </View>
                </View>

                <View className="gap" />

                <View className="hint">{`* ${Taro.T._(
                  'The basic information is synchronized with the WeChat data and the changes are not supported at this time.'
                )}`}</View>
                {!this.state.userInfo.email && (
                  <View className="hint">
                    {`* ${Taro.T._(
                      'Verify the mailbox and then participate in the community interaction.'
                    )}`}
                  </View>
                )}
                {!this.state.userInfo.major_code && (
                  <View className="hint">{`* ${Taro.T._(
                    'Set a major and get a better course evaluation recommendation.'
                  )}`}</View>
                )}
                {!this.state.userInfo.student_id && (
                  <View className="hint">{`* ${Taro.T._(
                    'Set the student number to enable the timetable.'
                  )}`}</View>
                )}
              </View>)
              : null }
          </View>
        </View>
      </View>
    )
  }
}