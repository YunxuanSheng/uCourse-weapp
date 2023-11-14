import Taro, { Component } from '@tarojs/taro'
import { Ad } from '@tarojs/components'

export default class UAd extends Component {
  static defaultProps = {
    unitId: 'adunit-2c06fbbc2f853526',
  }

  render() {
    return <Ad unitId={this.props.unitId} />
  }
}
