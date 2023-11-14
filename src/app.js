import '@tarojs/async-await'

import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import config from './config'
import api from './utils/api'
import T from './utils/i18n'
import locales from './utils/locales'

import './utils/ald-stat'
import './app.scss'
// import tdweapp from './utils/tdweapp'
const tdweapp = require('./utils/tdweapp')

class MyApp extends Component {
  config = {
    pages: [
      'pages/index/index',
      // 'pages/careers/careers',
      // 'pages/careers/cmarticle',
      'pages/me/me',
      'pages/fav/fav',
      'pages/drafts/drafts',
      'pages/hint-md/hint-md',
      'pages/schools/schools',
      'pages/timetable/timetable',
    ],
    subpackages: [
      {
        root: 'subpackages/course',
        pages: [
          'pages/course/course',
          'pages/course-detail/course-detail',
          'pages/course-search-md/course-search-md',
        ],
      },
      {
        root: 'subpackages/askall',
        pages: [
          'pages/askall/askall',
          'pages/askall-detail/askall-detail',
          'pages/askall-post/askall-post',
        ],
      },
      {
        root: 'subpackages/share',
        pages: ['pages/share/share'],
      },
      {
        root: 'subpackages/search',
        pages: ['pages/search/search'],
      },
      {
        root: 'subpackages/discover',
        pages: ['pages/discover/discover'],
      },
      {
        root: 'subpackages/profile',
        pages: ['pages/profile/profile'],
      },
      {
        root: 'subpackages/web-view-page',
        pages: ['pages/web-view-page/web-view-page'],
      },
      {
        root: 'subpackages/comment',
        pages: ['pages/comments/comments', 'pages/comment/comment'],
      },
      {
        root: 'subpackages/eval',
        pages: [
          'pages/eval/eval',
          'pages/eval-new/eval-new',
          'pages/eval-temp/eval-temp',
        ],
      },
      {
        root: 'subpackages/cards',
        pages: ['pages/cards/cards'],
      },
      {
        root: 'subpackages/course-qa',
        pages: ['pages/course-qa/course-qa'],
      },
      {
        root: 'subpackages/settings',
        pages: [
          'pages/settings/settings',
          'pages/settings-language/settings-language',
          'pages/settings-timetable/settings-timetable',
        ],
      },
      {
        root: 'subpackages/exchange',
        pages: [
          'pages/school/school',
          'pages/school-eval-new/school-eval-new',
          'pages/eval/eval',
        ],
      },
      {
        root: 'subpackages/timetable',
        pages: [
          'pages/activities/activities',
          'pages/activity/activity',
          'pages/activity-search/activity-search',
          'pages/add-custom-activity/add-custom-activity',
          'pages/export-pdf/export-pdf',
          'pages/export-ical/export-ical',
          'pages/wechat-reminder/wechat-reminder',
          'pages/change-background/change-background',
        ],
      },
      {
        root: 'subpackages/profile-edit',
        pages: [
          'pages/profile-edit/profile-edit',
          'pages/profile-edit-email/profile-edit-email',
          'pages/profile-edit-major/profile-edit-major',
          'pages/profile-edit-id/profile-edit-id',
        ],
      },
      {
        root: 'subpackages/topic',
        pages: ['pages/topic/topic', 'pages/topic-new-course/topic-new-course'],
      },
    ],
    window: {
      navigationBarBackgroundColor: '#FFF',
      navigationBarTextStyle: 'black',
      navigationBarTitleText: 'uCourse',
      navigationStyle: 'custom',
      backgroundColor: '#FF9800',
      backgroundTextStyle: 'light',
      backgroundColorTop: '#FF9800',
      backgroundColorBottom: '#FF9800',
      enablePullDownRefresh: false,
      onReachBottomDistance: 50,
    },
    tabBar: {
      color: '#666',
      selectedColor: '#FF9800',
      backgroundColor: '#FFF',
      borderStyle: 'white',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '',
          iconPath: 'assets/discover-o.png',
          selectedIconPath: 'assets/discover.png',
        },
        {
          pagePath: 'pages/schools/schools',
          text: '',
          iconPath: 'assets/school-o.png',
          selectedIconPath: 'assets/school.png',
        },
        // {
        //   pagePath: 'pages/careers/careers',
        //   text: '',
        //   iconPath: 'assets/discover-o.png', //TODO: add new icon
        //   selectedIconPath: 'assets/discover.png', //TODO: add new icon
        // },
        {
          pagePath: 'pages/timetable/timetable',
          text: '',
          iconPath: 'assets/timetable-o.png',
          selectedIconPath: 'assets/timetable.png',
        },
        {
          pagePath: 'pages/me/me',
          text: '',
          iconPath: 'assets/me-o.png',
          selectedIconPath: 'assets/me.png',
        },
      ],
      position: 'bottom',
    },
    networkTimeout: {
      request: 10000,
      connectSocket: 10000,
      uploadFile: 10000,
      downloadFile: 20000,
    },
    debug: true,
    navigateToMiniProgramAppIdList: ['wx8abaf00ee8c3202e'],
  }

  componentWillMount() {
    const locale = Taro.getStorageSync('locale') || 'zh_CN'
    Taro.T = new T(locales, locale)
    this.initSystemInfo()
    this.checkUpdate()
  }

  componentDidMount() {
    setTimeout(() => {
      this.login()
    }, 500)
    this.initNetworkType()
    this.initVersionInfo()
    this.initSessionId()
  }

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  initLocales = (lang = 'zh_CN') => {
    let locale = Taro.getStorageSync('locale')
    if (!locale) {
      locale = lang
      Taro.setStorage({ key: 'locale', data: locale })
    }
    Taro.T = new T(locales, locale)
    this.setTabBarItem()
  }

  setTabBarItem = () => {
    Taro.setTabBarItem({
      index: 0,
      text: Taro.T._('Discover'),
    })
    Taro.setTabBarItem({
      index: 1,
      text: Taro.T._('Schools'),
    })
    // Taro.setTabBarItem({
    //   index: 2,
    //   text: Taro.T._('Careers'),
    // })
    Taro.setTabBarItem({
      index: 2,
      text: Taro.T._('Timetable'),
    })
    Taro.setTabBarItem({
      index: 3,
      text: Taro.T._('Me'),
    })
  }

  checkUpdate = () => {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(({ hasUpdate }) => {
      if (hasUpdate) {
        Taro.showLoading({ title: '检测到新版本', mask: true })
      }
    })

    updateManager.onUpdateReady(async () => {
      Taro.hideLoading()
      await Taro.showModal({
        title: `新版本 v${config.version}`,
        content: config.changelog,
        showCancel: false,
        confirmText: '重启更新',
        confirmColor: '#ff9800',
      })
      await updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(() => {
      Taro.hideLoading()
    })
  }

  login = async () => {
    await api.login()
    const res = await api.Users.create()
    Taro.getApp().aldstat.sendOpenid(res.openid)
  }

  initSystemInfo = async () => {
    if (!Taro.systemInfo) {
      console.log('get systemInfo')
      const systemInfo = await Taro.getSystemInfo()
      systemInfo.clientVersion = config.version
      this.initLocales(systemInfo.language)
      console.log(systemInfo)
      Taro.systemInfo = systemInfo
    }
  }

  initNetworkType = async () => {
    if (!Taro.networkType) {
      console.log('get networkType')
      const { networkType } = await Taro.getNetworkType()
      console.log({ networkType })
      Taro.networkType = networkType
    }
  }

  initVersionInfo = async () => {
    if (Taro.getStorageSync('version') !== config.version) {
      Taro.setStorage({ key: 'version', data: config.version })
    }
  }

  initSessionId = async () => {
    if (Taro.getStorageSync('sessionId') && !Taro.getStorageSync('userInfo')) {
      // fix userInfo
      api.Users.create()
    }
  }
  render() {
    return <Index />
  }
}

Taro.render(<MyApp />, document.getElementById('app'))
