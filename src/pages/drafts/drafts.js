import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../components/Navigation/Navigation'
import UIcon from '../../components/UIcon/UIcon'
import './drafts.scss'
import Abnor from '../../components/Abnor/Abnor'
import Loading from '../../components/Loading/Loading'

const DISPLAY_CONTENT_LENGTH = 50

export default class Drafts extends Component {
  state = {
    drafts: [],
    isFinished: false,
  }

  componentWillMount() {
    this.initDraftData()
  }

  componentDidShow() {
    // after creating from a draft
    this.initDraftData()
  }

  initDraftData = () => {
    const evalDrafts = Taro.getStorageSync('evalDrafts') || []
    this.setState({
      drafts: evalDrafts,
      isFinished: true,
    })
  }

  navToEval(draft) {
    Taro.navigateTo({
      url: `/subpackages/eval/pages/eval-new/eval-new?code=${draft.courseCode}&mode=draft`,
    })
  }

  deleteDraft = async (index, e) => {
    e.stopPropagation()
    const { confirm } = await Taro.showModal({
      title: Taro.T._('Confirm Deletion'),
      content: Taro.T._('Delete this draft?'),
      confirmColor: '#f40',
      confirmText: Taro.T._('Delete'),
    })
    if (!confirm) {
      return
    }
    Taro.showLoading({ title: Taro.T._('Deleting'), mask: true })
    const evalDrafts = Taro.getStorageSync('evalDrafts') || []
    evalDrafts.splice(index, 1)
    Taro.setStorageSync('evalDrafts', evalDrafts)
    this.setState({
      drafts: evalDrafts,
    })
    Taro.hideLoading()
    Taro.showToast({ title: Taro.T._('Deleted'), icon: 'none' })
  }

  render() {
    return (
      <View className="drafts-page">
        <Navigation title={Taro.T._('Drafts')} />
        {this.state.drafts.map((draft, index) => {
          const contentRaw = draft.content
          let content = contentRaw.slice(0, DISPLAY_CONTENT_LENGTH)
          const courseCode = draft.courseCode
          if (contentRaw.length >= DISPLAY_CONTENT_LENGTH) {
            content = content.concat('...')
          }
          return (
            <View
              key={courseCode}
              className="draft"
              onClick={this.navToEval.bind(this, draft)}
            >
              <View className="draft-header">
                <View>{courseCode}</View>
                <View
                  className="delete"
                  onClick={this.deleteDraft.bind(this, index)}
                >
                  <UIcon icon-class="icon" icon="trash" />
                  {Taro.T._('Delete')}
                </View>
              </View>
              <View className="draft-content">{content}</View>
            </View>
          )
        })}
        {this.state.isFinished && this.state.drafts.length === 0 && (
          <Abnor title={Taro.T._('No drafts')} />
        )}
        {!this.state.isFinished && <Loading color="primary" />}
      </View>
    )
  }
}
