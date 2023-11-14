import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import Btn from '../Btn/Btn'
import './Abnor.scss'

export default class Abnor extends Component {
  state = {
    imgUrl_state: '',
    width: 200,
    // height: 200,
  }

  static defaultProps = {
    type: '',
    title: '糟糕，好像哪里出错了……',
    gray: false,
    btnText: '',
    url: '',
  }

  componentDidMount() {
    this.updateImage(this.props.type, this.props.imgUrl)
  }

  componentWillReceiveProps(props) {
    this.updateImage(props.type, props.imgUrl)
  }

  updateImage = (type, imgUrl) => {
    let url, width
    switch (type) {
      case 'BOOKS':
        url = 'https://i.loli.net/2018/06/30/5b3667552e481.png'
        width = 200
        break
      case 'NETWORK':
        url =
          'https://s10.mogucdn.com/p2/161213/upload_3bd517df2kgkclkhgl71bg4b37dcc_514x260.png'
        width = 550
        break
      case 'NOT FOUND':
        url =
          'https://s8.mogucdn.com/pic/150112/17y7h4_ieydcyjsha2dgndcmuytambqgiyde_410x354.png'
        width = 550
        break
      case 'MESSAGE':
        url =
          'https://s10.mogucdn.com/p2/161213/upload_21f4ij449lb4h67k0afjic82d0f31_514x260.png'
        width = 550
        break
      default:
        url = imgUrl
    }
    this.setState({ imgUrl_state: url, width })
  }

  navTo = () => {
    Taro.navigateTo({ url: this.props.url })
  }

  render() {
    return (
      <View className="abnor-container">
        <Image
          className={`image ${this.props.gray ? 'image-gray' : ''}`}
          // style={{
          //   width: this.state.width,
          // }}
          style={`width: ${this.state.width}rpx`}
          src={this.state.imgUrl_state}
          mode="widthFix"
        />
        <View className="title">{this.props.title}</View>
        {this.props.btnText && (
          <View className="btn">
            <Btn type="primary" size="meduim" onClick={this.navTo}>
              {this.props.btnText}
            </Btn>
          </View>
        )}
      </View>
    )
  }
}
