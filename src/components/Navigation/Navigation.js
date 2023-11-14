import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../UIcon/UIcon'
import './Navigation.scss'

export default class Navigation extends Component {
  static defaultProps = {
    mode: 'normal', // 'normal', 'transparent', 'frost'
    align: 'center', // 'center', 'left'
    borderless: false,
    title: '',
    capsuleRight: false,
    onNavBack: null,
  }

  state = {
    statusBarHeight: Taro.systemInfo ? Taro.systemInfo.statusBarHeight : 0,
    hasBackBtn: false,
    hasHomeBtn: false,
  }

  async componentWillMount() {
    const pages = Taro.getCurrentPages()
    const isHomePage = [
      'pages/index/index',
      'pages/me/me',
      'pages/schools/schools',
      'pages/timetable/timetable',
    ].some(r => r === pages[0].route)
    if (pages.length > 1) {
      this.setState({ hasBackBtn: true })
    } else if (!isHomePage) {
      this.setState({ hasHomeBtn: true })
    }
    if (!Taro.systemInfo) {
      Taro.systemInfo = await Taro.getSystemInfo()
    }
    const { statusBarHeight } = Taro.systemInfo
    this.setState({ statusBarHeight })
  }

  async componentDidMount() {}

  navBack = () => {
    this.props.onNavBack ? this.props.onNavBack() : Taro.navigateBack()
  }

  navHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  render() {
    const navStyle =
      this.props.mode === 'normal'
        ? `height: ${this.state.statusBarHeight + 46}px`
        : ''

    return (
      <View className="navigation" style={navStyle}>
        <View
          className={`bar bar-${this.props.mode} ${
            this.props.borderless ? 'bar-borderless' : ''
          }`}
          style={`height: ${this.state.statusBarHeight + 46}px`}
        >
          <View
            className="status-bar"
            style={`height: ${this.state.statusBarHeight}px`}
          />
          <View className="nav-bar">
            {this.state.hasBackBtn && (
              <View className="left" onClick={this.navBack}>
                <UIcon icon-class="backBtn" icon="return" />
              </View>
            )}
            {this.state.hasHomeBtn && (
              <View className="left" onClick={this.navHome}>
                <UIcon icon-class="backBtn" icon="home-o" />
              </View>
            )}
            {!this.state.hasBackBtn &&
              this.props.align === 'left' && <View className="left-margin" />}

            <View className={`center align-${this.props.align}`}>
              {this.props.title || this.props.children}
            </View>

            {(this.state.hasBackBtn || this.state.hasHomeBtn) && (
              <View
                className="right"
                style={{ marginRight: this.props.capsuleRight ? '70px' : '' }}
              />
            )}
          </View>
        </View>
      </View>
    )
  }
}
