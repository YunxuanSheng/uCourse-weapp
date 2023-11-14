import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Navigator, Button } from '@tarojs/components'
import config from '../../../../config'
import './MyPanel.scss'

// https://tucao.qq.com/helper/configCustomParameter
const tucaoAppId = 'wx8abaf00ee8c3202e'

export default class MyPanel extends Component {
  state = {
    items: [],
    extraData: {},
  }

  componentWillMount() {
    this.setState({
      items: [
        {
          icon: 'https://i.loli.net/2018/06/30/5b36fb8e8ee13.png',
          name: Taro.T._('Profile'),
          url: '/subpackages/profile/pages/profile/profile',
        },
        {
          icon: 'https://i.loli.net/2018/08/07/5b688da409700.png',
          name: Taro.T._('Favorite'),
          url: '/pages/fav/fav',
        },
        {
          icon: 'https://i.loli.net/2018/09/12/5b97ff375d962.png',
          name: Taro.T._('Drafts'),
          url: '/pages/drafts/drafts',
        },
        {
          icon: 'https://i.loli.net/2018/06/30/5b36fb8d7901d.png',
          name: Taro.T._('Courses'),
          url: '/subpackages/search/pages/search/search?from=myCourses',
        },
        // {
        //   icon: 'https://i.loli.net/2018/06/30/5b36fb8c07332.png',
        //   name: Taro.T._('Timetable'),
        //   url: '',
        // },
        // {
        //   icon: 'https://i.loli.net/2018/06/30/5b36fb8ebbcf1.png',
        //   name: Taro.T._('Medals'),
        //   url: '',
        // },
        {
          icon: 'https://i.loli.net/2019/09/26/qnK7tYBdczVeJxG.png',
          name: Taro.T._('Customer Service'),
          url: 'service',
        },
        // {
        //   icon: 'https://i.loli.net/2018/06/30/5b36fb8e2f216.png',
        //   name: Taro.T._('Tools'),
        // },
        {
          icon: 'https://i.loli.net/2018/06/30/5b36fb8e90661.png',
          name: Taro.T._('Feedbacks'),
          url: 'tucao',
        },
        // {
        //   icon: 'https://i.loli.net/2018/06/30/5b36fd226cfc0.png',
        //   name: Taro.T._('Settings'),
        //   url: '',
        // },
        {
          icon: 'https://i.loli.net/2020/06/15/OjiRZDCMzHWepuJ.png',
          name: Taro.T._('Card Holder'),
          url: '/subpackages/cards/pages/cards/cards',
        },
        {
          icon: 'https://i.loli.net/2018/08/07/5b688da409700.png', // TODO: new icon
          name: Taro.T._('Course QA'),
          url: '/subpackages/course-qa/pages/course-qa/course-qa',
        },
        {},
      ],
    })
  }

  componentDidMount() {
    this.setState({
      extraData: {
        id: config.tucaoId,
        customData: {
          clientInfo: JSON.stringify(Taro.systemInfo),
          clientVersion: Taro.systemInfo.clientVersion,
          os: Taro.systemInfo.system,
          osVersion: Taro.systemInfo.version,
          netType: Taro.networkType,
        },
      },
    })
  }

  navTo = url => {
    if (!url) {
      Taro.showToast({ title: Taro.T._('Developing'), icon: 'none' })
      return
    }
    Taro.navigateTo({ url })
  }

  render() {
    return (
      <View className="panel">
        {this.state.items.map(item => {
          if (item.url === 'tucao') {
            return (
              <Navigator
                className="item"
                key={item.name}
                target="miniProgram"
                openType="navigate"
                appId={tucaoAppId}
                extraData={this.state.extraData}
                version="release"
              >
                <Image className="icon" src={item.icon} />
                <Text className="name">{item.name}</Text>
              </Navigator>
            )
          } else if (item.url === 'service') {
            return (
              <Button className="item" openType="contact">
                <Image className="icon" src={item.icon} />
                <Text className="name">{item.name}</Text>
              </Button>
            )
          }

          return (
            <View
              className="item"
              key={item.name}
              onClick={this.navTo.bind(this, item.url)}
            >
              <Image className="icon" src={item.icon} />
              <Text className="name">{item.name}</Text>
            </View>
          )
        })}
      </View>
    )
  }
}
