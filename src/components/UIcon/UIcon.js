import Taro, { Component } from '@tarojs/taro'
import classnames from 'classnames'
import { View } from '@tarojs/components'
import './UIcon.scss'

export default class UIcon extends Component {
  static options = {
    addGlobalClass: true,
  }

  static externalClasses = ['icon-class']

  static defaultProps = {
    icon: '',
    className: '',
  }

  render() {
    return (
      <View
        className={classnames(
          'icon-class',
          'u-icon',
          `u-icon-${this.props.icon}`,
          `${this.props.className}`
        )}
      />
    )
  }
}
