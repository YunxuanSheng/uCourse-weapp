import Taro from '@tarojs/taro'
import request from './request'

class BaseRequest {
  _baseRequest = (method = 'GET') => async (url, body, config = {}) => {
    try {
      const sessionId = Taro.getStorageSync('sessionId')
      const res = await request[method.toLowerCase()](url, body, {
        headers: { 'Session-Id': sessionId },
        ...config,
      })
      const { data } = res.data.data ? res.data : res
      return data
    } catch (e) {
      console.error('Api request error: ', e)
      // handle known 400 errors
      const { errorCode, message } = JSON.parse(e.message)
      Taro.hideLoading()
      this._handleError({ errorCode, message })
      throw e
    }
  }

  _get = this._baseRequest('GET')

  _post = this._baseRequest('POST')

  _delete = this._baseRequest('DELETE')

  _put = this._baseRequest('PUT')

  _getBaseUrl = () => request.config.baseURL

  _handleError = ({ errorCode, message }) => {
    const ERR_MAP = {
      125: 'Not a user',
      126: 'Invalid user',
      127: 'Please provide your email',
      128: 'Failed to update user info',
      130: 'You can only create one evaluation for each course',
      131: "Can't find this course",
      132: "Can't find this evaluation",
      141: 'Course has already existed in this topic',
      151: "Can't find student_id for the current user",
      152: "Can't access timetable now",
      153: 'Cannot Find Student Set',
      154: 'Failed to update timetable activity',
      155: 'Cannot find this openid',
      156: 'Timetable not matched with the official one',
      181: 'Detected risk content',
      191: '该兑换码不存在',
      192: '该兑换码已被使用',
      401: 'Unauthorized',
      403: 'Incorrect session ID',
    }
    const title = ERR_MAP[errorCode] || message
    Taro.showToast({
      title: Taro.T._(title),
      icon: 'none',
    })
  }
}

