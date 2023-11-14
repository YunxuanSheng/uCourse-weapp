import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker } from '@tarojs/components'

import { majorData as dataSource } from '../../utils/data'

import './Search.scss'

const schools = ['所有学院', ...dataSource.map(d => d.school), 'UNNC']
const levels = ['大一', '大二', '大三', '大四', '研究生', '其他']

export default class Search extends Component {
  static defaultProps = {
    placeholder: Taro.T._('Search'),
    onSearch: () => {},
  }

  state = {
    level: undefined,
    params: {},
  }

  handleInput = e => {
    const { value } = e.detail
    this.setState(prevState => ({
      params: {
        ...prevState.params,
        q: value,
      },
    }))
  }

  handleConfirm = () => {
    this.props.onSearch(this.state.params)
  }

  handleSchoolChange = e => {
    const index = parseInt(e.detail.value, 10)
    const schoolCode = schools[index]
    this.setState(
      prevState => ({
        params: {
          ...prevState.params,
          schoolCode:
            schoolCode === 'UNNC'
              ? 'UNNC'
              : schoolCode === schools[0]
                ? ''
                : `CSC-${schoolCode}`,
        },
      }),
      () => {
        this.props.onSearch(this.state.params)
      },
    )
  }

  handleLevelChange = e => {
    const level = parseInt(e.detail.value, 10)
    this.setState({ level })
    if (level === 0) {
      // CELE
      this.setState(
        prevState => ({
          params: {
            ...prevState.params,
            level,
            schoolCode: 'CELE',
          },
        }),
        () => {
          this.props.onSearch(this.state.params)
        },
      )
    } else if (level === 5) {
      // 其他
      this.setState(
        prevState => ({
          params: {
            ...prevState.params,
            level: 'X',
          },
        }),
        () => {
          this.props.onSearch(this.state.params)
        },
      )
    } else {
      this.setState(
        prevState => ({
          params: {
            ...prevState.params,
            level,
          },
        }),
        () => {
          this.props.onSearch(this.state.params)
        },
      )
    }
  }

  render() {
    const schoolCode = this.state.params.schoolCode
      ? this.state.params.schoolCode.replace('CSC-', '')
      : '院'
    return (
      <View className="search-comp">
        <View className="input-container">
          <Input
            className="input"
            placeholder={this.props.placeholder}
            confirmType="search"
            onInput={this.handleInput}
            onConfirm={this.handleConfirm}
          />
        </View>
        <Picker
          mode="selector"
          range={schools}
          onChange={this.handleSchoolChange}
        >
          <View className="selector">{schoolCode || '院'}</View>
        </Picker>
        <Picker
          mode="selector"
          range={levels}
          onChange={this.handleLevelChange}
        >
          <View className="selector selector-last">
            {levels[this.state.level] || '级'}
          </View>
        </Picker>
      </View>
    )
  }
}
