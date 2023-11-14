import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'

import api from '../../../../utils/api'

import './Banner.scss'

export default class Banner extends Component {
  state = {
    banners: [],
  }

  componentWillMount() {
    this.getBanners()
  }

  navTo = item => {
    // Taro.navigateTo({ url: `${item.url}&type=${item.type}` })
    api.Log.post({
      type: 'ad',
      description: 'user clicked on banner',
      info: {
        ...item,
      },
    })
    Taro.navigateTo({
      url: `/subpackages/web-view-page/pages/web-view-page/web-view-page?url=${item.url}`,
    })
  }

  getBanners = async () => {
    const banners = await api.Banners.get()
    this.setState({ banners })
  }

  render() {
    return (
      <View className="banner-comp">
        <Swiper
          className="banner"
          indicatorDots
          indicatorActiveColor="#FF9800"
          autoplay
          circular
        >
          {this.state.banners.length > 0 ? (
            this.state.banners.map(b => (
              <SwiperItem key={b.img}>
                <Image
                  src={b.img}
                  className="slide-image"
                  mode="widthFix"
                  onClick={this.navTo.bind(this, b)}
                />
              </SwiperItem>
            ))
          ) : (
            <SwiperItem>
              <Image
                // src="https://ufair.oss-cn-hangzhou.aliyuncs.com/img/2021_default_banner.webp"
                src="https://s1.ax1x.com/2022/07/29/vPIH58.jpg"
                className="slide-image"
                mode="widthFix"
              />
            </SwiperItem>
          )}
        </Swiper>
      </View>
    )
  }
}
