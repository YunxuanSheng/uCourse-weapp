import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

import './Rate.scss'

export default class Rate extends Component {
  state = {
    pageX: 0,
    value: 0,
  }

  static defaultProps = {
    count: 5,
    max: 10,
    defaultValue: 0,
    value: 0,
    disabled: false,
    name: '',
    size: 40, // rpx
    showText: false,
    onChange: () => {},
  }

  componentWillMount() {
    if (!this.props.disabled) {
      this.initPos()
    }
    this.updateValue(this.props)
  }

  componentWillReceiveProps(props) {
    this.updateValue(props)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  initPos = () => {
    // const query = Taro.createSelectorQuery().in(this.$scope)
    this.timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .in(this.$scope)
        .select('.rate-comp')
        .boundingClientRect(res => {
          this.setState({ pageX: res.left || 0 })
        })
        .exec()
    }, 1000)
  }

  updateValue = props => {
    const value = props.value || props.defaultValue
    this.setState({
      value: parseInt(parseFloat(value).toFixed(), 10),
    })
  }

  handleTouchMove = e => {
    if (this.props.disabled || !e.changedTouches[0]) {
      return
    }
    const movePageX = e.changedTouches[0].pageX
    const space = movePageX - this.state.pageX

    if (space <= 0) {
      return
    }

    let setIndex = Math.ceil(
      space / (this.props.size / 2 / (this.props.max / this.props.count)),
    )

    setIndex = setIndex > this.props.max ? this.props.max : setIndex
    if (setIndex !== this.state.value) {
      this.setState({ value: setIndex })
      this.props.onChange(setIndex)
    }
  }

  handleClick = i => {
    if (this.props.disabled) {
      return
    }
    const value = (i + 1) * 2
    this.setState({ value })
    this.props.onChange(value)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.pageX === this.state.pageX &&
      nextState.value === this.state.value
    ) {
      return false
    }
  }

  render() {
    return (
      <View
        className="rate-comp"
        onTouchMove={this.handleTouchMove}
        style={`font-size: ${this.props.size}rpx`}
      >
        <Input
          // type='digit'
          name={this.props.name}
          value={this.state.value}
          className="hide-input"
        />
        {[...Array(this.props.count).keys()].map((star, i) => (
          <View
            key={star}
            className={`star ${(i + 1) * 2 <= this.state.value ? 'full' : ''} ${
              (i + 1) * 2 - 1 === this.state.value ? 'half' : ''
            }`}
            onClick={this.handleClick.bind(this, i)}
          >
            <View className="u-icon u-icon-collection" />
          </View>
        ))}

        {this.props.showText && (
          <View class="text">{`${this.state.value} ${Taro.T._('pts')}`}</View>
        )}
      </View>
    )
  }
}
