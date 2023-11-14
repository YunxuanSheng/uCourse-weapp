import Taro, { Component } from '@tarojs/taro'
import { Canvas } from '@tarojs/components'
import Downloader from './lib/downloader'
import Pen from './lib/pen'

import './Painter.scss'

const downloader = new Downloader()

export default class Painter extends Component {
  static defaultProps = {
    palette: {},
    style: '',
    painterStyle: '',
    maxPaintCount: 5,
    destScale: 1,
    onSuccess: e => {
      console.log(e)
    },
    onError: e => {
      console.error(e)
    },
  }

  state = {
    canvasWidthInPx: 0,
    canvasHeightInPx: 0,
    paintCount: 0,
    screenK: 0.5,
  }

  componentWillMount() {
    this.setStringPrototype()
  }

  componentDidMount() {
    const newPalette = this.props.palette
    if (newPalette && Object.keys(newPalette).length !== 0) {
      this.setState({ paintCount: 0 })
      this.startPaint()
    }
  }

  componentWillReceiveProps(props) {
    const newPalette = props.palette
    // const oldPalette = this.props.palette
    // if (JSON.stringify(newPalette) !== JSON.stringify(oldPalette)) {
    if (newPalette && Object.keys(newPalette).length !== 0) {
      // refresh
      this.setState({ paintCount: 0 })
      this.startPaint()
    }
    // }
  }

  setStringPrototype = () => {
    /* eslint-disable no-extend-native */
    /**
     * 是否支持负数
     * @param {Boolean} minus 是否支持负数
     */
    const { screenK } = this.state
    String.prototype.toPx = function toPx(minus) {
      let reg
      if (minus) {
        reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g
      } else {
        reg = /^[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g
      }
      const results = reg.exec(this)
      if (!this || !results) {
        console.error(`The size: ${this} is illegal`)
        return 0
      }
      const unit = results[2]
      const value = parseFloat(this)

      let res = 0
      if (unit === 'rpx') {
        res = Math.round(value * screenK)
      } else if (unit === 'px') {
        res = value
      }
      return res
    }
    String.prototype.toRpx = function(minus) {
      let reg
      if (minus) {
        reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g
      } else {
        reg = /^[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g
      }
      const results = reg.exec(this)
      if (!this || !results) {
        console.error(`The size: ${this} is illegal`)
        return 0
      }
      const unit = results[2]
      const value = parseFloat(this)

      let res = 0
      if (unit === 'rpx') {
        res = Math.round(value)
      } else if (unit === 'px') {
        res = Math.round(value / screenK)
      }
      return res
    }
  }

  startPaint = async () => {
    console.log('paint')
    if (!Taro.systemInfo) {
      // init systemInfo
      try {
        Taro.systemInfo = await Taro.getSystemInfo()
        wx.systemInfo = Taro.systemInfo
      } catch (e) {
        const error = `Painter get system info failed, ${JSON.stringify(e)}`
        console.error(error)
        this.props.onError({ error })
        return
      }
    }

    this.setState({ screenK: Taro.systemInfo.screenWidth / 750 }, () => {
      this.downloadImages().then(palette => {
        const { width, height } = palette
        this.setState({
          canvasWidthInPx: width.toPx(),
          canvasHeightInPx: height.toPx(),
        })

        if (!width || !height) {
          console.error(
            `You should set width and height correctly for painter, width: ${width}, height: ${height}`,
          )
          return
        }
        this.setState({
          painterStyle: `width:${width};height:${height};`,
        })
        const ctx = Taro.createCanvasContext('canvas', this.$scope)
        const pen = new Pen(ctx, palette)
        pen.paint(() => {
          this.saveImgToLocal()
        })
      })
    })
  }

  downloadImages = () => {
    return new Promise(resolve => {
      let preCount = 0
      let completeCount = 0
      const paletteCopy = JSON.parse(JSON.stringify(this.props.palette))
      if (paletteCopy.background) {
        preCount++
        downloader.download(paletteCopy.background).then(
          path => {
            paletteCopy.background = path
            completeCount++
            if (preCount === completeCount) {
              resolve(paletteCopy)
            }
          },
          () => {
            completeCount++
            if (preCount === completeCount) {
              resolve(paletteCopy)
            }
          },
        )
      }
      if (paletteCopy.views) {
        for (const view of paletteCopy.views) {
          if (view && view.type === 'image' && view.url) {
            preCount++
            /* eslint-disable no-loop-func */
            downloader.download(view.url).then(
              async path => {
                view.url = path
                try {
                  const res = await Taro.getImageInfo({ src: view.url })
                  view.sWidth = res.width
                  view.sHeight = res.height
                } catch (e) {
                  // 如果图片坏了，则直接置空，防止坑爹的 canvas 画崩溃了
                  view.url = ''
                  console.error(
                    `getImageInfo ${view.url} failed, ${JSON.stringify(error)}`,
                  )
                } finally {
                  completeCount++
                  if (preCount === completeCount) {
                    resolve(paletteCopy)
                  }
                }
              },
              () => {
                completeCount++
                if (preCount === completeCount) {
                  resolve(paletteCopy)
                }
              },
            )
          }
        }
      }
      if (preCount === 0) {
        resolve(paletteCopy)
      }
    })
  }

  saveImgToLocal = () => {
    setTimeout(async () => {
      try {
        wx.canvasToTempFilePath(
          {
            canvasId: 'canvas',
            destWidth: this.state.canvasWidthInPx * this.state.scale,
            destHeight: this.state.canvasHeightInPx * this.state.scale,
            success: res => {
              console.log(res)
              this.getImageInfo(res.tempFilePath)
            },
            fail: e => {
              throw e
            },
          },
          this.$scope,
        )
        // FIXME: https://github.com/NervJS/taro/issues/420
        // const res = await Taro.canvasToTempFilePath(
        //   { canvasId: 'canvas' },
        //   this.$scope,
        // )
        // this.getImageInfo(res.tempFilePath)
      } catch (e) {
        const error = `canvasToTempFilePath failed, ${JSON.stringify(e)}`
        console.error(error)
        this.props.onError({ error })
      }
    }, 1000)
  }

  getImageInfo = async filePath => {
    try {
      const res = await Taro.getImageInfo({ src: filePath })
      if (this.state.paintCount > this.props.maxPaintCount) {
        const error = `The result is always fault, even we tried ${
          this.props.maxPaintCount
        } times`
        console.error(error)
        this.props.onError({ error })
        return
      }
      // 比例相符时才证明绘制成功，否则进行强制重绘制
      if (
        Math.abs(
          (res.width * this.state.canvasHeightInPx -
            this.state.canvasWidthInPx * res.height) /
            (res.height * this.state.canvasHeightInPx),
        ) < 0.01
      ) {
        this.props.onSuccess({ path: filePath })
      } else {
        this.startPaint()
      }
      this.setState(prevState => ({ paintCount: ++prevState.paintCount }))
    } catch (e) {
      const error = `getImageInfo failed, ${JSON.stringify(e)}`
      console.error(error)
      this.props.onError({ error })
    }
  }

  render() {
    return (
      <Canvas
        canvasId="canvas"
        style={`${this.props.style} ${this.state.painterStyle}`}
      />
    )
  }
}
