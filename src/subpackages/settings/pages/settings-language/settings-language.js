import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Btn from '../../../../components/Btn/Btn'

import './settings-language.scss'

const languages = {
  en: 'English',
  zh_CN: '简体中文',
  zh_TW: '繁體中文（台灣）',
  zh_HK: '繁體中文（香港）',
}

export default class SettingsLanguage extends Component {
  state = {
    currentLang: '',
  }

  componentWillMount() {
    const locale = Taro.getStorageSync('locale')
    this.setState({
      currentLang: languages[locale],
    })
  }

  handleLanguageChange = e => {
    const index = parseInt(e.detail.value, 10)
    const locale = Object.keys(languages)[index]
    this.setState({
      currentLang: languages[locale],
    })
  }

  handleSave = () => {
    const locale = Object.keys(languages).find(
      key => languages[key] === this.state.currentLang,
    )
    Taro.setStorageSync('locale', locale)
    Taro.T.setLocale(locale)
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  render() {
    return (
      <View className="settings-language-page">
        <Navigation title={Taro.T._('Language')} />

        <View className="gap" />

        <Picker
          mode="selector"
          range={Object.values(languages)}
          onChange={this.handleLanguageChange}
        >
          <View className="list-item">
            <View className="name">{this.state.currentLang}</View>
          </View>
        </Picker>

        <View className="gap" />

        <Btn
          type="primary"
          size="long"
          text={Taro.T._('Save')}
          onClick={this.handleSave}
        />
      </View>
    )
  }
}
