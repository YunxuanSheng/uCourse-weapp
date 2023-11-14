import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Rate from '../../../../../../components/Rate/Rate'
import './Skeleton.scss'

export default class Skeleton extends Component {
  render() {
    return (
      <View>
        <View className="eval-container-skeleton">
          <View className="header">
            <View className="avatar-container skeleton-loading" />
            <View className="user-info">
              <View className="nickname skeleton-loading" />
              <View className="intro skeleton-loading" />
            </View>
          </View>
          <View className="eval-rate">
            <View className="left">
              <View className="rate-container">
                <View className="rate-name">{Taro.T._('Design')}</View>
                <Rate defaultValue={0} disabled />
              </View>
              <View className="rate-container">
                <View className="rate-name">{Taro.T._('Quality')}</View>
                <Rate defaultValue={0} disabled />
              </View>
              <View className="rate-container">
                <View className="rate-name">{Taro.T._('Simplicity')}</View>
                <Rate defaultValue={0} disabled />
              </View>
              <View className="rate-container">
                <View className="rate-name">{Taro.T._('Course Year')}</View>
                {Taro.T._('???')}
              </View>
            </View>
            <View className="right">
              <Text className="score-comp">
                <Text className="comp">{Taro.T._('Comprehensive')}：</Text>
                ?.?
              </Text>
            </View>
          </View>
          <View className="content">
            <View className="row">
              <View className="col-10 skeleton-loading" />
            </View>
            <View className="row">
              <View className="col-4 skeleton-loading" />
              <View className="col-7 skeleton-loading" />
            </View>
            <View className="row">
              <View className="col-3 skeleton-loading" />
              <View className="col-9 skeleton-loading" />
            </View>
            <View className="row">
              <View className="col-7 skeleton-loading" />
              <View className="col-4 skeleton-loading" />
            </View>
            <View className="row">
              <View className="col-3 skeleton-loading" />
              <View className="col-2 skeleton-loading" />
              <View className="col-7 skeleton-loading" />
            </View>
            <View className="row">
              <View className="col-4 skeleton-loading" />
              <View className="col-3 skeleton-loading" />
              <View className="col-3 skeleton-loading" />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
