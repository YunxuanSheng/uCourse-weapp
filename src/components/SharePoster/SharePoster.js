import Taro, { Component } from '@tarojs/taro'
import Painter from '../Painter/Painter'

export default class SharePoster extends Component {
  static defaultProps = {
    palette: {},
    onSuccess: () => {},
  }

  componentDidMount() {
    Taro.showLoading({
      title: '拼命画海报',
      mask: true,
    })
  }

  handleSuccess = ({ path }) => {
    Taro.hideLoading()
    Taro.previewImage({ urls: [path] })
    this.props.onSuccess()
  }

  handleError = e => {
    Taro.hideLoading()
    Taro.showToast({ title: '不知为啥画不动……请反馈 bug', icon: 'none' })
    console.error(e)
  }

  render() {
    return (
      <Painter
        palette={this.props.palette}
        onSuccess={this.handleSuccess}
        onError={this.handleError}
        // style={{ position: 'fixed', left: '-1000rpx' }}
      />
    )
  }
}
