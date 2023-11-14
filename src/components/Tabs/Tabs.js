import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './Tabs.scss'

export default class Tabs extends Component {
  state = {
    activeIndex: 0,
  }

  static defaultProps = {
    tabs: ['A', 'B', 'C'],
    onChange: () => {},
  }

  handleChangeTab = i => {
    this.setState({ activeIndex: i })
    this.props.onChange(i)
  }

  render() {
    return (
      <View className="tabs-container">
        {this.props.tabs.map((t, i) => (
          <View
            className={`tab ${this.state.activeIndex === i ? 'active' : ''}`}
            key={t}
            onClick={this.handleChangeTab.bind(this, i)}
          >
            <Text>{t}</Text>
          </View>
        ))}
      </View>
    )
  }
}
