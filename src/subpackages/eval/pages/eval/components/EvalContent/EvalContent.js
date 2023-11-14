import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import showdown from '../../../../../../utils/showdown'
import Avatar from '../../../../../../components/Avatar/Avatar'
import UIcon from '../../../../../../components/UIcon/UIcon'
import Rate from '../../../../../../components/Rate/Rate'
import Badge from '../../../../../../components/Badge/Badge'
import helper from '../../../../../../utils/helper'
import time from '../../../../../../utils/time'
import translate from '../../../../../../utils/translate'
import { html2markdown } from '../../../../../../utils/html2json'
import './EvalContent.scss'
import CensorshipHint from '../../../../../../components/CensorshipHint/CensorshipHint'

export default class EvalContent extends Component {
  state = {
    content: '',
    contentTrans: '',
    showTrans: false,
  }

  static defaultProps = {
    theEval: {},
    author: {},
  }

  config = {
    usingComponents: {
      wemark: '../../../../../../components/third-party/wemark/wemark',
    },
  }

  componentWillMount() {
    this.init(this.props)
    Taro.eventCenter.on('showTrans', () => {
      this.handleTrans()
    })
  }

  componentWillReceiveProps(props) {
    this.init(props)
  }

  componentWillUnmount() {
    Taro.eventCenter.off('showTrans')
  }

  init = props => {
    const { content } = props.theEval
    if (content) {
      this.beautifyContent(content)
    }
  }

  beautifyContent = content => {
    // replace soft break line
    content = content.replace(/\r?\n|\r/g, '  \n')

    this.setState({ content })
  }

  translateContent = async content => {
    Taro.showLoading({ title: Taro.T._('Translating'), mask: true })
    // regonizeLang
    try {
      const lang = await translate(content).then(res => res.from.language.iso)
      // lang: zh-CN, en

      const to = lang === 'en' ? 'zh-CN' : 'en'
      const converter = new showdown.Converter()
      content = converter.makeHtml(content)
      content = await translate(content, { to }).then(res => res.text)
      // content = converter.makeMarkdown(content)
      content = html2markdown(content)
      this.setState({ contentTrans: content })
      Taro.hideLoading()
    } catch (e) {
      console.error(e)
      Taro.hideLoading()
      Taro.showToast({ title: Taro.T._('Translating failed'), icon: 'none' })
    }
  }

  handleTrans = () => {
    this.setState(
      prevState => ({
        showTrans: !prevState.showTrans,
      }),
      () => {
        if (this.state.showTrans && !this.state.contentTrans) {
          this.translateContent(this.state.content)
        }
      }
    )
  }

  promptMdLink = async () => {
    // TODO
    const { confirm } = await Taro.showModal({
      title: '评测 ID',
      content: `你可以在评测中通过\n[链接文字](eval#${this.props.theEval.id})\n的语法来链接到这条评测`,
      confirmColor: '#ff9800',
      cancelText: '取消',
      confirmText: '复制链接',
    })
    if (confirm) {
      try {
        await Taro.setClipboardData({
          data: `[链接文字](eval#${this.props.theEval.id})`,
        })
        Taro.showToast({ title: '复制成功' })
      } catch (e) {
        Taro.showToast({ title: '复制失败', icon: 'none' })
      }
    }
  }

  render() {
    const { score_design, score_qlty, score_spl } = this.props.theEval
    const score_comp = helper.calcScoreComp({
      score_design,
      score_qlty,
      score_spl,
    })

    return (
      <View className="eval-container">
        <View className="header">
          <View className="header-left">
            <Avatar
              src={this.props.author.avatar}
              size={64}
              uid={this.props.author.id}
            />
            <View className="user-info">
              <View className="basic">
                <View className="nickname">{this.props.author.nickname}</View>
                <UIcon icon={helper.parseGender(this.props.author.gender)} />
                <View className="badge">
                  <Badge
                    type="email_verification"
                    status={this.props.author.is_verified}
                  />
                </View>
              </View>
              <View className="intro">
                <Text>{helper.parseMajor(this.props.author.major_code)}</Text>
                {/* <Text className="level">{this.props.author.level}</Text> */}
              </View>
            </View>
          </View>

          <View className="header-right" onClick={this.promptMdLink}>
            #{this.props.theEval.id}
          </View>
        </View>

        <View className="eval-rate">
          <View className="left">
            <View className="rate-container">
              <View className="rate-name">{Taro.T._('Design')}</View>
              <Rate defaultValue={score_design} disabled />
            </View>
            <View className="rate-container">
              <View className="rate-name">{Taro.T._('Quality')}</View>
              <Rate defaultValue={score_qlty} disabled />
            </View>
            <View className="rate-container">
              <View className="rate-name">{Taro.T._('Simplicity')}</View>
              <Rate defaultValue={score_spl} disabled />
            </View>
            <View className="rate-container">
              <View className="rate-name">{Taro.T._('Course Year')}</View>
              {this.props.theEval.year || Taro.T._('Unknown')}
            </View>
          </View>
          <View className="right">
            <View className="view-count">
              <UIcon icon="view" icon-class="view-icon" />
              {this.props.theEval.view_count}
            </View>
            <View className="score-comp">
              <Text className="comp">{Taro.T._('Comprehensive')}：</Text>
              {score_comp}
            </View>
          </View>
        </View>
        {/* <View className="showTrans" onClick={this.handleTrans}>
          {this.state.showTrans ? '查看原文' : '查看翻译'}
        </View> */}
        <CensorshipHint
          show={this.props.theEval.is_censored}
          reason={this.props.theEval.censor_reason}
        />
        <View className="content">
          {/* TODO: year!!! */}
          <wemark
            md={
              this.state.showTrans
                ? this.state.contentTrans
                : this.state.content
            }
            link
            highlight
            type="wemark"
          />
          {/* <Text>{this.props.theEval.content}</Text> */}
        </View>
        <View className="footer">
          <Text>
            {`${Taro.T._('Posted on')} ${time.format(
              this.props.theEval.created_at
            )} · ${Taro.T._('Copyright belongs to the author')}`}
          </Text>
        </View>
      </View>
    )
  }
}
