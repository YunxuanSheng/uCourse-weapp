import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../../../../../components/UIcon/UIcon'

import './TimetableEntry.scss'

export default class TimetableEntry extends Component {
  render() {
    return (
      <View className="timetable-entry">
        <UIcon icon="clock" icon-class="icon" />
        {Taro.T._('Check Timetable')}
      </View>
    )
  }
}
