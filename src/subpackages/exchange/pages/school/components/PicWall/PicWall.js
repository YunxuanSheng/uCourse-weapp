import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'

import './PicWall.scss'

export default class PicWall extends Component {
  static defaultProps = {
    imgList: [],
  }

  handleImgClick = img => {
    Taro.previewImage({
      current: img,
      urls: this.props.imgList,
    })
  }

  render() {
    return (
      <View className="pic-wall">
        <Swiper
          className="banner"
          indicatorDots
          indicatorActiveColor="#FF9800"
          autoplay
          circular
        >
          {this.props.imgList.length > 0 ? (
            this.props.imgList.map(img => (
              <SwiperItem key={img}>
                <Image
                  src={img}
                  className="slide-image"
                  mode="aspectFill"
                  onClick={this.handleImgClick.bind(this, img)}
                />
              </SwiperItem>
            ))
          ) : (
            <SwiperItem>
              <Image
                src="https://i.loli.net/2018/10/28/5bd5c49ca2ea5.jpg"
                className="slide-image"
                mode="aspectFill"
              />
            </SwiperItem>
          )}
        </Swiper>
      </View>
    )
  }
}
