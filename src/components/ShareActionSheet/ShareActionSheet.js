import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
// import Btn from '../Btn/Btn'
import UIcon from '../UIcon/UIcon'
import SharePoster from '../SharePoster/SharePoster'
import './ShareActionSheet.scss'

export default class ShareActionSheet extends Component {
  static defaultProps = {
    show: false,
    palette: {},
    onClose: () => {},
    onAskForPalette: () => {},
    onPosterSuccess: () => {},
  }

  state = {
    drawPoster: false,
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  componentWillReceiveProps(props) {
    if (JSON.stringify(props.palette) === JSON.stringify(this.props.palette)) {
      return
    }

    if (props.palette && Object.keys(props.palette).length !== 0) {
      this.setState({ drawPoster: true })
      this.timer = setTimeout(() => {
        Taro.hideLoading()
        // Taro.showToast({ title: '画了太久…哪里出问题了', icon: 'none' })
        this.setState({ drawPoster: false })
      }, 8000)
    }
  }

  handleHide = () => {
    this.props.onClose()
  }

  showPoster = async () => {
    this.props.onAskForPalette()
  }

  handlePosterSuccess = () => {
    this.props.onPosterSuccess()
    this.setState({ drawPoster: false })
  }

  render() {
    return (
      <View
        className={`share-action-sheet-comp ${
          this.props.show ? 'show' : 'hide'
        }`}
        onClick={this.handleHide}
      >
        {this.state.drawPoster && (
          // <View style={{ display: 'none' }}>
          <SharePoster
            palette={this.props.palette}
            onSuccess={this.handlePosterSuccess}
          />
          // </View>
        )}

        <View className="mask" />
        <View className="action-sheet">
          <View className="btns">
            <Button className="btn" openType="share">
              <UIcon icon-class="wechat-icon" icon="wechat" />
              <View className="text">{Taro.T._('Share to friends')}</View>
            </Button>
            <Button className="btn" onClick={this.showPoster}>
              <UIcon icon-class="moment-icon" icon="moment" />
              <View className="text">{Taro.T._('Share to moments')}</View>
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
