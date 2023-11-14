import Taro, { Component } from '@tarojs/taro'
import { View, Text, Textarea, Switch } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import Rate from '../../../../components/Rate/Rate'
import { years } from '../../../../utils/data'
import api from '../../../../utils/api'

import '../../../eval/pages/eval-new/eval-new.scss'

export default class SchoolEvalNew extends Component {
  state = {
    mode: '',
    contentLen: '0',
    score: 0,
    content: '',
    year: '1819',
    years: [],
    hide_anonymous: true,
    is_anonymous: false,
  }

  componentWillMount() {
    this.fetchOrigin()
    this.getIfHideAnonymous();
    this.setState({
      years,
      year: years[0].value,
    })
  }

  getIfHideAnonymous = async () => {
    const info = await api.Timetable.getInfo()
    const { hexId } = info;
    this.setState({
      hide_anonymous: !hexId
    })
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  fetchOrigin = async () => {
    const { id, mode } = this.$router.params
    if (id) {
      // edit eval
      Taro.showLoading({ title: Taro.T._('Fetching'), mask: true })
      const theEval = await api.Exchanges.Evals.retrieve(id)
      const { score, content, year, is_anonymous } = theEval
      this.setState(
        {
          mode,
          score,
          content,
          contentLen: content.length,
          year,
          is_anonymous,
        },
        () => {
          Taro.hideLoading()
        }
      )
    }
  }

  handleRateChange = (score_type, value) => {
    const { id } = this.$router.params
    if (id) {
      // not allowed to change rate if update
      Taro.showToast({
        title: Taro.T._("You can't change your rates now"),
        icon: 'none',
      })
      return
    }
    Taro.vibrateShort()
    this.setState({ [score_type]: value })
  }

  handleInput = e => {
    const content = e.detail.value
    const contentLen = content.length.toLocaleString()
    this.setState({ contentLen, content })
  }

  handleSubmit = async () => {
    try {
      Taro.vibrateShort()
      console.log(this.state)
      const { score, content, year, is_anonymous } = this.state
      const hasNotRated = [score].some(v => v === 0)
      const schoolId = this.$router.params.schoolId
      const evalId = this.$router.params.id

      if (hasNotRated) {
        Taro.showToast({
          title: Taro.T._('Please complete the rates'),
          icon: 'none',
        })
        return
      }

      if (content.length === 0) {
        Taro.showToast({
          title: Taro.T._('Write something?'),
          icon: 'none',
        })
        return
      }

      if (schoolId) {
        // new

        const { confirm } = await Taro.showModal({
          title: Taro.T._('Confirm the publishing'),
          content: Taro.T._(
            "After the publishing, you can't change the rates any more. But you can still edit the content of this evaluation and other information"
          ),
          confirmText: Taro.T._('Publish'),
          confirmColor: '#FF9800',
        })

        if (!confirm) {
          return
        }

        const body = {
          schoolId,
          score,
          content,
          year,
          is_anonymous,
        }

        Taro.showLoading({ title: Taro.T._('Publishing'), mask: true })
        try {
          const data = await api.Exchanges.Evals.create(body)
          Taro.hideLoading()
          Taro.showToast({
            title: Taro.T._('Published'),
            icon: 'success',
            mask: true,
            duration: 1500,
          })
          this.timer = setTimeout(() => {
            Taro.redirectTo({
              url: `/subpackages/exchange/pages/eval/eval?id=${data.id}&title=${this.$router.params.code}`,
            })
            data.user = Taro.getStorageSync('userInfo')
            Taro.eventCenter.trigger('refreshEvals', data)
          }, 1500)
        } catch (err) {
          throw err
        }
        return
      }

      if (evalId) {
        // update
        const body = { content, year, is_anonymous }
        Taro.showLoading({ title: Taro.T._('Publishing'), mask: true })
        try {
          await api.Exchanges.Evals.update(evalId, body)
          Taro.hideLoading()
          Taro.showToast({
            title: Taro.T._('Published'),
            icon: 'success',
            mask: true,
            duration: 1500,
          })
          this.timer = setTimeout(() => {
            Taro.navigateBack()
            Taro.eventCenter.trigger('refreshEval')
          }, 1500)
        } catch (err) {
          console.error(err)
        }
        return
      }
    } catch (e) {
      Taro.hideLoading()
      console.error(e)
    }
  }

  showMdHint = () => {
    Taro.navigateTo({
      url: '/pages/hint-md/hint-md',
    })
  }

  handleYearChange = value => {
    Taro.vibrateShort()
    this.setState({ year: value })
  }

  uploadImg = async () => {
    try {
      Taro.vibrateShort()
      let tempFilePaths
      try {
        const res = await Taro.chooseImage({ count: 1 })
        tempFilePaths = res.tempFilePaths
      } catch (e) {
        throw new Error(Taro.T._('No image is selected'))
      }

      let picLink
      try {
        Taro.showLoading({ title: Taro.T._('Uploading image'), mask: true })
        const res = await api.Pic.upload(tempFilePaths[0])
        Taro.hideLoading()
        picLink = res.data
      } catch (e) {
        throw new Error(Taro.T._('Uploading failed'))
      }

      const picMdLink = `![${Taro.T._('Image Description')}](${picLink})`
      this.setState(prevState => ({
        content: prevState.content + '\n\n' + picMdLink,
      }))
    } catch (e) {
      // Taro.hideLoading()
      Taro.showToast({ title: e.message, icon: 'none' })
      console.error(e)
    }
  }

  handleNavBack = async () => {
    const { confirm } = await Taro.showModal({
      title: Taro.T._('Confirm Quitting'),
      content: Taro.T._(
        'The content has not been saved, are you sure to quit?'
      ),
      confirmColor: '#f40',
      confirmText: Taro.T._('Quit'),
    })
    if (confirm) {
      Taro.navigateBack()
    }
  }

  handleAnonymousChange = e => {
    const checked = e.detail.value
    Taro.vibrateShort()
    this.setState({ is_anonymous: checked })
  }

  render() {
    const isNewEval = !!this.$router.params.id
    return (
      <View className="eval-new-page">
        <Navigation
          title={Taro.T._('A New Evaluation')}
          onNavBack={this.handleNavBack}
        />

        {!isNewEval && (
          <View className="card-container">
            <View className="card-title">
              {Taro.T._('Rates for the School')}
            </View>

            <View className="card-body">
              <View className="rate-item">
                <View>{Taro.T._('Rate')}</View>
                <Rate
                  size={60}
                  showText
                  value={this.state.score}
                  onChange={this.handleRateChange.bind(this, 'score')}
                  disabled={isNewEval}
                />
              </View>
            </View>

            <View className="card-footer">
              {Taro.T._('You can swipe to rate.')}
            </View>
          </View>
        )}

        <View className="card-container">
          <View className="card-title">
            {Taro.T._('Content of the Evaluation')}
          </View>

          <View className="card-body">
            <View className="content-container">
              <Textarea
                value={this.state.content}
                className="textarea"
                placeholder={Taro.T._('My opinion on this school...')}
                maxlength={10000}
                onInput={this.handleInput}
                autoHeight
              />
              <View className="word-count">
                {this.state.contentLen.toLocaleString()} / 10,000
              </View>
            </View>
            <View className="pic-uploader" onClick={this.uploadImg}>
              <UIcon icon-class="icon" icon="add" />
              <View>{Taro.T._('Tap to upload images')}</View>
            </View>
          </View>

          <View className="card-footer" onClick={this.showMdHint}>
            {Taro.T._('Support Markdown Language.')}
            <Text className="show-more">{Taro.T._('Know more')}</Text>
          </View>
        </View>

        <View className="card-container">
          <View className="card-title">
            {Taro.T._('Additional Information')}
          </View>

          <View className="card-hint">
            {Taro.T._('The year when I was in this school')}
          </View>

          <View className="card-body">
            <View className="year-tag-container">
              {this.state.years.map(y => (
                <View
                  className={`year-tag year-tag-${
                    y.value === this.state.year ? 'active' : ''
                  }`}
                  key={y.value}
                  onClick={this.handleYearChange.bind(this, y.value)}
                >
                  {y.year}
                </View>
              ))}
            </View>
          </View>
        </View>
   
          {!this.state.hide_anonymous && 
          (<View>
            <View className="card-hint">
              {Taro.T._('Hide my personal information')}
            </View>
            
            <View className="card-body">
              <View className="switch-container">
                <View className="label">{Taro.T._('Anonymous')}</View>
                <Switch
                  checked={this.state.is_anonymous}
                  onChange={this.handleAnonymousChange}
                  color="#ff9800"
                />
              </View>
            </View>
          
          </View>
        )}

        <View className="btns-container">
          <View className="btn post-btn">
            <Btn
              size="large"
              type="primary"
              shadow
              text={
                this.state.mode === 'edit'
                  ? Taro.T._('Update')
                  : Taro.T._('Publish')
              }
              onClick={this.handleSubmit}
            />
          </View>
        </View>
      </View>
    )
  }
}
