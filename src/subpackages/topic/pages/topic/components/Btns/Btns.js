import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../../../../../components/UIcon/UIcon'
import Avatar from '../../../../../../components/Avatar/Avatar'
import palette from '../palette'
import api from '../../../../../../utils/api'
import './Btns.scss'

export default class Btns extends Component {
  static defualtProps = {
    topicId: null,
    topicInfo: {},
  }

  state = {
    avatar: '',
  }

  componentWillMount() {
    const { avatar } = Taro.getStorageSync('userInfo')
    if (avatar) {
      this.setState({ avatar })
    }
  }

  navTo = url => {
    Taro.navigateTo({ url })
  }

  showTextarea = () => {
    Taro.eventCenter.trigger('showTextarea')
  }

  handleShare = async () => {
    Taro.showLoading({ title: Taro.T._('Loading') })
    const url = await api.Qr.get({
      page: 'pages/topic/topic',
      scene: this.props.topicId,
      auto_color: true,
    })
    console.log(url)
    const { avatar, nickname } = Taro.getStorageSync('userInfo')
    const { description } = this.props.topicInfo
    const replaced = JSON.stringify(palette)
      .replace('__QRCODE__', url)
      .replace('__AVATAR__', avatar)
      .replace('__NICKNAME__', nickname)
      .replace('__BODYTEXT__', description)
      .replace(/\r?\n|\r/g, '')
      .replace(/\t/g, '')
    const newPalette = JSON.parse(replaced)

    Taro.setStorageSync('palette', newPalette)
    Taro.hideLoading()
    Taro.navigateTo({ url: '/subpackages/share/pages/share/share' })
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

        <View
          onClick={this.navTo.bind(
            this,
            '/subpackages/topic/pages/topic-new-course/topic-new-course?topicId=' +
              this.props.topicId
          )}
        >
          <UIcon icon-class="func-icon" icon="addition" />
        </View>
        {/* <View onClick={this.handleOrderChange}>
          <UIcon icon-class="func-icon" icon="message" />
        </View> */}
        <View onClick={this.handleShare}>
          <UIcon icon-class="func-icon" icon="share" />
        </View>
      </View>
    )
  }
}
