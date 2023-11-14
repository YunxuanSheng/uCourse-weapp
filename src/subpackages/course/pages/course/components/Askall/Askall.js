import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import './Askall.scss'

export default class Askall extends Component {
  navToAskAllList = (course_code, title, schoolCode) => {
    Taro.navigateTo({
      url: `/subpackages/askall/pages/askall/askall?id=${course_code}&title=${title}&schoolCode=${schoolCode}`,
    })
  }
  render() {
    return (
      <View className="Askall">
        <View className="props">
          <View className="header">
            <Text className="props-left">{`${Taro.T._('Course QA')}(${
              this.props.list_length
            })`}</Text>
            <Button
              className="props-right"
              onClick={this.navToAskAllList.bind(
                this,
                this.props.course_code,
                this.props.title,
                this.props.schoolCode
              )}
              // disabled={!this.props.isFinished}
            >
              {Taro.T._('See all')}
            </Button>
          </View>
          <View className="body">
            {this.props.list.map(item => (
              <View key={item.id} className="list-fit">
                <Text className="content">{item.content}</Text>
                <Text className="content">{`${item.reply_count}${Taro.T._(
                  'Questions'
                )}`}</Text>
              </View>
            ))}
            {this.props.list && this.props.list_length === 0 && (
              <View className="content">
                该课程下还没有问题哦，点击「查看全部」去提问吧～
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }
}
