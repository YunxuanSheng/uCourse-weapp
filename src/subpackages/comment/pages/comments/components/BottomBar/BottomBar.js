import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Avatar from '../../../../../../components/Avatar/Avatar'
import UIcon from '../../../../../../components/UIcon/UIcon'
import './BottomBar.scss'

const orderRange = ['like_count', 'created_at']

export default class BottomBar extends Component {
  static defaultProps = {
    onOrderChange: () => {},
  }

  state = {
    orderBy: 'like_count',
  }

  componentDidMount() {
    const { avatar } = Taro.getStorageSync('userInfo')
    if (avatar) {
      this.setState({ avatar })
    }
  }

  showTextarea = () => {
    Taro.eventCenter.trigger('showTextarea', this.props.params)
  }

  handleOrderChange = () => {
    const { orderBy } = this.state
    const newOrder = orderRange[1 - orderRange.indexOf(orderBy)]
    if (newOrder === 'like_count') {
      Taro.showToast({
        title: Taro.T._('Sort by hottest comment'),
        icon: 'none',
      })
    } else {
      Taro.showToast({
        title: Taro.T._('Sort by latest comment'),
        icon: 'none',
      })
    }
    this.setState({ orderBy: newOrder })
    this.props.onOrderChange(newOrder)
  }

  render() {
    return (
      <View className="comment-bar">
        <View className="avatar">
          <Avatar src={this.state.avatar} size={60} />
        </View>
        <View className="input-area" onClick={this.showTextarea}>
          {Taro.T._('Post a comment')}
        </View>
        {/* <UIcon icon-class='send-icon' icon='enterinto' /> */}
        <View onClick={this.handleOrderChange}>
          <UIcon
            icon-class="order-icon"
            icon={this.state.orderBy === 'like_count' ? 'dynamic' : 'order'}
          />
        </View>
      </View>
    )
  }
}
