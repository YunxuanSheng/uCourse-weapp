import Taro, { Component } from '@tarojs/taro'
import { Button } from '@tarojs/components'
import classnames from 'classnames'
import './Btn.scss'

export default class Btn extends Component {
  static defaultProps = {
    type: '', // default, primary, ghost, info, success, warning, error
    size: '', // large、small、default
    shape: 'square', //circle, square, radius, round
    disabled: false,
    loading: false,
    long: false,
    ripple: false,
    formType: '',
    openType: '',
    appParameter: '',
    hoverClass: '',
    hoverStopPropagation: false,
    hoverStartTime: 20,
    hoverStayTime: 70,
    onGetPhoneNumber: () => {},
    onClick: () => {},
    lang: 'zh_CN',
    text: '',
  }

  onClickHandler = e => {
    this.props.onClick(e)
  }

  onGotPhoneNumber = e => {
    this.props.onGetPhoneNumber(e)
  }

  render() {
    return (
      <Button
        className={classnames(
          'u-btn',
          { 'u-btn-long': this.props.long },
          `u-btn-${this.props.size}`,
          `u-btn-${this.props.type}`,
          `u-btn-${this.props.shape}`,
          { [`u-btn-${this.props.type}-ripple`]: this.props.ripple },
          { 'u-btn-shadow': this.props.shadow },
          { 'u-btn-loading': this.props.loading },
          { 'u-btn-disabled': this.props.disabled },
        )}
        formType={this.props.formType}
        openType={this.props.openType}
        appParameter={this.props.appParameter}
        hoverClass={this.props.hoverClass}
        hoverStopPropagation={this.props.hoverStopPropagation}
        hoverStartTime={this.props.hoverStartTime}
        hoverStayTime={this.props.hoverStayTime}
        onGetProfile={this.onGotProfile}
        onGetPhoneNumber={this.onGotPhoneNumber}
        onClick={this.onClickHandler}
        lang={this.props.lang}
        disabled={this.props.disabled}
      >
        {this.props.text || this.props.children}
      </Button>
    )
  }
}
