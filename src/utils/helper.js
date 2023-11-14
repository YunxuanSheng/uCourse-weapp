import Taro from '@tarojs/taro'
import { majorData } from './data'
import config from '../config'
import time from './time'

export default {
  oneDecimal(num = 0, total = 1) {
    total = total === 0 ? 1 : total // prevent NAN
    const avg = num / total
    return avg.toFixed(1)
  },

  parseGender(gender) {
    const map = {
      1: 'male',
      2: 'female',
      3: 'unknown',
    }
    return map[gender]
  },

  parseAction(action) {
    const map = {
      NEW: '发布',
      LIKE: '点赞',
      COMMENT: '评论',
      VOTE: '赞同',
    }
    return map[action]
  },

  parseObject(type) {
    const map = {
      POST: '帖子',
      EVAL: '课程评测',
      ESEVAL: '学校评测',
    }
    return map[type]
  },

  parseMajor(majorCode) {
    if (!majorCode) {
      return undefined
    }
    let name
    try {
      name = majorData
        .filter(school =>
          school.majors.some(major => major.code === majorCode)
        )[0]
        .majors.filter(major => major.code === majorCode)[0].name
    } catch (e) {
      return majorCode
    }
    return name
  },

  calcScoreAvg({ total, count }) {
    if (count === 0) {
      count = 1
    }
    const avg = (total / count).toFixed(1)
    return avg
  },

  calcScoreComp({ score_design = 0, score_qlty = 0, score_spl = 0 }) {
    const score_comp = (
      score_design * 0.4 +
      score_qlty * 0.4 +
      score_spl * 0.2
    ).toFixed(1)
    return score_comp
  },

  async checkPermission() {
    const { is_verified, language } = Taro.getStorageSync('userInfo')
    if (!language) {
      Taro.hideLoading()
      const { confirm } = await Taro.showModal({
        title: Taro.T._('All Beginnings are Hard'),
        content: Taro.T._('Please login first.'),
        cancelText: Taro.T._('Nope'),
        confirmText: Taro.T._('Login'),
        confirmColor: '#ff9800',
      })
      if (confirm) {
        Taro.switchTab({ url: '/pages/me/me' })
      }
      throw new Error('unverified')
    }

    if (!is_verified) {
      Taro.hideLoading()
      const { confirm } = await Taro.showModal({
        title: Taro.T._('Just One Step Away'),
        content: Taro.T._('Please verify your email account.'),
        cancelText: Taro.T._('Let me out'),
        confirmText: Taro.T._('Go Veri'),
        confirmColor: '#ff9800',
      })
      if (confirm) {
        Taro.navigateTo({
          url: '/subpackages/profile-edit/pages/profile-edit/profile-edit',
        })
      }
      throw new Error('unverified')
    }

    return Promise.resolve(true)
  },

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  },

  async openDocument(url) {
    try {
      Taro.showLoading({ title: Taro.T._('Loading document') })
      const { tempFilePath } = await Taro.downloadFile({
        url: config.baseUrl + url,
      })
      Taro.hideLoading()
      Taro.openDocument({
        filePath: tempFilePath,
      })
    } catch (err) {
      Taro.hideLoading()
      Taro.showToast({ title: Taro.T._('Loading failed'), icon: 'none' })
      console.error(err)
    }
  },

  generateRandomAvatar({ size = 128 } = {}) {
    return `https://api.adorable.io/avatars/${size}/${Math.random().toString(
      36
    )}.png`
  },

  async openWebLink(url) {
    // copy
    await Taro.setClipboardData({
      data: url,
    })

    await Taro.showModal({
      title: url.length < 25 ? url : '',
      content: Taro.T._(
        'External websites cannot be opened in Mini Programmes. The link has been copied. Please go to the browser to access it.'
      ),
      showCancel: false,
      confirmText: Taro.T._('OK'),
      confirmColor: '#FF9800',
    })
  },

  isLoggedIn() {
    const { language } = Taro.getStorageSync('userInfo') || {}
    return !!language
  },

  withLogin(lifecycle = 'componentWillMount') {
    return function withLoginComponent(Component) {
      return class WithLogin extends Component {
        constructor(props) {
          super(props)
        }

        async componentWillMount() {
          if (super.componentWillMount) {
            if (lifecycle === 'componentWillMount') {
              const res = await this.$_autoLogin()
              if (!res) return
            }

            super.componentWillMount()
          }
        }

        async componentDidMount() {
          if (super.componentDidMount) {
            if (lifecycle === 'componentDidMount') {
              const res = await this.$_autoLogin()
              if (!res) return
            }

            super.componentDidMount()
          }
        }

        async componentDidShow() {
          if (super.componentDidShow) {
            if (lifecycle === 'componentDidShow') {
              const res = await this.$_autoLogin()
              if (!res) return
            }

            super.componentDidShow()
          }
        }

        $_autoLogin = () => {
          const { language } = Taro.getStorageSync('userInfo')
          if (!language) {
            Taro.navigateTo({ url: '/pages/me2/me' })
          }
        }
      }
    }
  },

  convertStandardWeekToSchoolWeek(isoWeek = time.now().week) {
    // y=[1+sgn(x-37)](x-37)/2+[1-sgn(x-37)](x+15)/2

    // const schoolWeek = -26 * Math.sign(isoWeek - 39) + isoWeek - 11
    
    //TODO: Logic Adjustment

    let schoolWeek
    if (isoWeek >= 37) {
      schoolWeek = isoWeek - 36
    } else {
      schoolWeek = isoWeek + 16
    }

    return schoolWeek
  },

  convertSchoolWeekToStandardWeek(schoolWeek = time.now().week + 15) {
    const startDate = '2018-09-16 00:00:00'

    const isoWeek = time
      .moment(startDate)
      .add(schoolWeek - 1, 'weeks')
      .isoWeek()

    return isoWeek
  },

  paletteReplacer({ palette, replaceMap } = {}) {
    /** bg */
    if (palette.background.includes('_')) {
      for (const entry of Object.entries(replaceMap)) {
        palette.background.replace(entry[0], entry[1])
      }
    }
    /** views */
    const KEY_MAP = {
      image: 'url',
      text: 'text',
    }
    palette.views = palette.views.map(view => {
      const key = KEY_MAP[view.type]
      if (key && view[key].includes('_')) {
        for (const entry of Object.entries(replaceMap)) {
          view[key] = view[key].replace(entry[0], entry[1])
        }
      }
      return view
    })

    return palette
  },
}
