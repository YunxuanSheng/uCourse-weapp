import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'

import api from '../../../../utils/api'

import './eval-temp.scss'

export default class EvalTemp extends Component {
  state = {
    theEval: {},
  }

  config = {
    usingComponents: {
      wemark: '../../../../components/third-party/wemark/wemark',
    },
  }

  componentWillMount() {
    this.fetchEval()
  }

  fetchEval = async () => {
    const { id } = this.$router.params
    const { nickname, content } = await api.Evals.retrieveTemp(id)
    this.setState({ theEval: { nickname, content } })
  }

  render() {
    return (
      <View className="eval-page">
        <Navigation align="left" title={Taro.T._('Details')} />

        <View className="card">
          <View className="nickname">{this.state.theEval.nickname}</View>

          <View className="content">
            <wemark
              md={this.state.theEval.content}
              link
              highlight
              type="wemark"
            />
          </View>
        </View>
      </View>
    )
  }
}
