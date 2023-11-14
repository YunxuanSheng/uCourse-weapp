import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import UIcon from '../UIcon/UIcon'
import './PopUp.scss'
import moment from 'moment'
import api from '../../utils/api'

export default class PopUp extends Component {
  state = {
    display: 'block',
    posters: [],
  }

  componentWillMount() {
    this.getPosters()
    const lastTime = Taro.getStorageSync('PopUpLastTime') || 0
    const currentTime = moment()
    // if (lastTime && currentTime.diff(lastTime, 'hours') < 3) {
    //   this.setState({ display: 'none' })
    // } else {
    Taro.hideTabBar()
    //   Taro.setStorageSync('PopUpLastTime', moment())
    // }
  }

  getPosters = async () => {
    const posters = await api.Posters.get()
    this.setState({ posters })
    console.log(posters)
  }

  close() {
    this.setState({ display: 'none' })
    Taro.showTabBar()
  }

  open = poster => {
    this.close()
    api.Log.post({
      type: 'ad',
      description: 'user clicked on popup',
      info: {},
    })
    Taro.navigateTo({
      url: `/subpackages/web-view-page/pages/web-view-page/web-view-page?url=${poster.url}`,
    })
  }

  render() {
    return (
      <View className="popup" style={this.state}>
        <View className="button btn-close" onClick={this.close}>
          ×
        </View>
        {this.state.posters.map(p => (
            <View>
              <View className="imageContainer" onClick={this.open.bind(this, p)}>
                <Image src={p.img}></Image>
              </View>
              <View className="button" onClick={this.open.bind(this, p)}>
                查看详情
              </View>
            </View>
          ))}
      </View>
    )
  }
}
