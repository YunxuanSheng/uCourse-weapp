import Taro, { Component } from '@tarojs/taro'
import { AtInput, AtButton } from 'taro-ui'
import { View } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import Abnor from '../../../../components/Abnor/Abnor'
import Btn from '../../../../components/Btn/Btn'
import Loading from '../../../../components/Loading/Loading'
import CardInfo from './components/CardInfo/CardInfo'
import api from '../../../../utils/api'
import time from '../../../../utils/time'
import './cards.scss'

export default class Cards extends Component {
  state = {
    isAddCard: false,
    isFinished: false,
    code: '',
    vouchers: [],
  }

  componentWillMount() {
    this.fetchCard()
  }

  navToAddCard = () => {
    this.setState({ isAddCard: true })
  }

  navToCards = () => {
    this.setState({ isAddCard: false, isFinished: false })
    this.fetchCard()
  }

  handleChange = value => {
    this.setState({
      code: value,
    })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  handleCodeSubmit = async () => {

    if (!this.state.code) {
      await Taro.showModal({
        title: '提示',
        content: '系统繁忙，请重试提交'
        /* 这是骗用户的。
        用某些手机输入法输入兑换码的时候，字典匹配功能会使得输入的信息不能及时更新到
        this.state.code，导致提交到后端的字符串为空。此时只需重试提交即可。
        */
      })
      return;
    }

    Taro.showLoading({
      title: '兑换中',
    })
    await api._post('shop/vouchers/receive', {
      code: this.state.code,
    })
    Taro.hideLoading()
    Taro.showToast({
      icon: 'success',
      title: '兑换成功',
    })
    this.navToCards()
  }

  fetchCard = async () => {
    this.setState({
      vouchers: [],
    })
    const res = await api._get('shop/vouchers')
    // console.log(res)
    this.setState({
      vouchers: res,
      isFinished: true,
    })
  }

  render() {
    return (
      <View className="cards-page">
        <Navigation title={Taro.T._('Card Holder')} />
        <View className="contain-box">
          <View className="btn-box">
            <Btn
              type="primary"
              shape="circle"
              size="medium"
              text="添加卡券"
              onClick={this.navToAddCard}
            />
            <Btn
              type="info"
              shape="circle"
              size="medium"
              text="我的卡券"
              onClick={this.navToCards}
            />
          </View>
          {this.state.isAddCard === false &&
            this.state.vouchers.map(voucherDetail => {
              const { id, code, expired_at, voucher } = voucherDetail
              const { name, type, bg_image } = voucher
              const expiredAt = time.YYYYMMDD(expired_at)
              let content = ''
              if (name === '2020年秋·会员') {
                content = '您已经是会员了'
              }
              return (
                <CardInfo
                  key={id}
                  code={code}
                  expiredAt={expiredAt}
                  name={name}
                  type={type}
                  bgImage={bg_image}
                  content={content}
                />
              )
            })}
          {this.state.isAddCard === true && (
            <AtInput
              name="code"
              title="兑换码"
              type="text"
              placeholder="输入兑换码"
              value={this.state.code}
              onChange={this.handleChange}
              autoFocus
            >
              <AtButton
                type="primary"
                size="small"
                onClick={this.handleCodeSubmit}
              >
                确定
              </AtButton>
            </AtInput>
          )}
        </View>
        {!this.state.isAddCard && !this.state.isFinished && (
          <Loading color="primary" />
        )}
        {this.state.isAddCard === false
          && this.state.isFinished
          && this.state.vouchers.length === 0
          && (
            <Abnor title="你还没有任何卡券" />
        )}
      </View>
    )
  }
}
