import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../components/Navigation/Navigation'
import api from '../../utils/api'
import './cmarticle.scss'

export default class HintMd extends Component {
  state = {
    title: "",
    content: "",
  }

  config = {
    usingComponents: {
      wemark: '../../components/third-party/wemark/wemark',
    },
  }

  componentWillMount = async () => {
    const { url } = this.$router.params
    const res = await api.Careers.getArticle(url.replace("cmarticle://", ""))
    this.setState({ title: res.title, content: res.content })
  }

  render() {
    return (
      <View className="hint-md-page">
        <Navigation title={this.state.title} />
        <View className="content">
          <wemark md={this.state.content} link highlight type="wemark" />
        </View>
      </View>
    )
  }
}
