import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import time from '../../../../utils/time'
import { flags } from '../../../../utils/data'

import './SchoolCard.scss'

export default class SchoolCard extends Component {
  static defaultProps = {
    title: 'Uni',
    country: 'China',
    exchange: 0,
    studyAbroad: 0,
    nomination: null,
    nominationDeadline: null,
    application: null,
    applicationDeadline: null,
    agreementType: '',
    englishProficiency: '',
    notes: '',
  }

  render() {
    return (
      <View className="school-card">
        <View className="country">
          <View className="country-text">{flags[this.props.country]} {this.props.country}</View>
        </View>
        <View className="title">{this.props.title}</View>

        <View className="list">
          {this.props.exchange && (
            <View>
              <Text className="field">{`${Taro.T._('Exchange')}: `}</Text>
              {this.props.exchange}
            </View>
          )}

          {this.props.studyAbroad && (
            <View>
              <Text className="field">{`${Taro.T._('Study Abroad')}: `}</Text>
              {this.props.studyAbroad}
            </View>
          )}

          <View className="field">{`${Taro.T._('Application')}: `}</View>
          <View>
            {this.props.application
              ? time.YYYYMMDD(this.props.application)
              : 'TBD'}
            {' ~ '}
            {this.props.applicationDeadline
              ? time.YYYYMMDD(this.props.applicationDeadline)
              : 'TBD'}
          </View>

          <View className="field">{`${Taro.T._('Nomination')}: `}</View>
          <View>
            {this.props.application
              ? time.YYYYMMDD(this.props.nomination)
              : 'TBD'}
            {' ~ '}
            {this.props.applicationDeadline
              ? time.YYYYMMDD(this.props.nominationDeadline)
              : 'TBD'}
          </View>

          {/* {this.props.agreementType && (
            <View>
              <Text className="field">{`${Taro.T._('Agreement Type')}: `}</Text>
              {this.props.agreementType}
            </View>
          )}

          {this.props.englishProficiency && (
            <View>
              <Text className="field">{`${Taro.T._(
                'English Proficiency',
              )}: `}</Text>
              {this.props.englishProficiency}
            </View>
          )} */}

          {/* {this.props.notes && (
            <View>
              <Text className="field">{`${Taro.T._('Notes')}: `}</Text>
              {this.props.notes}
            </View>
          )} */}
        </View>
      </View>
    )
  }
}
