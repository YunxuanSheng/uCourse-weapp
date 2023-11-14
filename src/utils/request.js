import Taro from '@tarojs/taro'
import Fly from 'flyio/dist/npm/wx'
import config from '../config'
// import helper from './helper'

const request = new Fly()
const newRquest = new Fly()

// config.baseUrl = 'http://localhost:7001'
// config.baseUrl = 'https://songkeys.top'

request.config.baseURL = config.baseUrl + '/api'
newRquest.config = request.config

request.interceptors.request.use(async conf => {
  const { url, method } = conf
  const allowedPostUrls = [
    '/login',
    '/users',
    '/email',
    '/favs/evals',
    '/topic_comment_likes',
    '/topic_comments',
    '/topic_course_votes',
  ]
  const isExcept = allowedPostUrls.some(v => url.includes(v))
  if (method !== 'GET' && !isExcept) {
    try {
      // await helper.checkPermission()
    } catch (e) {
      throw e
    }
  }

  return conf
})

request.interceptors.response.use(
  response => response,
  async err => {
    try {
      // re-login if the session expires / incorrect
      console.error('Error in request response:', err)

      if (err.status === 0) {
        // network issues
        throw new Error(Taro.T._('Server not responding'))
      }

      const { status } = err.response
      if (
        status === 401 ||
        status === 403 ||
        (status === 400 && err.response.data.errorCode === 125) // Not a user
      ) {
        request.lock()
        // re-login
        const { errMsg, code } = await Taro.login()
        if (code) {
          const res = await newRquest.post('/login', { code })
          const { data } = res.data
          const { sessionId, userInfo } = data
          Taro.setStorageSync('sessionId', sessionId)
          if (userInfo) {
            Taro.setStorageSync('userInfo', userInfo)
          }
          request.unlock()
          // re-request
          err.request.headers['Session-Id'] = sessionId
          return await request.request(err.request)
        } else {
          request.unlock()
          throw new Error(Taro.T._('Unable to get login status'), errMsg)
          return err
        }
      } else if (status === 400) {
        throw new Error(JSON.stringify(err.response.data))
      } else {
        throw new Error(Taro.T._('Server not responding'))
      }
    } catch (e) {
      if (e.message.includes('errorCode')) {
        throw new Error(e.message)
      } else {
        Taro.showToast({ title: e.message, icon: 'none' })
        throw e
      }
    }
  }
)

export default request
