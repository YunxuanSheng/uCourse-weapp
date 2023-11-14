import Taro from '@tarojs/taro'
import languages, { isSupported, getCode } from './language'
import get from './token'

function transText(text, opts) {
  opts = opts || {}

  let e
  ;[opts.from, opts.to].forEach(function(lang) {
    if (lang && !isSupported(lang)) {
      e = new Error()
      e.code = 400
      e.message = "The language '" + lang + "' is not supported"
    }
  })
  if (e) {
    return new Promise(function(resolve, reject) {
      reject(e)
    })
  }

  opts.from = opts.from || 'auto'
  opts.to = opts.to || 'auto'

  opts.from = getCode(opts.from)
  opts.to = getCode(opts.to)

  return get(text)
    .then(function(token) {
      var url = 'https://translate.google.cn/translate_a/single'
      //https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params
      var data = {
        // client: 't',
        client: 'gtx', // https://github.com/matheuss/google-translate-api/issues/79
        sl: opts.from,
        tl: opts.to,
        hl: opts.to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 7,
        q: text,
      }
      data[token.name] = token.value
      delete data.q
      let query = '?'
      Object.keys(data).forEach(key => {
        if (key === 'dt') {
          data[key].forEach(dt => {
            query += '&dt=' + dt
          })
        } else if (query !== '?') {
          query += '&'
          query = query + key + '=' + data[key]
        } else {
          query = query + key + '=' + data[key]
        }
      })
      return url + query
    })
    .then(url => {
      return Taro.request({
        url: url,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: { q: text },
      }).then(function(res) {
        var result = {
          text: '',
          from: {
            language: {
              didYouMean: false,
              iso: '',
            },
            text: {
              autoCorrected: false,
              value: '',
              didYouMean: false,
            },
          },
          raw: '',
        }

        if (opts.raw) {
          result.raw = res.data
        }

        var body = res.data
        body[0] &&
          body[0].forEach(function(obj) {
            if (obj[0]) {
              result.text += obj[0]
            }
          })

        if (body[2] === body[8][0][0]) {
          result.from.language.iso = body[2]
        } else {
          result.from.language.didYouMean = true
          result.from.language.iso = body[8][0][0]
        }

        if (body[7] && body[7][0]) {
          var str = body[7][0]

          str = str.replace(/<b><i>/g, '[')
          str = str.replace(/<\/i><\/b>/g, ']')

          result.from.text.value = str

          if (body[7][5] === true) {
            result.from.text.autoCorrected = true
          } else {
            result.from.text.didYouMean = true
          }
        }

        return result
      })
    })
    .catch(function(err) {
      console.error(err)
      e = new Error()
      if (err.statusCode !== undefined && err.statusCode !== 200) {
        e.code = 'BAD_REQUEST'
        e.message = err
      } else {
        e.code = 'BAD_NETWORK'
        e.message = err
      }
      throw e
    })
}

async function translate(text, opts) {
  if (text.length < 5000) {
    return await transText(text, opts)
  } else {
    const chunkString = str => str.match(/(.|[\r\n]){1,5000}/g)
    const chunks = chunkString(text)
    const resArr = await Promise.all(chunks.map(c => transText(c, opts)))
    let res = JSON.parse(JSON.stringify(resArr[0]))
    res.text = ''
    resArr.forEach(el => {
      res.text = res.text + el.text
    })
    return Promise.resolve(res)
  }
}
export default translate
export { languages }
