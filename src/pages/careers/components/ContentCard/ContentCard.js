import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../../../components/UIcon/UIcon'
import time from '../../../../utils/time'
import api from '../../../../utils/api'
import './ContentCard.scss'

export default class ContentCard extends Component {
  state = {
    isLiked: false,
  }

  componentWillMount = async () => {
    try {
      let liked = Taro.getStorageSync('careers.liked') || []
      if (this.props.post._id in liked) {
        this.setState({ isLiked: true })
      }
    } catch (e) {
      console.log(e)
    }
  }

  likePost = async () => {
    if (!this.state.isLiked)
      this.setState({ isLiked: true }, async () => {
        // add to storage
        try {
          let liked = Taro.getStorageSync('careers.liked') || []
          if (!this.props.post._id in liked) {
            liked.push(this.props.post._id)
          }
          Taro.setStorageSync('careers.liked', liked)
        } catch (e) {
          console.log(e)
        }

        // update
        const res = await api.Careers.like(this.props.post._id)
      })
  }

  viewPost = async () => {
    const url = this.props.post.url
    if (url.startsWith('cmarticle://'))
      Taro.navigateTo({ url: `/pages/careers/cmarticle?url=${url}` })
    else
      Taro.navigateTo({
        url: `/subpackages/web-view-page/pages/web-view-page/web-view-page?url=${url}`,
      })
    const res = await api.Careers.view(this.props.post._id)
  }

  render() {
    return (
      <View className="content">
        <View className="content-head">
          <View className="content-head-tags">
            {this.props.post.tags.map((tag, i) => (
              <View
                className="content-head-tag"
                key={tag.title + i}
                style={{ backgroundColor: tag.color }}
              >
                {tag.title}
              </View>
            ))}
          </View>
          <View className="content-head-time">
            {time.fromNow(this.props.post.createdAt)}
          </View>
        </View>
        <View className="content-body" onClick={this.viewPost}>
          <View className="content-body-title">{this.props.post.title}</View>
          <View className="content-body-inner">{this.props.post.content}</View>
        </View>
        <View className="content-foot">
          <View className="content-foot-left">
            浏览量: {this.props.post.views}
          </View>
          <View
            className="content-foot-right"
            onClick={this.likePost.bind(this)}
          >
            <UIcon icon="like"></UIcon>
            {this.props.post.likes + this.state.isLiked}
          </View>
        </View>
        <View
          className="content-provider"
          style={{ color: this.props.post.providerColor }}
        >
          <img src={this.props.post.provierIcon}></img>
          <View className="content-provider-name">
            {this.props.post.providerName}
          </View>
        </View>
      </View>
    )
  }
}
