import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Painter from '../../../../components/Painter/Painter'
import Btn from '../../../../components/Btn/Btn'
import Login from '../../../../components/Login/Login'
// import api from '../../utils/api'
import helper from '../../../../utils/helper'
import './share.scss'

export default class Share extends Component {
  static defaultProps = {
    login: false,
  }

  state = {
    palette: {},
    trigglePainter: false,
    picUrl: '',
    isShowLoginBtn: false,
  }

  componentWillMount() {
    this.getPalette()
  }

  componentWillUnmount() {
    Taro.removeStorage({ key: 'palette' })
  }

  handleGotUserProfile = () => {
    this.getPalette()
  }

  getPalette = async () => {
    // get palette from local storage
    let palette = Taro.getStorageSync('palette')
    const isLoggedIn = helper.isLoggedIn()
    if (this.$router.params.login) {
      if (isLoggedIn) {
        // replace __SELFAVATAR__ with user's avatar
        const { avatar, nickname } = Taro.getStorageSync('userInfo')

        if (avatar) {
          palette = JSON.parse(
            JSON.stringify(palette)
              .replace(/__SELFAVATAR__/g, avatar)
              .replace(/__SELFNICKNAME__/g, nickname)
              .replace(/\n/g, '')
              .replace(/\t/g, '')
          )
        }
      } else {
        // ask for login
        this.setState({ isShowLoginBtn: true })
        return
      }
    }
    if (this.$router.params.url) {
      palette = JSON.parse(
        JSON.stringify(palette)
          .replace(/__QRCODE__/g, this.$router.params.url)
          .replace(/\n/g, '')
          .replace(/\t/g, '')
      )
    }
    this.setState({
      palette: palette,
      trigglePainter: true,
    })

    return true
  }

  handleSuccess = async ({ path }) => {
    try {
      // Taro.showLoading({ title: Taro.T._('Preparing to draw') })
      // const res = await api.Pic.upload(path)
      // Taro.hideLoading()
      // const picUrl = res.data
      this.setState({
        picUrl: path,
        trigglePainter: false,
      })
    } catch (e) {
      this.handleError(e)
    }
  }

  handleError = e => {
    Taro.hideLoading()
    Taro.showToast({ title: '不知为啥画不动……', icon: 'none' })
    console.error(e)
  }

  handleSave = async () => {
    try {
      await Taro.saveImageToPhotosAlbum({
        filePath: this.state.picUrl,
      })
      Taro.showToast({ title: Taro.T._('Saved'), icon: 'success' })
    } catch (e) {
      Taro.showToast({ title: Taro.T._('Failed'), icon: 'none' })
    }
  }

  render() {
    return (
      <View className="share-page">
        {this.state.isShowLoginBtn && (
          <Login onGotUserProfile={this.handleGotUserProfile} />
        )}

        <Navigation title={Taro.T._('Share')} />

        <View className="pic-container">
          <Image className="pic" src={this.state.picUrl} mode="widthFix" />
        </View>

        {this.state.trigglePainter && (
          <Painter
            palette={this.state.palette}
            onSuccess={this.handleSuccess}
            onError={this.handleError}
            // style="position: fixed; transform: translateY(-1000px); opacity: 0"
          />
        )}

        <View className="btn-container">
          <Btn type="primary" size="large" onClick={this.handleSave}>
            <View className="btn-text">{Taro.T._('Save the Poster')}</View>
          </Btn>
        </View>
      </View>
    )
  }
}
