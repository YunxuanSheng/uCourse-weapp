import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './PropBar.scss'

export default class PropBar extends Component {
  state = {
    items: [],
  }

  componentWillMount() {
    this.setState({
      items: [
        { name: Taro.T._('My Evaluations'), count: 0 },
        { name: Taro.T._('My Posts'), count: 0 },
        { name: Taro.T._('My Pros'), count: 0 },
      ],
    })
  }

  componentWillReceiveProps(props) {
    const { myEval = 0, myPost = 0, votes = 0 } = props
    this.setState({
      items: [
        { name: Taro.T._('My Evaluations'), count: myEval },
        { name: Taro.T._('My Posts'), count: myPost },
        { name: Taro.T._('My Pros'), count: votes },
      ],
    })
  }

  nav = url => {
    Taro.navigateTo({ url })
  }

  render() {
    return (
      <View className="propbar">
        {this.state.items.map(item => (
          <View
            className="item"
            key={item.name}
            // onClick={this.navTo.bind(this, item.url)}
          >
            <Text className="count">{item.count}</Text>
            <Text className="name">{item.name}</Text>
          </View>
        ))}
      </View>
    )
  }
}
