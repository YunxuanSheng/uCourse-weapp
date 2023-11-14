import Taro, { Component } from '@tarojs/taro'
import { View, Text, Textarea, Switch, Input } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import Rate from '../../../../components/Rate/Rate'
import { years } from '../../../../utils/data'
import api from '../../../../utils/api'

import './eval-new.scss'

export default class EvalNew extends Component {
  state = {
    mode: '',
    contentLen: '0',
    design: 0,
    quality: 0,
    simplicity: 0,
    content: '',
    year: '1819',
    years: [],
    hide_anonymous: true,
    is_anonymous: false,
    invitationCode: undefined,
  }

  componentWillMount() {
    this.fetchOrigin()
    this.fetchDraft()
    this.getIfHideAnonymous();
    this.setState({
      years,
      year: years[0].value,
    })
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  getIfHideAnonymous = async () => {
    const info = await api.Timetable.getInfo()
    const { hexId } = info;
    this.setState({
      hide_anonymous: !hexId
    })
  }

  fetchOrigin = async () => {
    const { id, mode } = this.$router.params
    if (id) {
      // edit eval
      Taro.showLoading({ title: Taro.T._('Fetching'), mask: true })
      const theEval = await api.Evals.retrieve(id)
      const {
        score_design,
        score_qlty,
        score_spl,
        content,
        year,
        is_anonymous,
      } = theEval
      this.setState(
        {
          mode: mode,
          design: score_design,
          quality: score_qlty,
          simplicity: score_spl,
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

  fetchDraft = async () => {
    const { mode } = this.$router.params
    if (mode === 'draft') {
      const draftList = Taro.getStorageSync('evalDrafts') || []
      const index = this.getDraftIndex(draftList)
      if (!(index === -1)) {
        const draft = draftList[index]
        const design = draft.design
        const quality = draft.quality
        const simplicity = draft.simplicity
        const content = draft.content
        const year = draft.year
        const is_anonymous = draft.is_anonymous
        this.setState({
          mode,
          contentLen: content.length,
          design,
          quality,
          simplicity,
          content,
          year,
          is_anonymous,
        })
      }
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

  handleInputCode = e => {
    const content = e.detail.value
    this.setState({ invitationCode: content })
  }

  getDraftIndex = (draftList = []) => {
    const courseCode = this.$router.params.code
    const index = draftList.findIndex(o => {
      return o.courseCode === courseCode
    })
    return index
  }

  removeDraft = () => {
    const draftList = Taro.getStorageSync('evalDrafts') || []
    const index = this.getDraftIndex(draftList)
    if (index === -1) {
      return
    }
    draftList.splice(index, 1)
    Taro.setStorageSync('evalDrafts', draftList)
  }

  handleSubmit = async () => {
    try {
      Taro.vibrateShort()
      console.log(this.state)
      const {
        design,
        quality,
        simplicity,
        content,
        year,
        is_anonymous,
        invitationCode,
      } = this.state
      const hasNotRated = [design, quality, simplicity].some(v => v === 0)
      const courseCode = this.$router.params.code
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

      if (invitationCode) {
        const temp = await api.Promo.get({ promo_code: invitationCode })
        if (!temp.hasOwnProperty('promo_code')) {
          Taro.showToast({
            title: Taro.T._('Wrong Invitation Code'),
            icon: 'none',
          })
          return
        }
      }

      if (courseCode) {
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
          courseCode,
          design,
          quality,
          simplicity,
          content,
          year,
          is_anonymous,
          promo_code: invitationCode,
        }

        Taro.showLoading({ title: Taro.T._('Publishing'), mask: true })
        try {
          const data = await api.Evals.create(body)
          const res = await api.Promo.get({ create: true })
          Taro.hideLoading()
          if (!res.first) {
            Taro.showToast({
              title: Taro.T._('Published'),
              icon: 'success',
              mask: true,
              duration: 1500,
            })
            this.timer = setTimeout(() => {
              Taro.redirectTo({
                url: `/subpackages/eval/pages/eval/eval?id=${data.id}&title=${this.$router.params.code}`,
              })
              data.user = Taro.getStorageSync('userInfo')
              Taro.eventCenter.trigger('refreshEvals', data)
            }, 1500)
          } else {
            const { promo_code } = res;
            await Taro.showModal({
              title: Taro.T._('Published'),
              content: Taro.T._('Your invitation code is: ') + promo_code,
              confirmText: Taro.T._('Confirm'),
              confirmColor: '#FF9800',
              showCancel: false,
              success: () => {
                Taro.redirectTo({
                  url: `/subpackages/eval/pages/eval/eval?id=${data.id}&title=${this.$router.params.code}`,
                })
                data.user = Taro.getStorageSync('userInfo')
                Taro.eventCenter.trigger('refreshEvals', data)
              },
            })
          }
          this.removeDraft()
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
          await api.Evals.update(evalId, body)
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
      // Taro.hideLoading()
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

  handleSave = () => {
    // only for new eval
    Taro.vibrateShort()
    Taro.showLoading({ title: Taro.T._('Saving'), mask: true })

    const courseCode = this.$router.params.code
    const draft = {
      courseCode,
      design: this.state.design,
      quality: this.state.quality,
      simplicity: this.state.simplicity,
      content: this.state.content,
      year: this.state.year,
      is_anonymous: this.state.is_anonymous,
    }
    const evalDrafts = Taro.getStorageSync('evalDrafts') || []

    let isNewDraft = true
    evalDrafts.forEach((d, i) => {
      if (d.courseCode === courseCode) {
        //cover
        evalDrafts[i] = draft
        isNewDraft = false
      }
    })

    if (isNewDraft) {
      evalDrafts.push(draft)
    }

    Taro.setStorageSync('evalDrafts', evalDrafts)

    Taro.hideLoading()
    Taro.showToast({
      title: Taro.T._('Saved'),
      icon: 'success',
      mask: true,
      duration: 1000,
    })
    this.timer = setTimeout(() => {
      const pages = Taro.getCurrentPages()
      const path = pages[pages.length - 2 < 0 ? 0 : pages.length - 2].route
      if (path === 'pages/drafts/drafts') {
        Taro.navigateBack()
      } else {
        Taro.redirectTo({ url: '/pages/drafts/drafts' })
      }
    }, 1000)
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
      Taro.hideLoading()
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
              {Taro.T._('Rates for the Course')}
            </View>

            <View className="card-body">
              <View className="rate-item">
                <View>{Taro.T._('Design')}</View>
                <Rate
                  size={60}
                  showText
                  value={this.state.design}
                  onChange={this.handleRateChange.bind(this, 'design')}
                  disabled={isNewEval}
                />
              </View>
              <View className="rate-item">
                <View>{Taro.T._('Quality')}</View>
                <Rate
                  size={60}
                  showText
                  value={this.state.quality}
                  onChange={this.handleRateChange.bind(this, 'quality')}
                  disabled={isNewEval}
                />
              </View>
              <View className="rate-item">
                <View>{Taro.T._('Simplicity')}</View>
                <Rate
                  size={60}
                  showText
                  value={this.state.simplicity}
                  onChange={this.handleRateChange.bind(this, 'simplicity')}
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
                placeholder={Taro.T._('My opinion on this course...')}
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
            {Taro.T._('The year when I took this course')}
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
          </View>)}
          {this.state.mode !== 'edit' && (
            <View>
              {Taro.T._('Invitation Code')}
              <Input
                value={this.state.invitationCode}
                placeholder={Taro.T._('Please Enter Invitation Code')}
                onInput={this.handleInputCode}
              />
            </View>
          )}
        </View>

        <View className="btns-container">
          {this.state.mode !== 'edit' && (
            <View className="btn save-btn">
              <Btn
                size="large"
                type="ghost"
                shadow
                text={Taro.T._('Save as Draft')}
                onClick={this.handleSave}
              />
            </View>
          )}

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
