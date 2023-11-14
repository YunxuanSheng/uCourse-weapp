import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import './Skeleton.scss'

export default class Skeleton extends Component {
  navTo = url => {
    Taro.navigateTo({ url })
  }

  render() {
    return (
      <View className="content-wrap">
        <View className="field">
          <View className="field-title">
            <View>{Taro.T._('People Asking')}</View>
            <View
              className="see-more"
              onClick={this.navTo.bind(
                this,
                '/subpackages/discover/pages/discover/discover?id=courseQuestions'
              )}
            >
              {Taro.T._('See More')}
            </View>
          </View>
          <View className="field-content">
            <ScrollView className="scroll-view" scrollX>
              {[...Array(3).keys()].map(c => (
                <View key={c} className="my-course-card-placeholder" />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="field">
          <View className="field-title">
            <View>{Taro.T._('Courses of My Faculty')}</View>
            <View
              className="see-more"
              onClick={this.navTo.bind(
                this,
                '/subpackages/search/pages/search/search?from=myCourses'
              )}
            >
              {Taro.T._('See More')}
            </View>
          </View>
          <View className="field-content">
            <ScrollView className="scroll-view" scrollX>
              {[...Array(3).keys()].map(c => (
                <View key={c} className="my-course-card-placeholder" />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="field">
          <View className="field-title">
            <View>{Taro.T._('Popular Evaluations Monthly')}</View>
            <View
              className="see-more"
              onClick={this.navTo.bind(
                this,
                '/subpackages/discover/pages/discover/discover?id=topEvals'
              )}
            >
              {Taro.T._('See More')}
            </View>
          </View>
          <View className="field-content">
            <ScrollView className="scroll-view" scrollX>
              {[...Array(2).keys()].map(c => (
                <View key={c} className="eval-card-placeholder" />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="field">
          <View className="field-title">
            <View>{Taro.T._('Recent Evaluations')}</View>
            <View
              className="see-more"
              onClick={this.navTo.bind(
                this,
                '/subpackages/discover/pages/discover/discover?id=recentEvals'
              )}
            >
              {Taro.T._('See More')}
            </View>
          </View>
          <View className="field-content">
            <ScrollView className="scroll-view" scrollX>
              {[...Array(2).keys()].map(c => (
                <View key={c} className="eval-card-placeholder" />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="field">
          <View className="field-title">
            <View>{Taro.T._('Top Courses')}</View>
            <View
              className="see-more"
              onClick={this.navTo.bind(
                this,
                '/subpackages/discover/pages/discover/discover?id=topCourses'
              )}
            >
              {Taro.T._('See More')}
            </View>
          </View>
          <View className="field-content">
            <ScrollView className="scroll-view" scrollX>
              {[...Array(2).keys()].map(c => (
                <View key={c} className="course-card-placeholder" />
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="field">
          <View className="field-title">
            <View>{Taro.T._('Hot Courses')}</View>
            <View
              className="see-more"
              onClick={this.navTo.bind(
                this,
                '/subpackages/discover/pages/discover/discover?id=hotCourses'
              )}
            >
              {Taro.T._('See More')}
            </View>
          </View>
          <View className="field-content">
            <ScrollView className="scroll-view" scrollX>
              {[...Array(2).keys()].map(c => (
                <View key={c} className="course-card-placeholder" />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
