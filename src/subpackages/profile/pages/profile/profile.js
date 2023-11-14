import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Content from './components/Content/Content'
import Navigation from '../../../../components/Navigation/Navigation'
import Avatar from '../../../../components/Avatar/Avatar'
import UIcon from '../../../../components/UIcon/UIcon'
import Badge from '../../../../components/Badge/Badge'
import helper from '../../../../utils/helper'
import api from '../../../../utils/api'

import './profile.scss'

export default class Profile extends Component {
  state = {
    userInfo: {},
    navMode: 'transparent',
    statusBarHeight: 0,
    isFinished: false,
    userId: 'self',
    promoCode: undefined,
    isOther: false,
  }

  async componentWillMount() {
    const userId = this.$router.params.id
    this.setState({
      statusBarHeight: Taro.systemInfo.statusBarHeight,
      userId,
      isOther: this.$router.params.hasOwnProperty('id'),
    })
    const userInfo = await api.Users.retrieve(userId)
    this.setState({
      userInfo,
      isFinished: true,
    })
  }

  async componentDidMount() {
    const res = await api.Promo.get({ create: false })
    this.setState({
      promoCode: res.hasOwnProperty('promo_code') ? res.promo_code : undefined,
    })
  }

  onPageScroll(e) {
    const { scrollTop } = e
    if (scrollTop > 10 && this.state.navMode === 'transparent') {
      this.setState({ navMode: 'frost' })
    } else if (scrollTop < 10 && this.state.navMode === 'frost') {
      this.setState({ navMode: 'transparent' })
    }
  }

  onReachBottom() {
    Taro.eventCenter.trigger('onReachProfileBottom')
  }

  render() {
    return (
      <View className="profile-page">
        <Navigation
          mode={this.state.navMode}
          title={
            this.state.navMode === 'frost' ? this.state.userInfo.nickname : ''
          }
          borderless
        />
        <View
          className="header"
          style={`height: ${this.state.statusBarHeight + 100}px`}
        />

        {this.state.isFinished && (
          <View className="user-info">
            <View className="avatar">
              <Avatar src={this.state.userInfo.avatar || ''} size="small" />
            </View>

            <View className="info">
              <View className="base">
                <Text className="nickname">{this.state.userInfo.nickname}</Text>
                <UIcon
                  icon-class="gender"
                  icon={helper.parseGender(this.state.userInfo.gender)}
                />
                <View className="badge">
                  <Badge
                    type="email_verification"
                    status={this.state.userInfo.is_verified}
                  />
                </View>
              </View>

              <View className="infoitem">
                <UIcon icon="coordinates" />
                <Text>{this.state.userInfo.country}</Text>
                <Text>{this.state.userInfo.province}</Text>
                <Text>{this.state.userInfo.city}</Text>
              </View>

              <View className="infoitem">
                <UIcon icon="question" />
                <Text>{helper.parseMajor(this.state.userInfo.major_code)}</Text>
              </View>

              <View className="prop">
                <Text>{`${Taro.T._('Published')} ${
                  this.state.userInfo.prop.eval_count
                } ${Taro.T._('evaluations')}`}</Text>
                {/*eslint-disable*/}
                <Text>{` · `}</Text>
                {/*eslint-enable*/}
                <Text>
                  {`${Taro.T._('Got')} ${
                    this.state.userInfo.prop.vote_pro_count
                  } ${Taro.T._('pros')}`}
                </Text>
                {/*eslint-disable*/}
                <Text>{'\n'}</Text>
                {/*eslint-enable*/}
                {!this.state.isOther && (
                  <Text>
                    {`${Taro.T._('Invitation Code')}`}
                    {': '}
                    {this.state.promoCode
                      ? `${this.state.promoCode}`
                      : `${Taro.T._(
                          'Please publish an eval first to get the invitation code'
                        )}`}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        <Content userId={this.state.userId} />
        {/* </View> */}
      </View>
    )
  }
}
