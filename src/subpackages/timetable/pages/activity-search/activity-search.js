import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Search from './components/Search/Search'
import './activity-search.scss'

export default class ActivitySearch extends Component {
  render() {
    return (
      <View className="activity-search">
        <Navigation title={Taro.T._('Timetable Search')} />

        <View>
          <Search />
        </View>
      </View>
    )
  }
}
