import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import './course-search-md.scss'

export default class CourseSearchMd extends Component {
  state = {
    md: `
# 如何获取Hex ID

第一步：打开 <https://unnc-sws-ad.scientia.com.cn/> 登录

![登陆](https://ufair.oss-cn-hangzhou.aliyuncs.com/hspljrwl6x)

第二步：各项设置随意，点击"View Timetable", 然后复制浏览器的链接，形如: <http://timetablingunnc.nottingham.ac.uk:8005/reporting/Individual;Student+Set;id;XXXXXXED56E16A414EE69BF87AXXXXXX?days=1-5&weeks=2-14&periods=1-24&template=Student+Set+Individual&height=100&week=100>

![复制](https://ufair.oss-cn-hangzhou.aliyuncs.com/qd7gw6xqog)

第三步：将链接粘贴在Hex ID的输入框内

![粘贴](https://ufair.oss-cn-hangzhou.aliyuncs.com/3tjxvyspdx)

第四步：点击"保存"，完成设置

    `,
  }

  config = {
    usingComponents: {
      wemark: '../../../../components/third-party/wemark/wemark',
    },
  }

  render() {
    return (
      <View className="course-search-md-page">
        <Navigation title="How to Get Hex ID" />
        <View className="content">
          <wemark md={this.state.md} link highlight type="wemark" />
        </View>
      </View>
    )
  }
}