class Api extends BaseRequest {
  login = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        Taro.showLoading({ title: Taro.T._('Logging in'), mask: true })
        if (!Taro.getStorageSync('sessionId')) {
          // login if no session
          const { errMsg, code } = await Taro.login()
          if (code) {
            const res = await request.post('/login', { code })
            const { data } = res.data
            const { sessionId, userInfo } = data
            Taro.setStorage({ key: 'sessionId', data: sessionId })
            if (userInfo) {
              Taro.setStorageSync('userInfo', userInfo)
            } else {
              Taro.setStorageSync('userInfo', {})
            }
            return resolve(userInfo)
          } else {
            throw new Error(Taro.T._('Unable to get login status'), errMsg)
          }
        } else {
          resolve(Taro.getStorageSync('userInfo'))
        }
      } catch (e) {
        Taro.showToast({ title: e.message, icon: 'none' })
        reject(e)
      } finally {
        Taro.hideLoading()
      }
    })
  }

  Careers = new (class Careers extends BaseRequest {
    browse = async tab => {
      return await this._get(`/careers/${tab}`)
    }
    view = async _id => {
      return await this._post(`/careers/${_id}/view`)
    }
    like = async _id => {
      return await this._post(`/careers/${_id}/like`)
    }
    getArticle = async _id => {
      return await this._get(`/careers/articles/${_id}`)
    }
  })()

  Email = new (class Email extends BaseRequest {
    verify = async ({ code }) => await this._post(`/email/verify`, { code })
  })()

  Users = new (class Users extends BaseRequest {
    create = async (userInfo = {}) => {
      const data = await this._post('/users', userInfo)
      data.id && Taro.setStorageSync('userInfo', data)
      return data
    }

    update = async (userInfo = {}) => {
      const { id, unionid } = Taro.getStorageSync('userInfo')
      let encryptedData, iv
      if (!unionid) {
        let obj
        try {
          obj = await wx.getUserProfile({
            desc: '获取发布、回复测评的身份信息',
            lang: 'zh_CN',
          })
          encryptedData = obj.encryptedData
          iv = obj.iv
        } catch (e) {
          console.error(e)
        }
      }
      const data = await this._post(`/users/${id}`, {
        encryptedData,
        iv,
        userInfo,
      })
      data.id && Taro.setStorageSync('userInfo', data)
      return data
    }

    retrieve = async (userId = Taro.getStorageSync('userInfo').id) =>
      await this._get(`/users/${userId}`)

    Activities = new (class Activities extends BaseRequest {
      *browse(userId = 'self', { limit = 10, ...query } = {}) {
        let i = 0
        let res
        let hasMore = true
        do {
          yield (res = this._get(`/users/${userId}/activities`, {
            ...query,
            limit,
            offset: i * limit,
          }))
          res.then(data => {
            hasMore = data.rows.length === limit
          })
          ++i
        } while (hasMore)
      }
    })()

    Evals = new (class Evals extends BaseRequest {
      *browse(userId = 'self', { limit = 10, ...query } = {}) {
        let i = 0
        let res
        let hasMore = true
        do {
          yield (res = this._get(`/users/${userId}/evals`, {
            ...query,
            limit,
            offset: i * limit,
          }))
          res.then(data => {
            const len = data.rows.length
            hasMore = len === limit
          })
          ++i
        } while (hasMore)
      }
    })()

    Medals = new (class Medals extends BaseRequest {
      get = async (userId = 'self') =>
        await this._get(`/users/${userId}/medals`)

      create = async body => await this._post(`/medals`, body)
    })()

    Favs = new (class Favs extends BaseRequest {
      Evals = new (class Evals extends BaseRequest {
        *browse(userId = 'self', { limit = 10, ...query } = {}) {
          let i = 0
          let res
          let hasMore = true
          do {
            yield (res = this._get(`/users/${userId}/favs/evals`, {
              ...query,
              limit,
              offset: i * limit,
            }))
            res.then(data => {
              hasMore = data.length === limit
            })
            ++i
          } while (hasMore)
        }

        create = async body => await this._post(`/favs/evals`, body)

        delete = async id => await this._delete(`/favs/evals/${id}`)
      })()
    })()
  })()

  Home = new (class Home extends BaseRequest {
    *browse({ target = 'myCourses', limit = 10, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/home/${target}`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          hasMore = data.length === limit
        })
        ++i
      } while (hasMore)
    }

    overview = async query => await this._get('/home', query)
  })()

  Courses = new (class Courses extends BaseRequest {
    *browse({ limit = 100, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/courses`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          hasMore = data.length === limit
        })
        ++i
      } while (hasMore)
    }

    retrieve = async (code, official = false, options = {}) => {
      if (official) {
        // retrieve the official data
        return await this._get(`/courses`, { code, ...options })
      } else {
        return await this._get(`/courses/${code}`)
      }
    }
  })()

  Evals = new (class Evals extends BaseRequest {
    *browse({ limit = 10, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/evals`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          const len = data.evals.rows.length
          hasMore = len > 0 && len === limit
        })
        ++i
      } while (hasMore)
    }

    create = async ({
      courseCode,
      content,
      design,
      quality,
      simplicity,
      ...query
    }) => {
      design = parseInt(design, 10)
      quality = parseInt(quality, 10)
      simplicity = parseInt(simplicity, 10)
      const containsZero = design * quality * simplicity === 0
      if (containsZero) {
        throw Error(Taro.T._('Rate not completed'))
      } else {
        const body = {
          courseCode,
          content,
          design,
          quality,
          simplicity,
          ...query,
        }
        return await this._post('/evals', body)
      }
    }

    update = async (id, body) => await this._post(`/evals/${id}`, body)

    retrieve = async id => await this._get(`/evals/${id}`)

    delete = async id => await this._delete(`/evals/${id}`)

    getTemps = async (query = {}) => await this._get(`/eval_temps`, query)

    retrieveTemp = async id => await this._get(`/eval_temps/${id}`)
  })()

  Votes = new (class Votes extends BaseRequest {
    create = async body => await this._post('/votes', body)

    update = async (id, body) => await this._post(`/votes/${id}`, body)

    delete = async id => await this._delete(`/votes/${id}`)
  })()

  Comments = new (class Comments extends BaseRequest {
    *browse({ limit = 10, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/comments`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          hasMore = data.length === limit
        })
        ++i
      } while (hasMore)
    }

    *retrieve(id, { limit = 10, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/comments/${id}`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          hasMore = data.length === limit
        })
        ++i
      } while (hasMore)
    }

    create = async body => await this._post('/comments', body)
  })()

  CommentLikes = new (class CommentLikes extends BaseRequest {
    create = async ({ commentId }) =>
      await this._post('/comment_likes', { commentId })

    delete = async id => await this._delete(`/comment_likes/${id}`)
  })()

  Qr = new (class Qr extends BaseRequest {
    get = async query => await this._get(`/qr`, query)
  })()

  Banners = new (class Banners extends BaseRequest {
    get = async query => await this._get(`/banners`, query)
  })()

  Posters = new (class Posters extends BaseRequest {
    get = async query => await this._get(`/posters`, query)
  })()

  Promo = new (class Promo extends BaseRequest {
    get = async body => await this._post('/promo/get', body)
  })()

  Log = new (class Log extends BaseRequest {
    post = async body => await this._post(`/log`, body)
  })()

  Pic = new (class Pic extends BaseRequest {
    upload = async filePath =>
      await Taro.uploadFile({
        url: request.config.baseURL + '/pic',
        filePath,
        name: 'file',
      }).then(res => JSON.parse(res.data))
  })()

  Topics = new (class Topics extends BaseRequest {
    *browse({ limit = 10, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/topics`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          hasMore = data.length === limit
        })
        ++i
      } while (hasMore)
    }

    retrieve = async id => await this._get(`/topics/${id}`)

    create = async body => await this._post('/topic_courses', body)

    Courses = new (class Courses extends BaseRequest {
      *browse({ limit = 10, ...query } = {}) {
        let i = 0
        let res
        let hasMore = true
        do {
          yield (res = this._get(`/topic_courses`, {
            ...query,
            limit,
            offset: i * limit,
          }))
          res.then(data => {
            hasMore = data.length === limit
          })
          ++i
        } while (hasMore)
      }

      create = async body => await this._post('/topic_courses', body)

      Votes = new (class Votes extends BaseRequest {
        create = async ({ topicCourseId }) =>
          await this._post('/topic_course_votes', { topicCourseId })
      })()
    })()
  })()

  TopicComments = new (class Comments extends BaseRequest {
    *browse({ limit = 10, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/topic_comments`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          hasMore = data.length === limit
        })
        ++i
      } while (hasMore)
    }

    *retrieve(id, { limit = 10, ...query } = {}) {
      let i = 0
      let res
      let hasMore = true
      do {
        yield (res = this._get(`/topic_comments/${id}`, {
          ...query,
          limit,
          offset: i * limit,
        }))
        res.then(data => {
          hasMore = data.length === limit
        })
        ++i
      } while (hasMore)
    }

    create = async body => await this._post('/topic_comments', body)
  })()

  TopicCommentLikes = new (class CommentLikes extends BaseRequest {
    create = async ({ commentId }) =>
      await this._post('/topic_comment_likes', { commentId })

    delete = async id => await this._delete(`/topic_comment_likes/${id}`)
  })()

  Exchanges = new (class Exchanges extends BaseRequest {
    browse = async () => await this._get('/exchanges')

    retrieve = async id => await this._get(`/exchanges/${id}`)

    Evals = new (class Evals extends BaseRequest {
      *browse({ limit = 10, ...query } = {}) {
        let i = 0
        let res
        let hasMore = true
        do {
          yield (res = this._get(`/exchange_evals`, {
            ...query,
            limit,
            offset: i * limit,
          }))
          res.then(data => {
            const len = data.evals.rows.length
            hasMore = len > 0 && len === limit
          })
          ++i
        } while (hasMore)
      }

      retrieve = async id => await this._get(`/exchange_evals/${id}`)

      create = async body => await this._post('/exchange_evals', body)

      update = async (id, body) =>
        await this._post(`/exchange_evals/${id}`, body)
    })()

    Votes = new (class Votes extends BaseRequest {
      create = async body => await this._post('/exchange_eval_votes', body)

      update = async (id, body) =>
        await this._post(`/exchange_eval_votes/${id}`, body)

      delete = async id => await this._delete(`/exchange_eval_votes/${id}`)
    })()
  })()

  // https://zxf.one/2016/10/26/360-image-search-api/
  ImgSo = new (class ImgSo extends BaseRequest {
    getImages = async ({
      q,
      src,
      correct,
      sn,
      pn = 10,
      zoom,
      color,
      t,
      isRandom = false,
      randomRange = 10,
    } = {}) => {
      if (isRandom) {
        sn = Math.random() * randomRange
      }
      const { list } = await this._get(
        'https://image.so.com/j',
        { q, src, correct, sn, pn, zoom, color, t },
        { baseURL: '' }
      )

      const imgList = list.map(item => item.img)

      return imgList
    }
  })()

  Timetable = new (class Timetable extends BaseRequest {
    browse = async query =>
      await this._get('/timetable/v2', query, {
        timeout: 20000,
        'keep-alive': 'timeout=20',
      })

    save = async body => await this._post('/timetable/v2/save', body)

    create = async body => await this._post('/timetable/v2', body)

    update = async body => await this._post('/timetable/v2/update', body)

    delete = async body => await this._delete('/timetable/v2', body)

    customActivity = async body =>
      await this._post('/timetable/v2/customActivity', body)

    getCustomActivities = async query =>
      await this._get('/timetable/v2/customActivity', query)

    getSources = async query => await this._get('/timetable/v2/sources', query)

    getConfig = async query => await this._get('/timetable/v2/config', query)

    setConfig = async body => await this._post('/timetable/v2/config', body)

    getInfo = async query => await this._get('/timetable/v2/info', query)

    getNotice = async query => await this._get('/timetable/v2/notice', query)

    getExams = async query => await this._get('/timetable/v2/exam', query)

    addExamsToCustomActivities = async body =>
      await this._post('/timetable/v2/exam', body)

    getICalLink = async ({ type = 'normal' }) => {
      // type: webcal, http
      // - webcal: webcal://
      // - http: http://, https://
      const userInfo = Taro.getStorageSync('userInfo')
      const openid = userInfo.openid
      let url = this._getBaseUrl() + '/timetable/v2/ical?openid=' + openid
      if (type === 'webcal') {
        url = url.replace('https', 'webcal').replace('http', 'webcal')
      }
      return url
    }

    getExamICalLink = async () => {
      const userInfo = Taro.getStorageSync('userInfo')
      const openid = userInfo.openid
      let url =
        this._getBaseUrl() + '/timetable/v2/ical?isExam=1&openid=' + openid
      return url
    }

    getFreeIcalLink = async query =>
      await this._get('/timetable/v2/freeIcal', query)

    verifyVip = async query => await this._get('/timetable/v2/verifyVip', query)
  })()

  Short = new (class Short extends BaseRequest {
    get = async query => await this._get('/short', query)
  })()

  CourseQA = new (class CourseQA extends BaseRequest {
    get = async query => await this._get(`/course_qa/${query}`)

    getById = async (course_code, question_id) =>
      await this._get(`/course_qa/${course_code}/${question_id}`)
    thumbUp = async (course_code, question_id, reply_id) =>
      await this._post(
        `/course_qa/${course_code}/${question_id}/replies/${reply_id}/like`
      )

    getReplyList = async (course_code, question_id, reply_id) =>
      await this._get(
        `/course_qa/${course_code}/${question_id}/replies/${reply_id}`
      )

    create = async (course_code, body) =>
      await this._post(`/course_qa/${course_code}`, body)

    watch = async (course_code, question_id) =>
      await this._post(`/course_qa/${course_code}/${question_id}/watch`)

    watched = async (course_code, question_id) =>
      await this._get(`/course_qa/${course_code}/${question_id}/watch`)

    reply = async (course_code, question_id, body) =>
      await this._post(`/course_qa/${course_code}/${question_id}/replies`, body)

    update_reply = async (course_code, question_id, reply_id, body) =>
      await this._post(
        `course_qa/${course_code}/${question_id}/replies/${reply_id}`,
        body
      )

    liked_questions = async user_id =>
      await this._get(`/users/${user_id}/course_qa/questions/watching`)

    liked_replies = async user_id =>
      await this._get(`/users/${user_id}/course_qa/replies/liked`)

    my_questions = async user_id =>
      await this._get(`/users/${user_id}/course_qa/questions/created`)

    my_replies = async user_id =>
      await this._get(`/users/${user_id}/course_qa/replies/created`)
  })()

  ExaminePass = new (class ExaminePass extends BaseRequest {
    get = async () => await this._get(`/examine_pass`)
  })()
}

export default new Api()
