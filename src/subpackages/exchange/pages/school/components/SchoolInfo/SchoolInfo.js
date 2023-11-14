import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import time from '../../../../../../utils/time'
import helper from '../../../../../../utils/helper'

import './SchoolInfo.scss'

export default class SchoolInfo extends Component {
  static defaultProps = {
    info: {},
  }

  openLink = url => {
    helper.openWebLink(url)
  }

  render() {
    return (
      <View className="school-info">
        {this.props.info.exchange && (
          <View className="field">
            <View className="key">{Taro.T._('Exchange')}</View>
            <View className="value">{this.props.info.exchange}</View>
          </View>
        )}

        {this.props.info.study_abroad && (
          <View className="field">
            <View className="key">{Taro.T._('Study Abroad')}</View>
            <View className="value">{this.props.info.study_abroad}</View>
          </View>
        )}

        <View className="field">
          <View className="key">{Taro.T._('Application')}</View>
          <View className="value">
            {this.props.info.application
              ? time.YYYYMMDD(this.props.info.application)
              : 'TBD'}
            {' ~ '}
            {this.props.info.application_deadline
              ? time.YYYYMMDD(this.props.info.application_deadline)
              : 'TBD'}
          </View>
        </View>

        <View className="field">
          <View className="key">{Taro.T._('Nomination')}</View>
          <View className="value">
            {this.props.info.nomination
              ? time.YYYYMMDD(this.props.info.nomination)
              : 'TBD'}
            {' ~ '}
            {this.props.info.nomination_deadline
              ? time.YYYYMMDD(this.props.info.nomination_deadline)
              : 'TBD'}
          </View>
        </View>

        {this.props.info.average_mark_required && (
          <View className="field">
            <View className="key">{Taro.T._('Average Mark Required')}</View>
            <View className="value">
              {this.props.info.average_mark_required}
            </View>
          </View>
        )}

        {this.props.info.agreement_type && (
          <View className="field">
            <View className="key">{Taro.T._('Agreement Type')}</View>
            <View className="value">{this.props.info.agreement_type}</View>
          </View>
        )}

        {this.props.info.english_proficiency && (
          <View className="field">
            <View className="key">{Taro.T._('English Proficiency')}</View>
            <View className="value">{this.props.info.english_proficiency}</View>
          </View>
        )}

        {this.props.info.university_link && (
          <View className="field">
            <View className="key">{Taro.T._('University Link')}</View>
            <View className="value">
              <View
                className="link"
                onClick={this.openLink.bind(
                  this,
                  this.props.info.university_link,
                )}
              >
                {this.props.info.university_link}
              </View>
            </View>
          </View>
        )}

        {this.props.info.module_link && (
          <View className="field">
            <View className="key">{Taro.T._('Module Link')}</View>
            <View className="value">
              <View
                className="link"
                onClick={this.openLink.bind(this, this.props.info.module_link)}
              >
                {this.props.info.module_link}
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}
