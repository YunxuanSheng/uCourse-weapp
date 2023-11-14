import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../../../../../components/UIcon/UIcon'
import api from '../../../../../../utils/api'
import './EvalTempList.scss'

export default class EvalTempList extends Component {
  state = {
    count: 0,
    rows: [],
    isCollapsed: true,
  }

  static defaultProps = {
    code: '',
  }

  componentDidMount() {
    this.fetchDataSource()
  }

  fetchDataSource = async () => {
    // FIXME: https://github.com/NervJS/taro/issues/389#issuecomment-411891845
    const { code } = Taro.getCurrentPages()[
      Taro.getCurrentPages().length - 1
    ].$component.$router.params
    const { count, rows } = await api.Evals.getTemps({ courseCode: code })
    this.setState({ count, rows })
  }

  promptHint = () => {
    Taro.showModal({
      title: Taro.T._('Evaluations gathered from Testing Phase'),
      content: Taro.T._(
        'We gathered these evaluations through questionnaires in our testing phase.'
      ),
      showCancel: false,
      confirmColor: '#ff9800',
      confirmText: Taro.T._('OK'),
    })
  }

  navToEvalTemp = id => {
    Taro.navigateTo({
      url: `/subpackages/eval/pages/eval-temp/eval-temp?id=${id}`,
    })
  }

  handleCollapse = () => {
    this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }))
  }

  render() {
    return (
      <View>
        {this.state.rows.length > 0 && (
          <View className="eval-list-container">
            <View className="header">
              <View onClick={this.promptHint}>
                {`${this.state.count.toLocaleString()} ${Taro.T._(
                  'Evaluations from Testing Phase'
                )}`}
                <UIcon icon="prompt" />
              </View>
              <View onClick={this.handleCollapse}>
                {this.state.isCollapsed
                  ? Taro.T._('Expand')
                  : Taro.T._('Collapse')}
              </View>
            </View>

            <View className={`body ${this.state.isCollapsed ? 'hidden' : ''}`}>
              {this.state.rows.map(row => {
                return (
                  <View
                    className="eval-container"
                    key={row.id}
                    onClick={this.navToEvalTemp.bind(this, row.id)}
                  >
                    <View className="eval-container-header">
                      <View className="eval-container-header-left">
                        <View className="nickname">
                          {`${Taro.T._('Author')}: ${row.nickname}`}
                        </View>
                      </View>
                    </View>
                    <View className="content">{row.content_short}</View>
                  </View>
                )
              })}
            </View>
          </View>
        )}
      </View>
    )
  }
}
