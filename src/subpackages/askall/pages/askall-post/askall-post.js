import Taro, { Component } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import api from '../../../../utils/api'
import Navigation from '../../../../components/Navigation/Navigation'
import './askall-post.scss'

export default class AskallPost extends Component {
  state = {
    content: undefined,
    contentLen: 0,
  }
  handleInputCode = e => {
    const content = e.detail.value
    const contentLen = content.length.toLocaleString()
    this.setState({ content, contentLen })
  }
  handleSubmit = async () => {
    const body = {
      content: this.state.content,
    }
    const { confirm } = await Taro.showModal({
      title: Taro.T._('Confirm the publishing'),
      content: Taro.T._('Once published, the question can only be edited but cannot be deleted.'),
      confirmText: Taro.T._('Publish'),
      confirmColor: '#FF9800',
    })

    if (!confirm) {
      return
    }

    Taro.showLoading({ title: Taro.T._('Publishing'), mask: true })
    const res = await api.CourseQA.create(this.$router.params.course_code, body)
    Taro.hideLoading()
    if (res.content !== undefined) {
      Taro.showToast({
        title: Taro.T._('Published'),
        icon: 'success',
        mask: true,
        duration: 1500,
      })
      //201: success
      this.timer = setTimeout(() => {
        Taro.redirectTo({
          url: `/subpackages/askall/pages/askall/askall?id=${this.$router.params.course_code}&title=${this.$router.params.course_title}`,
        })
      }, 1500)
    }
  }
  render() {
    return (
      <View className="askall-post-page">
        <Navigation align="left">
          <View>{this.$router.params.course_title}</View>
        </Navigation>
        <View className="card-container">
          <View className="card-title">{Taro.T._('Ask something')}</View>
          <View className="card-body">
            <View className="content-container">
              <Textarea
                value={this.state.content}
                className="textarea"
                placeholder={Taro.T._('Ask something about the teaching quality, learning experience or exam issues!')}
                maxlength={200}
                onInput={this.handleInputCode}
                autoHeight
              />
              <View className="word-count">
                {this.state.contentLen.toLocaleString()} / 200
              </View>
            </View>
          </View>
        </View>
        <View className="submit" onClick={this.handleSubmit}>
          {Taro.T._('Publish')}
        </View>
      </View>
    )
  }
}
